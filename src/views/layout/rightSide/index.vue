<template>
  <div class="right_side">
    <headerComponent></headerComponent>
    <mainComponent></mainComponent>
  </div>
</template>

<script setup lang="ts">
import headerComponent from './header.vue';
import mainComponent from './main.vue';
</script>

<style lang="scss" scoped>
.right_side {
  display: flex;
  flex-direction: column;
  width: calc(100% - 240px);
  height: 100%;
}
</style>