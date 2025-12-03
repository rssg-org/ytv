<template>
  <div class="subscriptions-container">
    <h1>登録チャンネル</h1>
    <!-- 内容は後で実装 -->
  </div>
</template>

<script>
export default {
  name: 'SubscriptionsView'
};
</script>

<style scoped>
.subscriptions-container {
  padding: 24px;
  margin-left: 250px;
}

h1 {
  color: var(--text-primary);
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .subscriptions-container {
    margin-left: 200px;
  }
}
</style>
