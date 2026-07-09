import { useEffect, useState } from "react";

export function useKeyboardInset() {
    const [inset, setInset] = useState(0);

    useEffect(() => {
        const vv = window.visualViewport;
        if (!vv) return;

        function update() {
            const keyboardHeight = window.innerHeight - vv!.height - vv!.offsetTop;
            setInset(keyboardHeight > 0 ? keyboardHeight : 0);
        }

        vv.addEventListener("resize", update);
        vv.addEventListener("scroll", update);
        update();

        return () => {
            vv.removeEventListener("resize", update);
            vv.removeEventListener("scroll", update);
        };
    }, []);

    return inset;
}