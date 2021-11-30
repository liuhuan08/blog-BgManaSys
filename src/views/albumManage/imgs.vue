<template>
	<div class="imgs-page">
		<div class="top">
			<span class="title">{{ title }}</span>
			<div>
				<label class="check-wrap"
					>全选<input
						type="checkbox"
						:checked="checkall"
						class="checkall"
						@click="checkAll"
				/></label>
				<l-botton
					style="width: 60px"
					type="danger"
					size="mini"
					@click="handelDelChecked"
				>
					删除
				</l-botton>
				<l-botton
					style="margin-left: 10px"
					type="primary"
					size="mini"
					@click="handelAddImg"
				>
					上传新图片
				</l-botton>
			</div>
		</div>
		<ul class="list">
            <li v-if="imgsList.length === 0">这个相册是空的！</li>
			<li class="item" v-for="v in imgsList" :key="v.id">
				<img :src="v.url" />
				<!-- <p class="info">创建时间：{{v.createTime | handelData}}</p> -->
				<div class="del-wrap" @click="handelRemove(v.id)">
					<i class="iconfont icon-remove"></i>
				</div>
				<input
					type="checkbox"
					class="checkbox"
					:checked="v.checkone"
					@click="checkOne(v.id)"
				/>
			</li>
		</ul>

		<div class="dialog" v-if="dialogVisible">
			<i class="iconfont icon-closeCard" @click="handelClose"></i>
			<div class="title">新增图片</div>
			<div class="item">
				<div class="label">上传图片</div>
				<l-upload-image
					:src="[]"
					action="http://api.excellentlld.com/blog/back/upload-image"
					@on-success="handleAvatarSuccess"
					@on-remove="handleAvatarRemove"
					:before-upload="beforeAvatarUpload"
				></l-upload-image>
			</div>
			<div class="bottom">
				<l-botton
					style="margin-right: 10px"
					type="primary"
					size="small"
					@click="handelConfirm"
				>
					确认
				</l-botton>
				<l-botton type="info" size="small" @click="handelClose">
					取消
				</l-botton>
			</div>
		</div>
	</div>
</template>

<script>
import { getAlbumImgs, albumAddImgs, albumDelImgs } from "@/api/albums";

import { normalizeDate, normalizeTime } from "@/utils/tools";

import LBotton from "@/components/botton.vue";
import LUploadImage from "@/components/uploadImage.vue";

export default {
	data() {
		return {
			title: "",
			imgsList: [],
			imgsTotal: 0,
			checkedList: [],
			checkall: false,
			dialogVisible: false,
			newImgs: [],
		};
	},
	components: {
		LBotton,
		LUploadImage,
	},
	methods: {
		// 获取图片列表
		getImgs() {
			let id = this.$route.query.albumId;
			getAlbumImgs({ albumId: id }).then((res) => {
				if (res.status === 200) {
					this.imgsList = [...res.data.data.records];
					this.imgsList.forEach((v, i) => {
						this.$set(this.imgsList[i], "checkone", false);
					});
					this.imgsTotal = res.data.data.total;
				}
			});
		},
		// 添加图片
		handelAddImg() {
			this.dialogVisible = true;
		},
		// 上传图片成功
		handleAvatarSuccess(data) {
			this.newImgs = data;
		},
		handleAvatarRemove(data) {
			this.newImgs.splice(data, 1);
		},
		// 上传图片限制
		beforeAvatarUpload(file) {
			const isJPG = file.type === "image/jpeg";
			const isLt10M = file.size / 1024 / 1024 < 10;

			if (!isJPG) {
				this.Msg("上传头像图片只能是 JPG 格式!", "error", 2000);
			}
			if (!isLt10M) {
				this.Msg("上传头像图片大小不能超过 10MB!", "error", 2000);
			}
			return isJPG && isLt10M;
		},
		// 确认
		handelConfirm() {
			let albumId = this.$route.query.albumId;
			let sendData = {
				albumId,
				imgList: this.newImgs,
			};
			albumAddImgs(sendData).then((res) => {
				if (res.status === 200) {
					this.Msg("新增相册图片成功！", "success", 1500);
					this.newImgs = [];
					this.dialogVisible = false;
					this.getImgs();
				}
			});
		},
		// 关闭dialog
		handelClose() {
			this.newImgs = [];
			this.dialogVisible = false;
		},
		// 单个删除
		handelRemove(id) {
			albumDelImgs({ deleteIds: [id] }).then((res) => {
				if (res.status === 200) {
					this.Msg("删除成功~", "success", 1500);
					this.getImgs();
				}
			});
		},
		// 全选
		checkAll() {
			if (this.checkall) {
				this.checkall = false;
				this.checkedList = [];
				this.imgsList.forEach((v, i) => {
					this.$set(this.imgsList[i], "checkone", false);
				});
			} else {
				this.checkall = true;
				this.checkedList = this.imgsList.map((v) => {
					return v.id;
				});
				this.imgsList.forEach((v, i) => {
					this.$set(this.imgsList[i], "checkone", true);
				});
			}
		},
		// 单选
		checkOne(id) {
			if (this.checkedList.indexOf(id) === -1) {
				this.checkedList.push(id);
			} else {
				this.checkedList.splice(this.checkedList.indexOf(id), 1);
				this.checkall = false;
			}
			if (this.checkedList.length === this.imgsList.length) {
				this.checkall = true;
			} else {
				this.checkall = false;
			}
		},
		// 删除选中
		handelDelChecked() {
			if (this.checkedList.length === 0) {
				this.Msg("请先选中要删除的图片~", "warning", 1500);
			} else {
				albumDelImgs({ deleteIds: this.checkedList }).then((res) => {
					if (res.status === 200) {
						this.Msg("删除成功~", "success", 1500);
						this.getImgs();
					}
				});
			}
		},
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
};
</script>

<style lang="less" scoped>
.imgs-page {
	padding: 20px;
	width: 100%;
	height: 100%;
	background-color: #fff;

	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
		border-bottom: 1px dashed #ccc;

		.title {
			font-size: 20px;
			text-indent: 20px;
			line-height: 60px;
		}

		.check-wrap {
			cursor: pointer;

			.checkall {
				margin: 0 20px 2px 5px;
				cursor: pointer;
			}
		}
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

			.del-wrap {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 0;
				color: #000;
				background-color: rgba(255, 255, 255, 0.3);
				overflow: hidden;
				transition: all 0.2s linear;

				.icon-remove {
					font-size: 18px;
				}
			}

			.checkbox {
				position: absolute;
				top: 5px;
				left: 5px;
				cursor: pointer;
			}

			&:hover .del-wrap {
				height: 20%;
			}
		}
	}
}

.dialog {
	position: absolute;
	top: 40%;
	left: 50%;
	transform: translate(-50%, -50%);
	padding: 20px;
	padding-top: 0;
	width: 800px;
	height: 400px;
	background-color: #fff;
	box-shadow: 0px 0px 5px #ccc;
	border-radius: 10px;

	.icon-closeCard {
		position: absolute;
		top: 5px;
		right: 10px;
		font-size: 20px;
		cursor: pointer;
	}

	.title {
		margin-bottom: 20px;
		font-size: 20px;
		line-height: 60px;
		text-indent: 0;
		border-bottom: 1px dashed #ccc;
	}

	.item {
		display: flex;
		margin-top: 20px;

		.label {
			width: 100px;
		}

		.ipt {
			flex: 1;
		}
	}

	.bottom {
		position: absolute;
		bottom: 20px;
		right: 20px;
		display: flex;
		justify-content: end;
	}
}
</style>