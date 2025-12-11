import { __imgPath } from "@/utils/config";
import questFont from "@/assets/data/quest-font.json";

export const buildPoints = (quest) => {
    let result = {};
    const pushPoint = (map, point) => {
        if (!result[map]) result[map] = [];
        result[map].push(point);
    };

    if (quest.start.guides.length > 0) {
        let start = quest.start;
        let point_info = {
            Types: "Start",
            ObjectName: start.name,
            ObjectID: start.id,
            ObjectType: start.type,
        };
        for (let guide of start.guides)
            if (guide.coordinates) {
                for (let coordinate of guide.coordinates)
                    pushPoint(guide.map, {
                        ...point_info,
                        Coordinates: coordinate,
                    });
            } else if (guide.coordinate) {
                pushPoint(guide.map, {
                    ...point_info,
                    Coordinates: guide.coordinate,
                });
            }
    }
    if (quest.end.guides.length > 0) {
        let end = quest.end;
        let point_info = {
            Types: "End",
            ObjectName: end.name,
            ObjectID: end.id,
            ObjectType: end.type,
        };
        for (let guide of end.guides)
            if (guide.coordinates) {
                for (let coordinate of guide.coordinates)
                    pushPoint(guide.map, {
                        ...point_info,
                        Coordinates: coordinate,
                    });
            } else if (guide.coordinate) {
                pushPoint(guide.map, {
                    ...point_info,
                    Coordinates: guide.coordinate,
                });
            }
    }
    if (quest.questValues?.length > 0) {
        for (let index in quest.questValues) {
            let questValue = quest.questValues[index];
            if (questValue.guides?.length > 0) {
                for (let guide of questValue.guides) {
                    let point_info = {
                        Types: `State${parseInt(index) + 1}`,
                        ObjectName: guide.name,
                        ObjectID: guide.id,
                        ObjectType: guide.type,
                    };
                    if (guide.coordinates) {
                        for (let coordinate of guide.coordinates)
                            pushPoint(guide.map, {
                                ...point_info,
                                Coordinates: coordinate,
                            });
                    } else if (guide.coordinate) {
                        pushPoint(guide.map, {
                            ...point_info,
                            Coordinates: guide.coordinate,
                        });
                    }
                }
            }
        }
    }
    if (quest.needItems?.length > 0) {
        for (let index in quest.needItems) {
            let needItem = quest.needItems[index];
            if (needItem.guides?.length > 0) {
                for (let guide of needItem.guides) {
                    let point_info = {
                        Types: `NeedItem${parseInt(index) + 1}`,
                        ObjectName: guide.name,
                        ObjectID: guide.id,
                        ObjectType: guide.type,
                    };
                    if (guide.coordinates) {
                        for (let coordinate of guide.coordinates)
                            pushPoint(guide.map, {
                                ...point_info,
                                Coordinates: coordinate,
                            });
                    } else if (guide.coordinate) {
                        pushPoint(guide.map, {
                            ...point_info,
                            Coordinates: guide.coordinate,
                        });
                    }
                }
            }
        }
    }
    if (quest.killNpcs?.length > 0) {
        for (let index in quest.killNpcs) {
            let killNpc = quest.killNpcs[index];
            if (killNpc.guides?.length > 0) {
                for (let guide of killNpc.guides) {
                    let point_info = {
                        Types: `KillNpc${parseInt(index) + 1}`,
                        ObjectName: guide.name,
                        ObjectID: guide.id,
                        ObjectType: guide.type,
                    };
                    if (guide.coordinates) {
                        for (let coordinate of guide.coordinates)
                            pushPoint(guide.map, {
                                ...point_info,
                                Coordinates: coordinate,
                            });
                    } else if (guide.coordinate) {
                        pushPoint(guide.map, {
                            ...point_info,
                            Coordinates: guide.coordinate,
                        });
                    }
                }
            }
        }
    }
    return result;
};

export const schoolIcon = (school) => {
    let filenameMap = {
        万灵山庄: "万灵",
        北天药宗: "药宗",
        凌雪阁: "凌雪",
        衍天宗: "衍天",
    };
    if (filenameMap[school]) school = filenameMap[school];
    return `${__imgPath}/image/school/${school}.png`;
};

export const questDescFormat = (desc, ignoreColor = false) => {
    const { playerName, playerBody } = getPlayerName();
    if (desc) {
        let result = desc
            .replace(/\\n/g, "\n")
            .replace(/\<G\>/g, "&emsp;&emsp;")
            .replace(/\<N\>/g, playerName)
            .replace(/\<C\>/g, playerBody)
            .replace(
                /\<CMD NPC_NAME (.+?)\>/g,
                `<strong class="u-dialog-name">$1</strong><br /><div class="u-dialog-desc">`
            )
            .replace(
                /\<CMD PLAYER_NAME >/g,
                `<strong class="u-dialog-name">${playerName}</strong><br /></div class="u-dialog-desc">`
            )
            .replace(/\<H(\d+)\>/g, '<div style="height: calc($1px - 1.5rem)"></div></div>');
        while (true) {
            let match = /\<F(\d+) (.+?)\>/.exec(result);
            if (match) {
                let font = questFont[match[1]];
                const style = `style="color: ${font.color}99"`;
                result = result.replace(match[0], `<span ${ignoreColor ? "" : style}>${match[2]}</span>`);
            } else {
                break;
            }
        }
        return result;
    }
    return "";
};

export const questTargetDescFormat = (target) => {
    if (target)
        return target
            .replace(/\\n/g, "\n")
            .replace(/\<G\>/g, "&emsp;&emsp;")
            .replace(/\<C\>/g, "侠士")
            .replace(/\<N\>/g, "侠士")
            .replace(/\<F\d+ (.+?)\>/g, "$1");
    else return "";
};

export const getPlayerName = () => {
    const playerName = localStorage.getItem("QuestWiki:playerName") || "侠士";
    const playerBody = localStorage.getItem("QuestWiki:playerBody") || "少侠";
    return { playerName, playerBody };
};
