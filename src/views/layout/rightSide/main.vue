<template>
  <div class="right_main">
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.right_main {
  padding: 10px;
  width: 100%;
  height: calc(100% - 80px);
  background-color: #eee;

  .container {
    padding: 20px;
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 6px;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background: #ccc;
    }
    &::-webkit-scrollbar-track {
      border-radius: 0;
      background: transparent;
    }
  }
}
</style>