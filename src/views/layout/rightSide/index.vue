<template>
  <div class="right_side" :class="store.state.isCollapse ? 'hide_nav' : ''">
    <headerComponent></headerComponent>
    <mainComponent></mainComponent>
  </div>
</template>

<script setup lang="ts">
import headerComponent from './header.vue';
import mainComponent from './main.vue';
import { useStore } from 'vuex'

const store = useStore();
</script>

<style lang="scss" scoped>
.right_side {
  display: flex;
  flex-direction: column;
  width: calc(100% - 240px);
  height: 100%;
  transition: width .3s;

  &.hide_nav {
    width: calc(100% - 64px);
  }
}
</style>