<template>
    <div class="imgs-page">
        XX相册
    </div>
</template>

<script>
import { getAlbumImgs } from "@/api/albums"

export default {
    data() {
        return {

        }
    },
    methods: {
        getImgs() {
            let id = this.$route.query.albumId
            getAlbumImgs({albumId: id}).then(res => {
                if(res.status === 200) {
                    console.log(res.data.data);
                }
            })
        }
    },
    created() {
        this.getImgs();
    }
}
</script>

<style lang="less" scoped>
.imgs-page{
    padding: 20px;
    width: 100%;
    height: 100%;
    background-color: #fff;
}
</style>