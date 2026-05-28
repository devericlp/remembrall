import { createInertiaApp, router } from '@inertiajs/react'
import React, { ReactNode } from "react"
import { createRoot } from 'react-dom/client'
import './bootstrap'
import DefaultLayout from './Layouts/DefaultLayout'

declare global {
    interface Window {
        router: typeof router;
    }
}

window.router = router

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob<{ default: React.ComponentType<any> }>(
            './Pages/**/*.tsx',
            { eager: true }
        )

        const page = pages[`./Pages/${name}.tsx`]

        if (!page) {
            throw new Error(`Page not found: ./Pages/${name}.tsx`)
        }

        const component = page.default

            ; (component as any).layout =
                (component as any).layout ||
                ((page: ReactNode) => <DefaultLayout>{page}</DefaultLayout>)

        return component
    },

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },
})