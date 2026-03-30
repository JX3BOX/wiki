import { $node } from "@jx3box/jx3box-common/js/api";

const getBossInfo = (id) => {
    return $node().get(`/npc/id/${id}`);
};

export { getBossInfo };
