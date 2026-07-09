import { useEffect, useState } from "react";

export function useKeyboardInset() {
    const [inset, setInset] = useState(0);

    useEffect(() => {
        const vv = window.visualViewport;
        if (!vv) return;

        function update() {
            requestAnimationFrame(() => {
                const keyboardHeight = window.innerHeight - vv!.height - vv!.offsetTop;
                setInset(keyboardHeight > 0 ? Math.round(keyboardHeight) : 0);
            });
        }

        vv.addEventListener("resize", update);
        vv.addEventListener("scroll", update);

        // força recomputo ao focar/desfocar inputs, cobrindo o atraso do primeiro ciclo no iOS
        document.addEventListener("focusin", update);
        document.addEventListener("focusout", update);

        update();

        return () => {
            vv.removeEventListener("resize", update);
            vv.removeEventListener("scroll", update);
            document.removeEventListener("focusin", update);
            document.removeEventListener("focusout", update);
        };
    }, []);

    return inset;
}