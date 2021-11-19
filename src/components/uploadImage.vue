<template>
    <div class="wrap">
        <div class="upload-section">
            <label>
                <input type="file" class="ipt" @change="upload">
                <div class="add-wrap">
                    <i class="iconfont icon-add"></i>
                </div>
                <div class="img-wrap" v-if="url" title="更换">
                    <img :src="url" class="img" v-if="url">
                    <div class="remove">
                        <i class="iconfont icon-change"></i>
                    </div>
                </div>
            </label>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            url: this.src,
            show: false,
            file: null
        }
    },
    props: {
        action: {
            type: String
        },
        beforeUpload: {
            type: Function
        },
        src: {
            type: String
        }
    },
    methods: {
        upload(e) {
            if(this.file) return;
            this.file = e.target.files[0];
            if(!this.beforeUpload(this.file)) return;
            this.url = window.URL.createObjectURL(this.file)
            this.show = true;

            let formData = new FormData();
            formData.append('avater', this.file);
            axios.post(this.action, formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(res => {
                if(res.status === 200) {
                    this.url = res.data.data.url;
                    this.$emit("on-success", res.data)
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.wrap{
    display: flex;
    align-items: flex-end;
    width: 220px;
    height: 120px;
}

.upload-section{
    position: relative;
    width: 120px;
    height: 120px;
}
.ipt{
    display: none;
}
.add-wrap{
    position: relative;
    width: 120px;
    height: 120px;
    border: 1px dashed #ccc;
    border-radius: 6px;
    text-align: center;
    line-height: 120px;
    cursor: pointer;

    .icon-add{
        font-size: 20px;
        text-align: center;
        line-height: 20px;
    }

    &:hover{
        border-color: #409eff;
    }

    &:hover .icon-add{
        color: #409eff;
    }

}
.img-wrap{
    position: absolute;
    top: 0;
    left: 0;
    width: 120px;
    height: 120px;

    .img{
        width: 120px;
        height: 120px;
        border: 0;
        border-radius: 6px;
    }

    .remove{
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 120px;
        height: 120px;
        text-align: center;
        line-height: 120px;
        background-color: rgba(255, 255, 255, 0.5);
        cursor: pointer;

        .icon-remove{
            color: #333;
            font-weight: 700;
            font-size: 20px;
        }
    }

    &:hover .remove{
        display: block;
    }
}
</style>