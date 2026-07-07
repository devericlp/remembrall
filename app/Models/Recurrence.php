<?php

namespace App\Models;

use Database\Factories\RecurrenceFactory;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Recurrence extends Model
{
    /** @use HasFactory<RecurrenceFactory> */
    use HasFactory;

    protected $fillable = [
        'task_id',
        'start_date',
        'end_date',
        'completed_at',
        'reminder_at',
    ];

    /**
     * Scope a query to only include overdue recurrences.
     */
    #[Scope]
    protected function overdue(Builder $query): void
    {
        $query->where('end_date', '<', now());
    }

    /**
     * Get the task that owns the recurrence.
     *
     * @return BelongsTo<Task, $this>
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    /**
     * @return HasMany<RecurrenceChecklistItem, $this>
     */
    public function checklistItems(): HasMany
    {
        return $this->hasMany(RecurrenceChecklistItem::class)->orderBy('order');
    }
}
