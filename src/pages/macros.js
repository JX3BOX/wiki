import xfid from "@jx3box/jx3box-data/data/xf/xfid.json";
import { __Root, __OriginRoot } from "@/utils/config";

const qs = require("qs");

const query = qs.parse(location.search, { ignoreQueryPrefix: true });
const rootPath = query.L === "classic_yq" ? __OriginRoot : __Root;
const xf = xfid[query.kungfu];

location.href = rootPath + "macro/?subtype=" + xf; //+ '#/rank'
