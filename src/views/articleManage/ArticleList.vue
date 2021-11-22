<template>
    <div class="article-list-page">
        
    </div>
</template>

<script>
import { getArticleList } from "@/api/article";
import local from "@/utils/local"

export default {
    data() {
        return {
            limit: 10,
            page: 1
        }
    },
    methods: {
        getData() {
            let bloggerId = local.get('blog_userinfo').bloggerId;
            let data = {
                bloggerId,
                limit: this.limit,
                page: this.page
            }
            getArticleList(data).then(res => {
                console.log(res);
            })
        }
    },
    created() {
        this.getData();
    }
}
</script>

<style lang="less" scoped>
.article-list-page{
    width: 100%;
    height: 100%;
    background-color: #fff;
}
</style>