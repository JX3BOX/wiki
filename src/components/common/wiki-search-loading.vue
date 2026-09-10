<template>
    <div class="m-wiki-search-loading" role="status" aria-live="polite" aria-busy="true">
        <div class="u-loading-caption">
            <span class="u-spinner" aria-hidden="true"></span>
            <span>{{ $t("ui.common.status.searching") }}</span>
        </div>
        <div class="m-loading-rows" aria-hidden="true">
            <div v-for="row in 3" :key="row" class="u-loading-row">
                <span class="u-loading-icon"></span>
                <div class="u-loading-content">
                    <span class="u-loading-title"></span>
                    <span class="u-loading-description"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default { name: "WikiSearchLoading" };
</script>

<style lang="less">
.m-wiki-search-loading {
    width: 100%;
    padding: 8px 0 4px;
    box-sizing: border-box;

    .u-loading-caption {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 14px;
        color: #9690a6;
        font-size: 12px;
        line-height: 20px;
    }

    .u-spinner {
        width: 14px;
        height: 14px;
        box-sizing: border-box;
        border: 2px solid #e9e4f5;
        border-top-color: #9987ce;
        border-radius: 50%;
        animation: wiki-search-spin 0.9s linear infinite;
    }

    .m-loading-rows { display: grid; gap: 12px; }
    .u-loading-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        border: 1px solid #eef0f4;
        border-radius: 8px;
        background: #fcfcfe;
    }
    .u-loading-icon {
        flex-shrink: 0;
        width: 36px;
        height: 36px;
        border-radius: 6px;
        background: #efedf5;
    }
    .u-loading-content { flex: 1; min-width: 0; }
    .u-loading-title,
    .u-loading-description { display: block; border-radius: 4px; background: #f0eff5; }
    .u-loading-title { width: 24%; min-width: 70px; max-width: 180px; height: 12px; }
    .u-loading-description { width: 60%; height: 8px; margin-top: 10px; background: #f3f3f7; }
    .u-loading-row:nth-child(2) .u-loading-description { width: 45%; }
    .u-loading-row:nth-child(3) .u-loading-description { width: 52%; }

    @media (prefers-reduced-motion: reduce) {
        .u-spinner { animation: none; }
    }
}
@keyframes wiki-search-spin { to { transform: rotate(360deg); } }
</style>
