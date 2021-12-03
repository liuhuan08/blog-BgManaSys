<template>
	<div class="album-page">
		<div class="title">相册列表</div>
		<ul class="list">
			<li class="item add-album" @click="handelAddAlbum">
				<i class="iconfont icon-add"></i>
				添加相册
			</li>
			<li v-for="v in albumsList" :key="v.id" class="item">
				<div
					class="img-wrap"
					@mouseenter="$set(v, 'showOperation', true)"
					@mouseleave="$set(v, 'showOperation', false)"
				>
					<img :src="v.albumCover" />
					<transition name="fade">
						<div class="operation" v-if="v.showOperation">
							<l-botton
								type="primary"
								size="mini"
								@click="getInAlbum(v.id, v.albumName)"
							>
								进入相册
							</l-botton>
							<l-botton
								type="primary"
								size="mini"
								@click="handelEdit(v)"
							>
								编辑相册
							</l-botton>
							<l-botton
								type="danger"
								size="mini"
								@click="handelDel(v.id)"
							>
								删除相册
							</l-botton>
						</div>
					</transition>
				</div>
				<div class="album-name">
					{{ v.albumName }}
					<i
						class="iconfont icon-info"
						@mouseenter="$set(v, 'showInfo', true)"
						@mouseleave="$set(v, 'showInfo', false)"
					></i>
					<transition name="fade">
						<div class="album-info" v-if="v.showInfo">
							<p>创建时间：</p>
							<p class="time">{{ v.createTime | handelData }}</p>
							<p>最近修改：</p>
							<p class="time">{{ v.updateTime | handelData }}</p>
						</div>
					</transition>
				</div>
			</li>
		</ul>

		<div class="dialog" v-if="dialogVisible">
			<i class="iconfont icon-closeCard" @click="handelClose"></i>
			<div class="title" v-if="isAdd">新增相册</div>
			<div class="title" v-if="!isAdd">修改相册</div>
			<div class="item">
				<div class="label">相册名称</div>
				<l-input
					class="ipt"
					v-model="dialogForm.name"
					:ipt-value="dialogForm.name"
					type="text"
					placeholder="请输入相册名称"
					clearable
				></l-input>
			</div>
			<div class="item">
				<div class="label">相册封面</div>
				<div class="upload-avatar">
					<div class="add-wrap" v-if="!dialogForm.albumCover" @click="dialogVisible_clip = true">
						<i class="iconfont icon-add"></i>
					</div>
					<div
						class="img-wrap"
						v-if="dialogForm.albumCover"
						title="更换"
					>
						<img :src="dialogForm.albumCover" class="img" v-if="dialogForm.albumCover" />
						<div class="remove" @click="dialogVisible_clip = true">
							<i class="iconfont icon-change"></i>
						</div>
					</div>
				</div>
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

		<div class="dialog-clip" v-if="dialogVisible_clip">
			<i class="iconfont icon-error" title="关闭" @click="dialogVisible_clip = false"></i>
			<div class="dialog-title">裁剪图片</div>
			<cropper :proportion="[5, 7]" @on-success="handleAvatarSuccess"></cropper>
		</div>
	</div>
</template>

<script>
import { getAlbumsList, addAlbums, delAlbums, editAlbums } from "@/api/albums";
import local from "@/utils/local";
import { normalizeDate, normalizeTime } from "@/utils/tools";

import LInput from "@/components/input.vue";
import LBotton from "@/components/botton.vue";
import LUploadImage from "@/components/uploadImage.vue";
import cropper from "../../components/cropper.vue"

