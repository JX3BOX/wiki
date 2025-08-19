<template>
  <div
    class="carousel-container"
    ref="container"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
  >
    <div
      class="carousel-track"
      :style="trackStyle"
    >
      <div
        v-for="(item, idx) in items"
        :key="item.ID || idx"
        class="carousel-item"
        :style="itemStyle"
      >
        <slot :item="item" :index="idx" />
      </div>
    </div>
    <div class="carousel-indicators">
      <span
        v-for="(item, idx) in items"
        :key="'dot-' + (item.ID || idx)"
        class="carousel-dot"
        :class="{ active: idx === current }"
        @click="goTo(idx)"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Carousel",
  props: {
    items: { type: Array, required: true },
    itemGap: { type: Number, default: 0 }, // px，默认0
    showCount: { type: Number, default: 1.2 }, // 可见卡片数，保留
    initial: { type: Number, default: 0 },
  },
  data() {
    return {
      current: this.initial,
      dragging: false,
      startX: 0,
      deltaX: 0,
      trackX: 0,
      animating: false,
      itemWidth: 200, // 动态计算
      containerWidth: 0,
    };
  },
  mounted() {
    this.calcItemWidth();
    window.addEventListener('resize', this.calcItemWidth);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calcItemWidth);
  },
  computed: {
    trackStyle() {
      const totalWidth = this.items.length * (this.itemWidth + this.itemGap);
      // baseX 计算：让当前item严格居中
      const baseX = (this.containerWidth - this.itemWidth) / 2 - this.current * (this.itemWidth + this.itemGap);
      const dragX = this.dragging ? this.deltaX : 0;
      return {
        width: totalWidth + 'px',
        transform: `translateX(${baseX + dragX}px)` ,
        transition: this.animating ? 'transform 0.3s cubic-bezier(.4,0,.2,1)' : 'none',
        // 无需padding
      };
    },
    itemStyle() {
      return {
        width: this.itemWidth + 'px',
        marginRight: this.itemGap + 'px',
      };
    },
  },
  methods: {
    calcItemWidth() {
      this.$nextTick(() => {
        const container = this.$refs.container;
        if (container) {
          this.containerWidth = container.clientWidth;
          this.itemWidth = this.containerWidth - 40;
        }
      });
    },
    next() {
      if (this.current < this.items.length - 1) {
        this.goTo(this.current + 1);
      }
    },
    prev() {
      if (this.current > 0) {
        this.goTo(this.current - 1);
      }
    },
    goTo(idx) {
      this.animating = true;
      this.current = idx;
      this.$emit('change', this.current); // 通知父组件当前index
      setTimeout(() => { this.animating = false; }, 300);
    },
    onTouchStart(e) {
      if (e.touches.length > 1) return;
      this.dragging = true;
      this.startX = e.touches[0].pageX;
      this.deltaX = 0;
    },
    onTouchMove(e) {
      if (!this.dragging) return;
      this.deltaX = e.touches[0].pageX - this.startX;
    },
    onTouchEnd() {
      if (!this.dragging) return;
      this.dragging = false;
      this.snapToCard();
    },
    onMouseDown(e) {
      e.preventDefault();
      this.dragging = true;
      this.startX = e.pageX;
      this.deltaX = 0;
    },
    onMouseMove(e) {
      if (!this.dragging) return;
      this.deltaX = e.pageX - this.startX;
    },
    onMouseUp() {
      if (!this.dragging) return;
      this.dragging = false;
      this.snapToCard();
    },
    snapToCard() {
      const threshold = this.itemWidth / 4;
      if (this.deltaX < -threshold && this.current < this.items.length - 1) {
        this.goTo(this.current + 1);
      } else if (this.deltaX > threshold && this.current > 0) {
        this.goTo(this.current - 1);
      } else {
        this.goTo(this.current);
      }
      this.deltaX = 0;
    },
  },
};
</script>

<style scoped>
.carousel-container {
  overflow: hidden;
  position: relative;
  width: 100%;
  touch-action: pan-y;
}
.carousel-track {
  display: flex;
  align-items: stretch;
  will-change: transform;
}
.carousel-item {
  flex-shrink: 0;
      transition: border 0.2s;
}
.carousel-indicators {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
  gap: 8px;
  user-select: none;
}
.carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ccc;
  transition: background 0.2s, transform 0.2s;
  cursor: pointer;
}
.carousel-dot.active {
  background: #fedaa3;
}
</style>
