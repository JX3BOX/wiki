import { reactive } from "vue";
import { $cms } from "@jx3box/jx3box-common/js/api";
import User from "@jx3box/jx3box-common/js/user";

export const reading = reactive({ readIds: [], byType: {}, read: 0, total: 0, loaded: false, loading: false, error: false, onlyUnread: false, revision: 0 });
let pending;
let version = 0;
function accept(data) {
    reading.readIds = data.readIds || [];
    reading.byType = data.byType || {};
    reading.read = data.read || 0;
    reading.total = data.total || 0;
    reading.loaded = true;
    reading.error = false;
}
export function loadReading() {
    if (!User.isLogin()) return Promise.resolve();
    if (pending) return pending;
    const token = version;
    reading.loading = true;
    pending = $cms({ mute: true }).get('/api/cms/helper/knowledge/reading')
        .then(res => { if (token === version) accept(res.data.data); })
        .catch(error => { reading.error = true; throw error; })
        .finally(() => { reading.loading = false; pending = null; });
    return pending;
}
export async function markReading(id, read) {
    const res = await $cms({ mute: true }).put(`/api/cms/helper/knowledge/${id}/reading`, { read });
    version++;
    accept(res.data.data);
    reading.revision++;
}
