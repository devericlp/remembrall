<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('push_devices', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->uuid('device_id');

            $table->text('token');
            $table->string('token_hash', 64)->unique();

            $table->string('platform', 30)->nullable();
            $table->string('browser', 50)->nullable();
            $table->string('device_name')->nullable();

            $table->boolean('enabled')->default(true);

            $table->timestamp('token_refreshed_at')->nullable();
            $table->timestamp('last_seen_at')->nullable();
            $table->timestamp('last_success_at')->nullable();
            $table->timestamp('last_failure_at')->nullable();

            $table->string('last_error_code')->nullable();
            $table->text('last_error_message')->nullable();

            $table->timestamps();

            $table->unique(['user_id', 'device_id']);
            $table->index(['user_id', 'enabled']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('push_devices');
    }
};
