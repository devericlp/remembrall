declare module 'react-dom/client' {
    import type { ReactNode } from 'react';

    export interface Root {
        render(children: ReactNode): void;
        unmount(): void;
    }

    export interface RootOptions {
        identifierPrefix?: string;
    }

    export function createRoot(
        container: Element | Document | DocumentFragment,
        options?: RootOptions,
    ): Root;

    export function hydrateRoot(
        container: Element | Document,
        initialChildren: ReactNode,
        options?: RootOptions,
    ): Root;
}
