export function canGoNextCursorPage({ loading = false, nextCursor, total = 0, page = 1, pageSize = 0 } = {}) {
    const currentPage = Number(page);
    const normalizedPageSize = Number(pageSize);
    const normalizedTotal = Number(total);

    if (loading || !nextCursor) return false;
    if (!Number.isFinite(currentPage) || currentPage < 1) return false;
    if (!Number.isFinite(normalizedPageSize) || normalizedPageSize <= 0) return false;
    if (!Number.isFinite(normalizedTotal) || normalizedTotal <= 0) return false;

    return currentPage * normalizedPageSize < normalizedTotal;
}
