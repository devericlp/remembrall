<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOccurrenceTimeRequest;
use App\Models\Recurrence;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;

class UpdateOccurrenceTimeController extends Controller
{
    public function __invoke(UpdateOccurrenceTimeRequest $request, Recurrence $recurrence): RedirectResponse
    {
        [$startHour, $startMinute] = explode(':', $request->startTime);
        [$endHour, $endMinute] = explode(':', $request->endTime);

        $recurrence->update([
            'start_date' => Carbon::parse($recurrence->start_date)->setTime((int) $startHour, (int) $startMinute),
            'end_date' => Carbon::parse($recurrence->end_date)->setTime((int) $endHour, (int) $endMinute),
        ]);

        return back();
    }
}
