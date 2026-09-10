import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../src/components/item/plan.vue', import.meta.url), 'utf8')
    .match(/<script>([\s\S]*?)<\/script>/)[1]
    .replace(/^import .*;\n/gm, '')
    .replace('export default', 'globalThis.component =');
function setup(getMyPlans) {
    const context = { getMyPlans };
    vm.runInNewContext(source, context);
    const options = context.component;
    const instance = { ...options.data(), $refs: {}, $nextTick: () => {} };
    for (const [name, method] of Object.entries(options.methods)) instance[name] = method.bind(instance);
    return instance;
}
const items = (start, count) => Array.from({ length: count }, (_, i) => ({ id: start + i }));

test('picker requests ten at a time, appends on scroll and stops at total', async () => {
    const calls = [];
    const picker = setup(async (params) => {
        calls.push(params);
        return { list: params.page === 1 ? items(1, 10) : items(11, 2), total: 12 };
    });
    await picker.resetPlans();
    assert.equal(picker.list.length, 10);
    assert.equal(calls[0].per, 10);
    picker.visible = true;
    picker.$refs.listViewport = { clientHeight: 300, scrollHeight: 400, scrollTop: 100 };
    picker.loadMoreOnScroll();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(picker.list.length, 12);
    assert.equal(calls[1].page, 2);
    picker.loadMoreOnScroll();
    assert.equal(calls.length, 2);
});

test('picker ignores stale search responses and blocks duplicate in-flight loads', async () => {
    const requests = [];
    const picker = setup(params => new Promise(resolve => requests.push({ params, resolve })));
    const first = picker.resetPlans();
    picker.loadPlans();
    assert.equal(requests.length, 1);
    picker.search = 'new';
    const second = picker.resetPlans();
    assert.equal(requests[1].params.search, 'new');
    assert.equal(requests[1].params.page, 1);
    requests[1].resolve({ list: items(20, 1), total: 1 });
    await second;
    requests[0].resolve({ list: items(1, 10), total: 30 });
    await first;
    assert.equal(picker.list.length, 1);
    assert.equal(picker.list[0].id, 20);
});

test('failed next page preserves rows and retries the same page', async () => {
    const pages = [];
    const picker = setup(async ({ page }) => {
        pages.push(page);
        if (pages.length === 2) throw new Error('network');
        return { list: page === 1 ? items(1, 10) : items(11, 1), total: 11 };
    });
    await picker.resetPlans();
    await picker.loadPlans();
    assert.equal(picker.loadError, true);
    assert.equal(picker.page, 1);
    assert.equal(picker.list.length, 10);
    await picker.loadPlans();
    assert.deepEqual(pages, [1, 2, 2]);
    assert.equal(picker.list.length, 11);
    assert.equal(picker.loadError, false);
});
