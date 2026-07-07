<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecurrenceChecklistItem extends Model
{
    protected $fillable = [
        'recurrence_id',
        'description',
        'completed',
        'order',
    ];

    protected $casts = [
        'completed' => 'boolean',
    ];

    public function recurrence(): BelongsTo
    {
        return $this->belongsTo(Recurrence::class);
    }
}
