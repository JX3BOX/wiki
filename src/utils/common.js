import { getThumbnail } from "@jx3box/jx3box-common/js/utils";

export const ellipsis = (value) => {
    value = value ? value.trim().replace(/<[^>]*>/g, '') : "";
    if (value.length > 100) {
        return value.slice(0, 100) + "...";
    }
    return value;
}

export function getMountAvatar(mount, body, size, replace) {
    return getThumbnail(`https://cdn.jx3box.com/design/avatar/mini/${mount}-${body}.png`, size, replace);
}
