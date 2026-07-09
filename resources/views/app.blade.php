<html>

<head>
    <meta charset="utf-8" />
    <meta name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content" />
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="Remembrall">
    <meta name="theme-color" content="#0B0F15">
    <link rel="apple-touch-icon" href="/images/logo/icon-appstore.png">
    <link rel="manifest" href="/build/manifest.webmanifest">
    @viteReactRefresh
    @vite(['resources/js/app.tsx', 'resources/css/app.css'])
    @inertiaHead
</head>

<body>
    @inertia
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js', {
                        scope: '/'
                    })
                    .then(reg => console.log('[SW] Registrado com escopo:', reg.scope))
                    .catch(err => console.error('[SW] Erro ao registrar:', err));
            });
        }
    </script>
</body>

</html>