export default {
	data() {
		return {
			albumsList: [],
			dialogForm: {
				name: "",
				albumCover: "",
			},
			dialogVisible: false,
			isAdd: false,
			page: 1,
			size: 20,
			sort: 1,
			dialogVisible_clip:false
		};
	},
	components: {
		LInput,
		LBotton,
		LUploadImage,
		cropper
	},
	methods: {
		// 获取相册列表
		getAlbum() {
			let bloggerId = local.get("blog_userinfo").bloggerId;
			let sendData = {
				bloggerId,
				sort: this.sort,
				page: this.sort,
				size: this.size,
			};
			getAlbumsList(sendData).then((res) => {
				if (res.status === 200) {
					this.albumsList = [...res.data.data.records];
					this.albumsList.forEach((v, i) => {
						this.$set(this.albumsList[i], "showInfo", false);
						this.$set(this.albumsList[i], "showOperation", false);
					});
				}
			});
		},
		// 新增相册
		handelAddAlbum() {
			this.isAdd = true;
			this.dialogVisible = true;
		},
		// 上传图片成功
		handleAvatarSuccess(data) {
			this.dialogForm.albumCover = data;
			this.dialogVisible_clip = false;
		},
		// 上传图片限制
		beforeAvatarUpload(file) {
			const isJPG = file.type === "image/jpeg";
			const isLt2M = file.size / 1024 / 1024 < 2;

			if (!isJPG) {
				this.Msg("上传头像图片只能是 JPG 格式!", "error", 2000);
			}
			if (!isLt2M) {
				this.Msg("上传头像图片大小不能超过 2MB!", "error", 2000);
			}
			return isJPG && isLt2M;
		},
		// 确认
		handelConfirm() {
			if (this.isAdd) {
				// 添加相册
				let bloggerId = local.get("blog_userinfo").bloggerId;
				let sendData = {
					bloggerId,
					albumName: this.dialogForm.name,
					albumCover: this.dialogForm.albumCover,
				};
				addAlbums(sendData).then((res) => {
					if (res.status === 200) {
						this.Msg("新增相册成功！", "success", 1500);
						this.dialogForm = {
							name: "",
							albumCover: "",
						};
						this.dialogVisible = false;
						this.isAdd = false;
						this.getAlbum();
					}
				});
			} else {
				// 修改相册
				let sendData = {
					albumId: this.dialogForm.albumId,
					albumName: this.dialogForm.name,
					albumCover: this.dialogForm.albumCover,
				};
				editAlbums(sendData).then((res) => {
					if (res.status === 200) {
						this.Msg("修改相册成功！", "success", 1500);
						this.dialogForm = {
							name: "",
							albumCover: "",
						};
						this.dialogVisible = false;
						this.isAdd = false;
						this.getAlbum();
					}
				});
			}
		},
		// 关闭dialog
		handelClose() {
			this.dialogForm = {
				name: "",
				albumCover: "",
			};
			this.dialogVisible = false;
			this.isAdd = false;
		},
		// 进入相册
		getInAlbum(id, name) {
			this.$router.push({
				path: "/album/album-manage/imgs",
				query: { albumName: name, albumId: id },
			});
		},
		// 编辑相册
		handelEdit(val) {
			this.dialogForm.name = val.albumName;
			this.dialogForm.albumCover = val.albumCover;
			this.dialogForm.albumId = val.id;
			this.isAdd = false;
			this.dialogVisible = true;
		},
		// 删除相册
		handelDel(id) {
			delAlbums({ albumId: id }).then((res) => {
				if (res.status === 200) {
					this.Msg("删除成功！", "success", 1500);
					this.getAlbum();
				}
			});
		},
	},
	filters: {
		// 格式化时间
		handelData(val) {
			return normalizeDate(val, "-") + " " + normalizeTime(val);
		},
	},
	created() {
		this.getAlbum();
	},
};
</script>

<style lang="less" scoped>
.album-page {
	position: relative;
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
		display: flex;
		flex-wrap: wrap;

		.item {
			margin: 5px;

			.img-wrap {
				position: relative;
				padding: 5px;
				margin-bottom: 10px;
				width: 150px;
				height: 210px;
				background-color: #fff;
				box-shadow: 5px 5px 4px #333;
				border: 1px solid #ddd;
				transition: all 2s linear;

				img {
					width: 100%;
					height: 100%;
				}

				.operation {
					position: absolute;
					top: 0;
					left: 0;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-evenly;
					width: 101%;
					height: 101%;
					background-color: rgba(255, 255, 255, 0.5);
				}
			}

			.album-name {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 5px;
				cursor: pointer;

				.album-info {
					position: absolute;
					bottom: calc(~"100% + 4px");
					left: calc(~"5% + 8px");
					padding: 5px;
					width: 90%;
					font-size: 12px;
					background-color: #fff;
					border: 1px solid #ddd;
					border-radius: 6px;

					.time {
						text-indent: 10px;
					}

					::before {
						position: absolute;
						bottom: -6px;
						right: 10px;
						transform: rotateZ(45deg);
						width: 10px;
						height: 10px;
						content: "";
						background-color: #fff;
						border-right: 1px solid #ddd;
						border-bottom: 1px solid #ddd;
					}
				}
			}
		}

		.add-album {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 150px;
			height: 210px;
			background-color: #eee;
			border: 1px dashed #ccc;
			box-shadow: 5px 5px 4px #333;
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

	.dialog {
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 20px;
		padding-top: 0;
		width: 400px;
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
			text-indent: 0;
		}

		.item {
			display: flex;
			margin-top: 20px;

			.upload-avatar{
				position: relative;
				width: 125px;
				height: 175px;
				border-radius: 4px;
				overflow: hidden;
				cursor: pointer;

				.add-wrap{
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					text-align: center;
					line-height: 120px;
					border: 1px dashed #ccc;
					
				}

				.img-wrap{
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;

					img{
						width: 100%;
						height: 100%;
					}

					.remove{
						display: none;
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						text-align: center;
						line-height: 175px;
						background-color: rgba(255, 255, 255, .3);
					}

					&:hover .remove{
						display: block;
					}
				}
			}

			.label {
				width: 100px;
			}

			.ipt {
				flex: 1;
			}
			.upload{
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
}

.dialog-clip{
	position: fixed;
	top: 0;
	left: 0;
	padding: 40px;
	width: 100%;
	min-width: 1450px;
	height: 100%;
	background-color: rgba(255, 255, 255, .8);
	z-index: 9999;

	.icon-error{
		position: absolute;
		top: 40px;
		right: 40px;
		font-size: 20px;
		cursor: pointer;
	}

	.dialog-title{
		font-size: 20px;
		color: #000;
	}
}

.fade-leave-active,
.fade-enter-active {
	transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>