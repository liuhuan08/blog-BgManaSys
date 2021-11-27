<template>
    <div class="right-side">
        <Header class="header"/>
        <Main class="main"/>
    </div>
</template>

<script>
import Header from "./components/header.vue"
import Main from "./components/main.vue"

export default {
    data() {
        return {

        }
    },
    components: {
        Header,
        Main
    },
}
</script>

<style lang="less" scoped>
.right-side{
    display: flex;
    flex-direction: column;

    .header{
        width: 100%;
        height: 100px;
    }

    .main{
        padding: 10px;
        width: 100%;
        height: calc(~"100% - 100px");
        background-color: #eee;
        overflow-y: scroll;
    }
}
</style>