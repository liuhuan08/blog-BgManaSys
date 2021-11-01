<template>
    <div>
        <h2>blog后台</h2>
        <ul>
            <li><router-link :to="{path: '/'}">首页</router-link></li>
            <li><router-link :to="{path: '/blogger-info'}">博主信息</router-link></li>
            <li>
                <h3>文章管理</h3>
                <ul>
                    <li><router-link :to="{path: '/article-list'}">文章列表</router-link></li>
                    <li><router-link :to="{path: '/article-modify'}">文章修改</router-link></li>
                    <li><router-link :to="{path: '/add-article'}">新增文章</router-link></li>
                </ul>
            </li>
            <li><router-link :to="{path: '/image-manage'}">图片管理</router-link></li>
        </ul>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="less" scoped>

</style>