<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MeasureRequestTime
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        abort(555);
        $start = hrtime(true);

        $response = $next($request);

        $milliseconds = (hrtime(true) - $start) / 1_000_000;

        $response->headers->set(
            'Server-Timing',
            sprintf('laravel;dur=%.2f', $milliseconds),
        );

        $response->headers->set(
            'X-Laravel-Time',
            sprintf('%.2fms', $milliseconds),
        );

        return $response;
    }
}
