<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PushDevice extends Model
{
    protected $fillable = [
        'user_id',
        'device_id',
        'token',
        'token_hash',
        'platform',
        'browser',
        'device_name',
        'enabled',
        'token_refreshed_at',
        'last_seen_at',
        'last_success_at',
        'last_failure_at',
        'last_error_code',
        'last_error_message',
    ];

    protected function casts(): array
    {
        return [
            'enabled' => 'boolean',
            'token_refreshed_at' => 'datetime',
            'last_seen_at' => 'datetime',
            'last_success_at' => 'datetime',
            'last_failure_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
