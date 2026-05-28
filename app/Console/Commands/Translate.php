<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

class Translate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'translate {file=messages}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Translate words in a language file, to en and pt_BR';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $words = $this->ask('Enter the words to translate separated by commas');
        $words = array_map('trim', explode(',', $words));

        $translations = [];

        $lang_codes = [
            'en' => 'en',
            'pt_BR' => 'pt',
        ];

        $lang_names = [
            'en' => 'English',
            'pt_BR' => 'Portuguese',
        ];

        foreach ($words as $word) {

            $langth = "Translating: {$word}";

            $this->info("\n".str_repeat('#', strlen($langth) + 10));
            $this->info("###  Translating: {$word}  ###");
            $this->info(str_repeat('#', strlen($langth) + 10));

            $translations[$word] = [];

            foreach ($lang_codes as $lang => $google_code) {

                // Get automatic translation
                $suggested = $this->translateWord($word, $google_code);
                $suggested = ucfirst($suggested);

                // Show suggestion and ask for confirmation
                $this->line("\nSuggested {$lang_names[$lang]} translation: {$suggested}");

                if (! $this->confirm('Is this translation correct?', true)) {
                    // If not correct, ask for manual input
                    $translations[$word][$lang] = $this->ask(
                        "Please enter the correct {$lang_names[$lang]} translation"
                    );
                } else {
                    $translations[$word][$lang] = $suggested;
                }

                usleep(100000); // 100ms delay between API calls
            }
        }

        // Update each language file
        foreach (array_keys($lang_codes) as $lang) {
            $this->updateTranslationFile($lang, $translations);
        }

        $this->info('Translations added successfully!');
    }

    private function translateWord($word, $target_lang, $source_lang = 'en')
    {
        $url = 'https://translate.googleapis.com/translate_a/single';

        try {
            $response = Http::get($url, [
                'client' => 'gtx',
                'dt' => 't',
                'q' => str_replace('_', ' ', $word),
                'sl' => $source_lang,
                'tl' => $target_lang,
            ]);

            if ($response->successful()) {
                $result = $response->json();

                return $result[0][0][0] ?? $word;
            }
        } catch (\Exception $e) {
            $this->error("Translation error: {$e->getMessage()}");
        }

        return $word;
    }

    private function updateTranslationFile($lang, $translations)
    {
        $file = $this->argument('file');
        $file_path = base_path("resources/lang/{$lang}/{$file}.php");

        // Create directory if it doesn't exist
        if (! File::exists(dirname($file_path))) {
            File::makeDirectory(dirname($file_path), 0755, true);
        }

        // Get existing translations or create new array
        $existing_translations = [];

        if (File::exists($file_path)) {
            $existing_translations = require $file_path;
        }

        // Add new translations
        foreach ($translations as $key => $values) {
            $existing_translations[$key] = $values[$lang];
        }

        // Sort translations by key
        ksort($existing_translations);

        // Create PHP array content
        $content = "<?php\n\nreturn [\n";

        foreach ($existing_translations as $k => $v) {
            $content .= "    '{$k}' => '{$v}',\n";
        }
        $content .= "];\n";

        // Save file
        File::put($file_path, $content);
    }
}
