<?php

if (! function_exists('getTranslations')) {
    /**
     * Returns all translations as an array, which can be used in the frontend to provide translations for JavaScript components.
     */
    function getTranslations(): array
    {
        $locale = app()->getLocale();

        $path = resource_path("lang/{$locale}");

        $translations = [];

        foreach (glob($path.'/*.php') as $file) {
            $filename = basename($file, '.php');
            $translations[$filename] = require $file;
        }

        return $translations;
    }
}
