import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import vm from 'node:vm';
import { reactive } from 'vue';

test('阅读状态只在保存成功后更新，旧加载响应不覆盖新标记', async () => {
    let resolveGet;
    let failWrite = false;
    const requests = [];
    const context = {
        reactive, User: { isLogin: () => true },
        $cms: () => ({
            get: () => new Promise(resolve => { resolveGet = resolve; }),
            put: async (url, payload) => {
                requests.push({url, payload});
                if (failWrite) throw new Error('save failed');
                return {data: {data: {readIds: [42], byType: {game: {read: 1, total: 2}}, read: 1, total: 2}}};
            },
        }),
    };
    const source = fs.readFileSync(new URL('../src/store/knowledge-reading.js', import.meta.url), 'utf8')
        .replace(/^import .*;\n/gm, '').replace(/export /g, '');
    vm.runInNewContext(source + '\nglobalThis.api = {reading, loadReading, markReading};', context);
    const {reading, loadReading, markReading} = context.api;
    const oldLoad = loadReading();
    await markReading(42, true);
    resolveGet({data: {data: {readIds: [], read: 0, total: 2}}});
    await oldLoad;
    assert.equal(reading.read, 1);
    assert.equal(reading.readIds[0], 42);
    assert.equal(requests[0].url, '/api/cms/helper/knowledge/42/reading');
    assert.equal(requests[0].payload.read, true);
    failWrite = true;
    await assert.rejects(markReading(42, false), /save failed/);
    assert.equal(reading.read, 1, '失败不能把已读状态清空');
});
