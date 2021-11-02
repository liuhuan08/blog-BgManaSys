<template>
    <div class="left-nav">
        <h2 class="title">
            <i class="iconfont icon-logo"></i>
            <transition name="fade">
                <span v-if="!$store.state.isCollapse">blog后台</span>
            </transition>
        </h2>
        <ul>
            <li class="menu">
                <router-link :to="{path: '/home'}">
                    <p :class="activePath === '/home' ? 'active' : ''">
                        <i class="iconfont icon-home"></i>
                        <transition name="fade">
                            <span v-if="!$store.state.isCollapse">首页</span>
                        </transition>
                    </p>
                </router-link>
            </li>
            <li class="menu">
                <router-link :to="{path: '/blogger/blogger-info'}">
                    <p :class="activePath === '/blogger/blogger-info' ? 'active' : ''">
                        <i class="iconfont icon-blogger"></i>
                        <transition name="fade">
                            <span v-if="!$store.state.isCollapse">博主信息</span>
                        </transition>
                    </p>
                </router-link>
            </li>
            <li>
                <h3 class="menu" @click="isShow = !isShow" :class="(activePath === '/article/article-list' || activePath === '/article/article-modify' || activePath === '/article/add-article') ? 'active' : ''">
                    <i class="iconfont icon-articles"></i>
                    <transition name="fade">
                        <span style="flex: 1" v-if="!$store.state.isCollapse">文章管理</span>
                    </transition>
                    <transition name="fade">
                        <i class="iconfont icon-down" v-if="!$store.state.isCollapse" :style="{transform: isShow ? 'rotateZ(180deg)' : 'rotateZ(0)', transition: 'all .5s'}"></i>
                    </transition>
                </h3>
                <transition name="slide">
                    <ul class="sub-menu-wrap" v-if="isShow">
                        <li class="sub-menu" :class="$store.state.isCollapse ? 'sub-menu-hide' : ''">
                            <router-link :to="{path: '/article/article-list'}">
                                <p :class="activePath === '/article/article-list' ? 'active' : ''">
                                    <i class="iconfont icon-articleList"></i>
                                    <transition name="fade">
                                        <span v-if="!$store.state.isCollapse">文章列表</span>
                                    </transition>
                                </p>
                            </router-link>
                        </li>
                        <li class="sub-menu" :class="$store.state.isCollapse ? 'sub-menu-hide' : ''">
                            <router-link :to="{path: '/article/article-modify'}">
                                <p :class="activePath === '/article/article-modify' ? 'active' : ''">
                                    <i class="iconfont icon-edit"></i>
                                    <transition name="fade">
                                        <span v-if="!$store.state.isCollapse">文章修改</span>
                                    </transition>
                                </p>
                            </router-link>
                        </li>
                        <li class="sub-menu" :class="$store.state.isCollapse ? 'sub-menu-hide' : ''">
                            <router-link :to="{path: '/article/add-article'}">
                                <p :class="activePath === '/article/add-article' ? 'active' : ''">
                                    <i class="iconfont icon-addArticle"></i>
                                    <transition name="fade">
                                        <span v-if="!$store.state.isCollapse">新增文章</span>
                                    </transition>
                                </p>
                            </router-link>
                        </li>
                    </ul>
                </transition>
            </li>
            <li class="menu">
                <router-link :to="{path: '/image/image-manage'}">
                    <p :class="activePath === '/image/image-manage' ? 'active' : ''">
                        <i class="iconfont icon-photoAlbum"></i>
                        <transition name="fade">
                            <span v-if="!$store.state.isCollapse">图片管理</span>
                        </transition>
                    </p>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>

export default {
    data() {
        return {
            isShow: false,
            activePath: '/home'
        }
    },
    watch: {
        $route(val) {
            this.activePath = val.path;
            if(val.path !== '/article/article-list' && val.path !== '/article/article-modify' && val.path !== '/article/add-article') {
                this.isShow = false
            }else {
                this.isShow = true
            }
        }
    },
    mounted() {
        this.activePath = this.$route.path
        if(this.$route.path === '/article/article-list' || this.$route.path === '/article/article-modify' || this.$route.path === '/article/add-article') {
            this.isShow = true
        } 
    }
}
</script>

<style lang="less" scoped>
.left-nav{
    padding: 20px 30px;
    color: #fff;

    a{
        color: #fff;
    }

    .title{
        margin-bottom: 40px;
        font-size: 22px;
        line-height: 22px;
        text-align: center;

        .icon-logo{
            margin-right: 10px;
            font-size: 20px;
            color: #fdb004;
        }
    }

    .menu, .sub-menu{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 26px;
        font-size: 16px;
        line-height: 16px;
        cursor: pointer;

        .iconfont{
            margin-right: 10px;
        }

        .icon-down{
            margin-right: 0;
            font-size: 12px;
        }
    }

    .sub-menu-wrap{
        overflow: hidden;
    }

    .sub-menu{
        text-indent: 20px;
        transition: all 0.5s;
    }

    .sub-menu-hide{
        text-indent: 5px;
    }

}
    .active{
        color: #fdb004;
    }

.slide-enter-active, .slide-leave-active {
    height: 126px;
    opacity: 1;
    transition: all .5s;
}
.slide-enter, .slide-leave-to{
    height: 0;
    opacity: 0;
}

.fade-enter-active{
    display: none;
    transition: opacity .5s;
}
.fade-leave-active{
    transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>