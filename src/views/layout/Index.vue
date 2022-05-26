<template>
    <div class="layout" :class="$store.state.isCollapse ? 'hide' : 'show'" :style="`background-image: url(${bg_url});`">
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
            bg_url: ''
        }
    },
    components: {
        LeftNav,
        RightSide
    },
    methods: {
        setBgIamge() {
            let num = Math.floor(Math.random() * (13 - 1 + 1) + 1);
            num = num < 10 ? `0${num}` : num
            this.bg_url = require(`@/assets/imgs/login-bg/bg_${num}.jpeg`)
        },
    },
    created() {
        this.setBgIamge()
    }
}
</script>

<style lang="less" scoped>
.layout{
    display: flex;
    width: 100%;
    height: 100%;

    .left-nav{
        height: 100%;
        background-color: rgba(57, 62, 70, .5);
        
    }

    .right-side{
        height: 100%;
        
    }
}

.show{
    .left-nav{
        width: 250px;
        transition: all 0.3s;
    }

    .right-side{
        width: calc(~"100% - 250px");
        transition: all 0.3s;
    }
}

.hide{
    .left-nav{
        width: 80px;
        transition: all 0.5s .2s;
    }

    .right-side{
        width: calc(~"100% - 80px");
        transition: all 0.5s .2s;
    }
}
</style>