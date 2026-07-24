<template>
    <ul class="m-achievement-list">
        <AchievementSingle
            v-for="(achievement, key) in achievements"
            :key="key"
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
    components: {
        AchievementSingle,
    },
    watch: {
        achievements() {
            if (this.$route && typeof this.$store.state.scroll_tops[this.$route.name] !== "undefined") {
                setTimeout(() => {
                    window.scrollTo(0, this.$store.state.scroll_tops[this.$route.name]);
                }, 200);
            }
        },
    },
};
</script>
