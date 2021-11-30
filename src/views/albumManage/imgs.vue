<template>
	<div class="imgs-page">
		<div class="title">{{ title }}</div>
		<ul class="list">
            <li class="item add-img" @click="handelAddImg">
				<i class="iconfont icon-add"></i>
				上传图片
			</li>
			<li class="item" v-for="v in imgsList" :key="v.id">
				<img :src="v.url" />
                <!-- <p class="info">创建时间：{{v.createTime | handelData}}</p> -->
                <div class="del-wrap" @click="handelRemove(v.id)">
                    <i class="iconfont icon-remove"></i>
                    删除
                </div>
			</li>
		</ul>
	</div>
</template>

<script>
import { getAlbumImgs } from "@/api/albums";

import { normalizeDate, normalizeTime } from "@/utils/tools";

export default {
	data() {
		return {
			title: "",
			imgsList: [],
			imgsTotal: 0,
		};
	},
	methods: {
		getImgs() {
			let id = this.$route.query.albumId;
			getAlbumImgs({ albumId: id }).then((res) => {
				if (res.status === 200) {
					this.imgsList = [...res.data.data.records];
					this.imgsTotal = res.data.data.total;
				}
			});
		},
        handelAddImg() {

        },
        handelRemove(id) {
            console.log(id);
        },
        handelResize() {
            document.querySelector('.add-img').style.height = document.querySelector('.add-img').offsetWidth + 'px'
        }
	},
    filters: {
		// 格式化时间
		handelData(val) {
			return normalizeDate(val, "-") + " " + normalizeTime(val);
		},
	},
	created() {
		this.title = this.$route.query.albumName;
		this.getImgs();
	},
    mounted() {
        this.handelResize();
        window.addEventListener('resize', this.handelResize)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.handelResize)
    }
};
</script>

<style lang="less" scoped>
.imgs-page {
	padding: 20px;
	width: 100%;
	height: 100%;
	background-color: #fff;

	.title {
		margin-bottom: 20px;
		font-size: 20px;
		text-indent: 20px;
		line-height: 60px;
		border-bottom: 1px dashed #ccc;
	}

	.list {
		/*最多多分为4列,会根据浏览器的大小变化,但是不会超过4列*/
		column-count: 4;
		/*规定每列列宽最小为200px*/
		column-width: 200px;
		/*规定每列的间隙*/
		column-gap: 20px;
		width: 100%;

		.item {
            position: relative;
            margin-bottom: 20px;
            border: 1px solid #eee;
            cursor: pointer;

            // .info{
            //     position: absolute;
            //     bottom: 0;
            //     left: 0;
            //     padding: 5px;
            //     width: 100%;
            //     background-color: rgba(255, 255, 255, .3);
            // }

            .del-wrap{
                display: none;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 20%;
                color: #000;
                background-color: rgba(255, 255, 255, .3);

                .icon-remove{
                    font-size: 18px;
                }
            }

            &:hover .del-wrap{
                display: flex;
            }
		}

        .add-img {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background-color: #eee;
			border: 1px dashed #ccc;
			cursor: pointer;

			.icon-add {
				font-size: 20px;
			}

			&:hover {
				color: #409eff;
				border: 1px dashed #409eff;
				box-shadow: 3px 3px 3px #ccc;
			}
		}
	}
}
</style>