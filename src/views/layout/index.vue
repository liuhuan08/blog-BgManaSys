<template>
  <div class="layout">
    <leftNav></leftNav>
    <rightSide></rightSide>
  </div>
</template>

<script setup lang="ts">
import leftNav from './leftNav/index.vue';
import rightSide from './rightSide/index.vue';
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  height: 100%;
  width: 100%;
}
</style>