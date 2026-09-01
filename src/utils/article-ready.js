export function waitForImages(container, options = {}) {
    const { timeout = 3000, signal } = options;
    if (signal?.aborted) return Promise.resolve("aborted");

    const images = Array.from(container?.querySelectorAll?.("img") || []).filter((image) => !image.complete);
    if (!images.length) return Promise.resolve("loaded");

    return new Promise((resolve) => {
        let settled = false;
        let remaining = images.length;
        let timer = null;
        const cleanups = [];

        const settle = (status) => {
            if (settled) return;
            settled = true;
            if (timer) clearTimeout(timer);
            cleanups.forEach((cleanup) => cleanup());
            resolve(status);
        };

        images.forEach((image) => {
            const handleDone = () => {
                remaining -= 1;
                if (!remaining) settle("loaded");
            };
            image.addEventListener("load", handleDone, { once: true });
            image.addEventListener("error", handleDone, { once: true });
            cleanups.push(() => {
                image.removeEventListener("load", handleDone);
                image.removeEventListener("error", handleDone);
            });
        });

        const handleAbort = () => settle("aborted");
        if (signal) {
            signal.addEventListener("abort", handleAbort, { once: true });
            cleanups.push(() => signal.removeEventListener("abort", handleAbort));
        }

        timer = setTimeout(() => settle("timeout"), Math.max(0, timeout));
    });
}

export function createArticleReadyTracker(options = {}) {
    const {
        timeout = 3000,
        onReady = () => {
            if (typeof window !== "undefined") window.__READY__ = true;
        },
    } = options;
    let controller = null;

    const cancel = () => {
        controller?.abort();
        controller = null;
    };

    const wait = async (container) => {
        cancel();
        const current = new AbortController();
        controller = current;
        const status = await waitForImages(container, { timeout, signal: current.signal });
        if (controller !== current || current.signal.aborted) return false;

        controller = null;
        onReady(status);
        return true;
    };

    return { wait, cancel };
}
