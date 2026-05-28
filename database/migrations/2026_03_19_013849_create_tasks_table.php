<?php

use App\Enums\Categories;
use App\Enums\Priorities;
use App\Enums\RecurrenceTypes;
use App\Enums\ReminderIntervals;
use App\Models\User;
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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description')->nullable();
            $table->foreignIdFor(User::class)->constrained()->onDelete('cascade');
            $table->enum('priority', Priorities::cases());
            $table->enum('category', Categories::cases());
            $table->enum('reminder', ReminderIntervals::cases());
            $table->enum('recurrence_type', RecurrenceTypes::cases())->nullable();
            $table->string('recurrence_value')->nullable();
            $table->string('google_calendar_event_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
