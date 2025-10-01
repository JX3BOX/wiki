/**
 * IconID 转 URL
 *
 * @param {*} icon_id IconID
 */
import {
    __imgPath,
    __iconPath
} from "@/utils/config";

export default (icon_id) => {
    if (isNaN(parseInt(icon_id))) {
        return `${__imgPath}image/common/nullicon.png`;
    } else {
        return `${__iconPath}icon/${icon_id}.png`;
    }
};
