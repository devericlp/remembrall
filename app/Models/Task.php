<?php

namespace App\Models;

use Database\Factories\TaskFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    /** @use HasFactory<TaskFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'user_id',
        'reminder',
        'priority',
        'category',
        'recurrence_type',
        'recurrence_value',
        'renew_date',
        'google_calendar_event_id',
    ];

    /**
     * Get the task owner.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the task recurrences.
     *
     * @return HasMany<Recurrence>
     */
    public function recurrences(): HasMany
    {
        return $this->hasMany(Recurrence::class);
    }
}
