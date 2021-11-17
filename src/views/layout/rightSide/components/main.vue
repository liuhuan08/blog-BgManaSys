<template>
    <div>
        <transition name="slide-fade">
            <router-view/>
        </transition>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="less" scoped>
.slide-fade-enter-active {
  transition: all .3s linear;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.slide-fade-leave-to{
    display: none;
}
</style>