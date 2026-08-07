<template>
  <!-- 商品卡片骨架 -->
  <div v-if="type === 'product'" class="skeleton-product">
    <div class="skeleton-image bk-shimmer" />
    <div class="skeleton-body">
      <div class="skeleton-line bk-shimmer" style="width: 90%" />
      <div class="skeleton-line bk-shimmer" style="width: 65%" />
      <div class="skeleton-line bk-shimmer" style="width: 40%; height: 20px" />
    </div>
  </div>

  <!-- 列表行骨架 -->
  <div v-else-if="type === 'row'" class="skeleton-row">
    <div class="skeleton-check bk-shimmer" />
    <div class="skeleton-thumb bk-shimmer" />
    <div class="skeleton-info">
      <div class="skeleton-line bk-shimmer" style="width: 50%" />
      <div class="skeleton-line bk-shimmer" style="width: 30%" />
    </div>
    <div class="skeleton-line bk-shimmer" style="width: 60px" />
    <div class="skeleton-line bk-shimmer" style="width: 80px" />
    <div class="skeleton-line bk-shimmer" style="width: 80px" />
  </div>

  <!-- 文本骨架 -->
  <div v-else-if="type === 'text'" class="skeleton-text">
    <div
      v-for="n in lines"
      :key="n"
      class="skeleton-line bk-shimmer"
      :style="{ width: n === lines ? '60%' : '100%' }"
    />
  </div>

  <!-- 默认：商品卡片骨架（兼容旧引用） -->
  <div v-else class="skeleton-card">
    <div class="skeleton-image bk-shimmer" />
    <div class="skeleton-body">
      <div class="skeleton-line bk-shimmer" style="width: 90%" />
      <div class="skeleton-line bk-shimmer" style="width: 65%" />
      <div class="skeleton-line bk-shimmer" style="width: 40%; height: 20px" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  /** 骨架类型: product(商品卡片) / row(列表行) / text(文本) */
  type: {
    type: String,
    default: 'product',
  },
  /** 文本骨架的行数 */
  lines: {
    type: Number,
    default: 3,
  },
})
</script>

<style scoped lang="scss">
.skeleton-line {
  height: 14px;
  background: #f0f0f0;
  border-radius: 4px;
}

// ===== 商品卡片骨架 =====
.skeleton-product,
.skeleton-card {
  background: #fff;
  border-radius: $border-radius-small;
  overflow: hidden;
}

.skeleton-image {
  width: 100%;
  padding-top: 100%;
  background: #f0f0f0;
}

.skeleton-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

// ===== 列表行骨架 =====
.skeleton-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #fff;
  border-bottom: 1px solid #f5f5f5;

  .skeleton-check {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    background: #f0f0f0;
  }

  .skeleton-thumb {
    width: 60px;
    height: 60px;
    border-radius: 6px;
    background: #f0f0f0;
  }

  .skeleton-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

// ===== 文本骨架 =====
.skeleton-text {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px 0;
}
</style>
