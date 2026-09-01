<template>
    <ul class="m-achievement-list">
        <AchievementSingle
            v-for="(achievement, key) in achievements"
            :key="achievementKey(achievement, key)"
            :achievement="achievement"
            :target="target"
            :jump="jump"
            :initFold="true"
        />
    </ul>
</template>

<script>
import AchievementSingle from "@/components/cj/achievement-single.vue";

export default {
    name: "Achievements",
    props: ["achievements", "target", "jump"],
    data() {
        return {
            restoreScrollTimer: null,
        };
    },
    components: {
        AchievementSingle,
    },
    watch: {
        achievements() {
            if (this.$route && typeof this.$store.state.scroll_tops[this.$route.name] !== "undefined") {
                clearTimeout(this.restoreScrollTimer);
                this.restoreScrollTimer = setTimeout(() => {
                    window.scrollTo(0, this.$store.state.scroll_tops[this.$route.name]);
                }, 200);
            }
        },
    },
    methods: {
        achievementKey(achievement, fallback) {
            return achievement?.ID ?? achievement?.id ?? achievement?.AchievementID ?? fallback;
        },
    },
    beforeUnmount() {
        clearTimeout(this.restoreScrollTimer);
    },
};
</script>
