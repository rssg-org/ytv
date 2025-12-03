<template>
  <div class="history-container">
    <h1>履歴</h1>
    <!-- 内容は後で実装 -->
  </div>
</template>

<script>
export default {
  name: 'HistoryView'
};
</script>

<style scoped>
.history-container {
  padding: 24px;
  margin-left: 250px;
}

h1 {
  color: var(--text-primary);
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .history-container {
    margin-left: 200px;
  }
}
</style>
