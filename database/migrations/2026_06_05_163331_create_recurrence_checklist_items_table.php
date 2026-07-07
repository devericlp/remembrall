<?php

use App\Models\Recurrence;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('recurrence_checklist_items', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Recurrence::class)->constrained()->onDelete('cascade');
            $table->string('description');
            $table->boolean('completed')->default(false);
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recurrence_checklist_items');
    }
};
