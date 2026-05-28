<?php

namespace App\Models;

use Database\Factories\RecurrenceFactory;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
}
