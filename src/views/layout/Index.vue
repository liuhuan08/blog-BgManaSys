<template>
    <div class="layout">
        <LeftNav class="left-nav"/>
        <RightSide class="right-side"/>
    </div>
</template>

<script>
import LeftNav from "./leftNav/leftNav.vue"
import RightSide from "./rightSide/rightSide.vue"

export default {
    data() {
        return {

        }
    },
    components: {
        LeftNav,
        RightSide
    },
}
</script>

<style lang="less" scoped>
.layout{
    display: flex;
    width: 100%;
    height: 100%;

    .left-nav{
        width: 300px;
        height: 100%;
        background-color: #ccc;
    }

    .right-side{
        width: calc(~"100% - 300px");
        height: 100%;
    }
}
</style>