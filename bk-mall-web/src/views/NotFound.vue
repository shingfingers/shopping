<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1>页面未找到</h1>
      <p>抱歉，您访问的页面不存在或已被移除</p>
      <div class="actions">
        <el-button type="primary" size="large" @click="$router.push('/')">
          返回首页
        </el-button>
        <el-button size="large" @click="$router.go(-1)">
          返回上一页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped lang="scss">
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa, #e4e7ed);
}

.not-found-content {
  text-align: center;

  .error-code {
    font-size: 140px;
    font-weight: 900;
    color: $primary-color;
    opacity: 0.3;
    line-height: 1;
    margin-bottom: 8px;
  }

  h1 {
    font-size: 28px;
    color: $text-primary;
    margin-bottom: 12px;
  }

  p {
    font-size: 15px;
    color: $text-secondary;
    margin-bottom: 32px;
  }

  .actions {
    display: flex;
    gap: 16px;
    justify-content: center;
  }
}
</style>
