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
            bgList: [
                'http://blogqn.excellentlld.com/blog/bgImages/b8369206-0eb9-4db1-81e4-9cdd89a75ee1.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/fa7d19f0-0044-42bf-984b-c49a88de628a.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/2eb87a99-7844-470b-9564-f376ea21d99a.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/72f7c73a-a9fc-4b58-834e-b67e3c02e510.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/2781c805-fd29-4d03-8442-322c5a4f03a8.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/e2f35b6c-c2e0-460b-bea9-95b48371241b.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/878e0d4c-12ea-44fe-984c-867c8bd7b348.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/8cd40b03-f69f-4496-84e8-15033dd34a71.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/39cfd133-9042-4a07-9ba9-fc6f635a11c7.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/ce9dd49c-8eec-4b98-8774-e956619e15f8.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/5b91b19c-4921-437e-b884-6db03235e745.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/1861eda5-5fb0-43f6-afb0-829378ed28c9.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/0fa6a0a4-3aff-44e7-9401-0fcbacb13e94.jpg'
            ],
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
            this.bg_url = this.bgList[num - 1]
        },
    },
    created() {
        this.setBgIamge()
        this.$EventBus.$on('changeBg', this.setBgIamge)
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