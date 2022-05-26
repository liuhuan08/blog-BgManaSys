<template>
    <div class="left-nav">
        <h2 class="title">
            <i class="iconfont icon-logo"></i>
            <transition name="fade">
                <span v-if="!$store.state.isCollapse">blog后台</span>
            </transition>
        </h2>
        <el-menu
            :default-active="activePath"
            active-text-color="#fdb004"
            background-color="rgba(57, 62, 70, 0)"
            text-color="#fff"
            router
            :collapse="$store.state.isCollapse"
            collapse-transition
            unique-opened
        >
            <template v-for="(route, index) in routersArr">
                <el-submenu v-if="route.children && route.children" :index="route.path" :key="index">
                    <template slot="title">
                        <i class="iconfont" :class="route.icon"></i>
                        <span slot="title">{{route.name}}</span>
                    </template>
                    <el-menu-item :index="subRoute.path" v-for="subRoute in route.children" :key="subRoute.path">
                        <i class="iconfont" :class="subRoute.icon"></i>
                        {{subRoute.name}}
                    </el-menu-item>
                </el-submenu>
                <el-menu-item v-else :index="route.path" :key="route.path">
                    <i class="iconfont" :class="route.icon"></i>
                    <span slot="title">{{route.name}}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script>

export default {
    data() {
        return {
            activePath: '/home',
            routersArr: [
                {
                    name: '首页',
                    path: '/home',
                    icon: 'icon-home'
                },
                {
                    name: '博主信息',
                    path: '/blogger/blogger-info',
                    icon: 'icon-blogger'
                },
                {
                    name: '文章管理',
                    path: '/article',
                    icon: 'icon-articles',
                    children: [
                        {
                            name: '文章列表',
                            path: '/article/article-list',
                            icon: 'icon-articleList',
                        },
                        {
                            name: '编辑文章',
                            path: '/article/add_modify-article',
                            icon: 'icon-edit',
                        }
                    ]
                },
                {
                    name: '相册管理',
                    path: '/album/album-manage',
                    icon: 'icon-photoAlbum',
                }
            ]
        }
    },
    watch: {
        $route(val) {
            this.activePath = val.path;
        }
    },
    mounted() {
        this.activePath = this.$route.path
    }
}
</script>

<style lang="less" scoped>
.left-nav{
    color: #fff;

    a{
        color: #fff;
    }

    .title{
        margin-bottom: 10px;
        margin-top: 20px;
        font-size: 22px;
        line-height: 22px;
        text-align: center;

        .icon-logo{
            margin-right: 10px;
            font-size: 20px;
            color: #fdb004;
        }
    }

    .el-menu {
        padding: 0 5px;
        border-right: 0;

        &:not(.el-menu--collapse) {
        width: 250px;
    }

        .iconfont {
            margin-right: 10px;
            font-weight: 700;
        }
        .el-menu-item:not(is-active) .iconfont, .el-submenu .iconfont {
            color: #fff;
        }
        .el-menu-item.is-active .iconfont {
            color: #fdb004;
        }

        /deep/.el-submenu__icon-arrow {
            color: #fff;
        }
    }
}

// .fade-enter-active{
//     display: none;
// }

.fade-leave-active,.fade-enter-active {
    transition: opacity .2s;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>