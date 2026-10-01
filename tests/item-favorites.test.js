import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../src/components/item/my-items.vue', import.meta.url), 'utf8')
    .match(/<script>([\s\S]*?)<\/script>/)[1]
    .replace(/^import .*;\n/gm, '')
    .replace('export default', 'globalThis.component =');

function setup(list, items = []) {
    const requests = [];
    const deletions = [];
    const context = {
        Close: {}, ItemIcon: {}, User: { isLogin: () => true },
        getMyFav: async () => ({ data: { data: { list, page: { total: list?.length || 0 } } } }),
        get_items: async (params) => {
            requests.push(params);
            return { data: { data: { data: items } } };
        },
        delMyFav: async (id) => deletions.push(id),
    };
    vm.runInNewContext(source, context);
    const options = context.component;
    const instance = { ...options.data(), $store: { commit() {} } };
    for (const [name, method] of Object.entries(options.methods)) instance[name] = method.bind(instance);
    return { instance, requests, deletions };
}

test('empty favorites clear previous items without requesting an unfiltered item list', async () => {
    for (const list of [[], null]) {
        const { instance, requests } = setup(list);
        instance.data = [{ id: 123, fId: 456 }];
        await instance.loadMyItems();
        assert.equal(instance.data.length, 0);
        assert.equal(instance.total, 0);
        assert.equal(requests.length, 0);
    }
});

test('only actual favorites are shown and deletion uses the favorite record ID', async () => {
    const { instance, requests, deletions } = setup([{ post_id: '123', id: 456 }], [{ id: 123 }, { id: 999 }]);
    await instance.loadMyItems();
    assert.equal(requests[0].ids, '123');
    assert.equal(instance.data.length, 1);
    assert.equal(instance.data[0].fId, 456);
    await instance.remove(instance.data[0].fId);
    assert.deepEqual(deletions, [456]);
    assert.equal(instance.data.length, 0);
    await instance.remove(undefined);
    assert.deepEqual(deletions, [456]);
});
