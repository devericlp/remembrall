import { usePage } from "@inertiajs/react";

export function useLang() {
    const { translations } = usePage<{ translations: Record<string, unknown> }>().props;

    function __(key: string, params: Record<string, string> = {}): string {
        const raw: unknown = key.split('.').reduce((obj: unknown, i) => (obj as Record<string, unknown>)?.[i], translations);

        if (typeof raw !== 'string') return key;

        // Substituições tipo :name, :count
        let value = raw;
        Object.keys(params).forEach(param => {
            value = value.replace(
                new RegExp(`:${param}`, 'g'),
                params[param]
            );
        });

        return value;
    }

    return { __ };
}