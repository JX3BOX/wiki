export function createLatestRequestGuard() {
    let generation = 0;
    let active = true;

    return {
        begin() {
            active = true;
            generation += 1;
            return generation;
        },
        isCurrent(token) {
            return active && token === generation;
        },
        invalidate() {
            active = false;
            generation += 1;
        },
    };
}
