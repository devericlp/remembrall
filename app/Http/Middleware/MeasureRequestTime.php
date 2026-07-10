<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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

        $start = microtime(true);

        $response = $next($request);

        Log::info('Request timing', [
            'url' => $request->path(),
            'method' => $request->method(),
            'duration_ms' => round((microtime(true) - $start) * 1000, 2),
        ]);

        return $response;
    }
}
