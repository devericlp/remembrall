<?php

namespace App\Models;

use App\Enums\ReminderIntervals;
use Database\Factories\RecurrenceFactory;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

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
        'reminder_sent_at',
    ];

    protected function casts(): array
    {
        return [
            'reminder_sent_at' => 'datetime',
        ];
    }

    /**
     * Scope a query to only include overdue recurrences.
     */
    #[Scope]
    protected function overdue(Builder $query): void
    {
        $query->where('end_date', '<', now());
    }

    /**
     * Scope a query to only include recurrences with a reminder that is due and not yet sent.
     */
    #[Scope]
    protected function reminderDue(Builder $query): void
    {
        $query->whereNull('completed_at')
            ->whereNull('reminder_sent_at')
            ->whereNotNull('reminder_at')
            ->where('reminder_at', '<=', Carbon::now())
            ->whereHas('task', fn (Builder $q) => $q->where('reminder', '!=', ReminderIntervals::NO_REMINDER->value));
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
