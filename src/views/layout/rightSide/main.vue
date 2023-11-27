<template>
  <div class="right_main">
    main
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
.right_main {
  width: 100%;
  height: calc(100% - 80px);
  overflow-y: scroll;
}
</style>