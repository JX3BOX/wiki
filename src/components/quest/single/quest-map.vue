<template>
    <div class="m-quest-map">
        <el-carousel ref="carousel" :autoplay="false" :arrow="showArrow" :height="`${height}px`">
            <el-carousel-item v-for="(ps, mapId) in points" :key="mapId">
                <div class="u-map__container" :style="containerSize">
                    <img class="u-map-img" :src="mapImgUrl(mapId)" draggable="false" :alt="$t('ui.quest.mapTab')" />
                    <div class="u-map-tool">
                        <p class="u-map-name">{{ mapName(mapId) }}</p>
                    </div>
                    <template v-for="point in ps" :key="point.Types + JSON.stringify(point.Coordinates)">
                        <div
                            v-if="filter[point.Types]"
                            class="u-map-point__warpper"
                            :class="{
                                'u-map-point__bigger': point.Types === 'Start' || point.Types === 'End',
                                'u-map-point__start': point.Types === 'Start',
                            }"
                            :style="pointStyle(point.Coordinates, mapId)"
                        >
                            <el-popover
                                placement="top"
                                trigger="hover"
                                popper-class="u-map-point__popover"
                                :visible-arrow="false"
                            >
                                <div class="u-popover-content">
                                    <p>{{ pointType(point.Types) }}</p>
                                    <p>
                                        {{ point.ObjectName }} ({{ objectType(point.ObjectType) }} {{ point.ObjectID }})
                                    </p>
                                    <p>{{ coordinates(point.Coordinates) }}</p>
                                </div>
                                <template #reference>
                                    <img
                                        v-if="point.Types == 'Start'"
                                        :class="pointClass(point)"
                                        :src="pointIcon(point.Types, questType)"
                                    />
                                    <img
                                        v-else-if="point.Types == 'End'"
                                        :class="pointClass(point)"
                                        :src="pointIcon(point.Types, questType)"
                                    />
                                    <span v-else :class="pointClass(point)"></span>
                                </template>
                            </el-popover>
                        </div>
                    </template>
                </div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
import { getMapScales } from "@/service/map";
import { __imgPath } from "@/utils/config";

export default {
    name: "QuestMap",
    props: {
        questType: {
            type: String,
            default: "common",
        },
        points: {
            type: Object,
        },
        filter: {
            type: Object,
        },
    },
    data: () => ({
        height: 896,
        width: 1024,
        mapScales: {},
    }),
    watch: {
        mapScales: {
            immediate: true,
            deep: true,
            handler() {
                this.$nextTick(() => {
                    this.updateSize();
                    window.addEventListener("resize", this.updateSize);
                });
            },
        },
    },
    computed: {
        containerSize() {
            return {
                width: `${this.width}px`,
                height: `${this.height}px`,
            };
        },
        showArrow() {
            return Object.keys(this.points).length > 1 ? "always" : "never";
        },
    },
    methods: {
        fetchMapScales() {
            getMapScales().then((data) => {
                this.mapScales = data;
            });
        },
        mapImgUrl(id) {
            return `${__imgPath}map/maps/map_${id}_0.png`;
        },
        mapName(id) {
            if (this.mapScales[`${id}`]) {
                return this.mapScales[`${id}`][0].Name;
            }
            return this.$t("ui.quest.unknownMap");
        },
        pointStyle(coordinates, mapId) {
            let mapScales = this.mapScales[`${mapId}`];
            if (mapScales) {
                mapScales = mapScales[0];
            } else {
                return {};
            }
            return {
                left: `${(coordinates[0] - mapScales.StartX) * mapScales.Scale * (this.width / 1024)}px`,
                bottom: `${(coordinates[1] - mapScales.StartY) * mapScales.Scale * (this.height / 896)}px`,
            };
        },
        pointClass(point) {
            return {
                "u-map-point": true,
                "u-map-point__kill": point.Types.startsWith("KillNpc"),
                "u-map-point__item": point.Types.startsWith("NeedItem"),
                "u-map-point__icon": point.Types == "Start" || point.Types == "End",
            };
        },
        pointIcon(type, questType) {
            const icon = {
                Start_Act: require("@/assets/img/quest/dialoguelabel-88.png"),
                Start_Repeat: require("@/assets/img/quest/dialoguelabel-84.png"),
                Start_Common: require("@/assets/img/quest/dialoguelabel-81.png"),
                End: require("@/assets/img/quest/dialoguelabel-80.png"),
            };
            if (type == "End") return icon.End;
            if (questType == "act") return icon.Start_Act;
            if (questType == "repeat") return icon.Start_Repeat;
            return icon.Start_Common;
        },
        updateSize() {
            this.width = this.$refs.carousel.$el.clientWidth;
            this.height = this.width / (1024 / 896);
        },
        pointType(type) {
            const map = {
                Start: this.$t("ui.quest.startPoint"),
                End: this.$t("ui.quest.endPoint"),
                KillNpc: this.$t("ui.quest.killMonster"),
                NeedItem: this.$t("ui.quest.neededItem"),
            };
            if (map[type]) return map[type];
            if (type.startsWith("State")) return type.replace("State", this.$t("ui.quest.progress"));
            if (type.startsWith("KillNpc")) return type.replace("KillNpc", this.$t("ui.quest.killMonster"));
            if (type.startsWith("NeedItem")) return type.replace("NeedItem", this.$t("ui.quest.neededItem"));
            return this.$t("ui.quest.other");
        },
        objectType(value) {
            const map = {
                npc: "NPC",
                point: this.$t("ui.quest.coordinate"),
                doodad: this.$t("ui.quest.interactiveItem"),
            };
            return map[value] ?? this.$t("ui.quest.other");
        },
        coordinates(value) {
            return `(${value[0]},${value[1]},${value[2]})`;
        },
    },
    mounted() {
        this.fetchMapScales();
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.updateSize);
    },
};
</script>

<style lang="less">
@import "~@/assets/css/quest/single/quest-map.less";
</style>
