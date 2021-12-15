<template>
	<div class="album-page">
		<div class="title">
			<p>相册列表</p>
			<l-botton type="primary" class="btn" size="small" @click="handelAddAlbum">
				新增相册
			</l-botton>
		</div>
		<div class="list-wrap">
			<ul class="list">
				<li v-for="(v, i) in albumsList" :key="v.id" class="item" :class="i === albumsList.length - 1 ? 'last-child' : ''">
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
						<div>
							<i class="iconfont icon-psd" v-if="v.isPrivate === 1"></i>
							{{ v.albumName }}
						</div>
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
		</div>

		<div class="page-section">
			<l-pagination
				:total="total"
				:size="size"
				@size-change="handelSizeChange"
				:sizeArr="[10, 20, 30, 40, 50]"
				@current-change="handelCurrentChange"
				:current-page="page"
				layout="total, sizes, jumper"
			></l-pagination>
		</div>

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
			<div class="item">
				<div class="label">是否私密</div>
				<div class="swicth-container">
					否
					<div class="swicth" :class="dialogForm.isPrivate ? 'swicth-on' : 'swicth-off'" @click="changePrivate"><div class="swicth-circle"></div></div>
					是
				</div>
			</div>
			<transition name="slide-fade">
				<div class="item" v-if="dialogForm.isPrivate">
					<div class="label">进入密码</div>
					<l-input
						class="ipt"
						v-model="dialogForm.password"
						:ipt-value="dialogForm.password"
						type="password"
						placeholder="请输入进入密码"
						clearable
					></l-input>
				</div>
			</transition>
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
import LPagination from "@/components/pagination.vue";

export default {
	data() {
		return {
			albumsList: [],
			dialogForm: {
				name: "",
				albumCover: "",
				isPrivate: true,
				password: ''
			},
			dialogVisible: false,
			isAdd: false,
			page: 1,
			size: 20,
			sort: 1,
			total: 0,
			dialogVisible_clip:false
		};
	},
	components: {
		LInput,
		LBotton,
		LUploadImage,
		cropper,
		LPagination
	},
	methods: {
		// 获取相册列表
		getAlbum() {
			let bloggerId = local.get("blog_userinfo").bloggerId;
			let sendData = {
				bloggerId,
				sort: this.sort,
				page: this.page,
				size: this.size,
			};
			getAlbumsList(sendData).then((res) => {
				if (res.status === 200) {
					this.total = res.data.data.total;
					this.albumsList = [...res.data.data.records];
					this.albumsList.forEach((v, i) => {
						this.$set(this.albumsList[i], "showInfo", false);
						this.$set(this.albumsList[i], "showOperation", false);
					});
				}
			});
		},
		handelSizeChange(val) {
			this.size = val;
            this.getAlbum();
		},
		handelCurrentChange(val) {
			this.page = val;
            this.getAlbum();
		},
		changePrivate() {
			this.dialogForm.isPrivate = !this.dialogForm.isPrivate;
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
				let sendData = {};
				if(this.dialogForm.isPrivate) {
					sendData = {
						bloggerId,
						albumName: this.dialogForm.name,
						albumCover: this.dialogForm.albumCover,
						isPrivate: 1,
						password: this.dialogForm.password
					};
				}else {
					sendData = {
						bloggerId,
						albumName: this.dialogForm.name,
						albumCover: this.dialogForm.albumCover,
						isPrivate: 0,
					};
				};
				
				addAlbums(sendData).then((res) => {
					if (res.status === 200) {
						this.Msg("新增相册成功！", "success", 1500);
						this.dialogForm = {
							name: "",
							albumCover: "",
							isPrivate: true,
							password: ''
						};
						this.dialogVisible = false;
						this.isAdd = false;
						this.getAlbum();
					}
				});
			} else {
				// 修改相册
				let sendData = {};
				if(this.dialogForm.isPrivate) {
					sendData = {
						albumId: this.dialogForm.albumId,
						albumName: this.dialogForm.name,
						albumCover: this.dialogForm.albumCover,
						isPrivate: 1,
						password: this.dialogForm.password
					};
				}else {
					sendData = {
						albumId: this.dialogForm.albumId,
						albumName: this.dialogForm.name,
						albumCover: this.dialogForm.albumCover,
						isPrivate: 0,
					};
				};
				console.log(sendData);
				editAlbums(sendData).then((res) => {
					if (res.status === 200) {
						this.Msg("修改相册成功！", "success", 1500);
						this.dialogForm = {
							name: "",
							albumCover: "",
							isPrivate: true,
							password: ''
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
			}).then(() => {
				location.reload();
			});
		},
		// 编辑相册
		handelEdit(val) {
			this.dialogForm.name = val.albumName;
			this.dialogForm.albumCover = val.albumCover;
			this.dialogForm.albumId = val.id;
			val.isPrivate ? this.dialogForm.isPrivate = true : this.dialogForm.isPrivate = false;
			val.isPrivate ? this.dialogForm.password = val.password : this.dialogForm.password = '';
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
		handelResize() {
			
		}
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
	mounted() {
		this.handelResize();
		window.addEventListener('resize', this.handelResize)
	}
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
		font-size: 20px;
		text-indent: 20px;
		line-height: 60px;
		border-bottom: 1px dashed #ccc;

		.btn{
			line-height: 32px;
		}
	}

	.list-wrap{
		padding-right: 10px;
		height: calc(~"100% - 81px - 51px");
		box-shadow: inset 0px -3px 5px #eee;
		overflow-y: scroll;

		&::-webkit-scrollbar {
			width: 6px;
		}
		&::-webkit-scrollbar-thumb {
			border-radius: 6px;
			background: #ccc;
		}
		&::-webkit-scrollbar-track {
			border-radius: 0;
			background: #fff;
		}

		.list {
			display: grid;
			grid-template-columns: repeat(auto-fill, 150px);
			grid-column-gap: 10px;
			grid-row-gap: 20px;
			justify-content: space-between;

			.item {

				.img-wrap {
					position: relative;
					padding: 5px;
					margin-bottom: 10px;
					width: 150px;
					height: 210px;
					background-color: #fff;
					box-shadow: 5px 5px 4px #333;
					border: 1px solid #ddd;
					transition: all .2s linear;

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

					.icon-psd{
						color: #888;
					}

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
		}
	}


	.page-section {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-top: 20px;
		width: 100%;
	}

	.dialog {
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 20px;
		padding-top: 0;
		width: 400px;
		// height: 400px;
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

			.swicth-container{
				display: flex;
				align-items: center;
				height: 38px;

				.swicth{
					position: relative;
					width: 40px;
					height: 20px;
					margin: 0 5px;
					background-color: #13ce66;
					border-radius: 15px;
					cursor: pointer;
					transition: all .2s linear;

					.swicth-circle{
						width: 18px;
						height: 18px;
						border-radius: 50%;
						background-color: #fff;
						transition: all .2s linear;
					}
				}

				.swicth-on{
					background-color: #13ce66;

					.swicth-circle{
						position: absolute;
						top: 1px;
						left: 21px;
					}
				}

				.swicth-off{
					background-color: #ff4949;

					.swicth-circle{
						position: absolute;
						top: 1px;
						left: 1px;
					}
				}
			}

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
					line-height: 175px;
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
				line-height: 38px;
			}

			.ipt {
				flex: 1;
			}
			.upload{
				flex: 1;
			}
		}

		.bottom {
			margin-top: 20px;
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

.slide-fade-enter-active {
	transition: all 0.3s linear;
}
.slide-fade-leave-active {
	transition: all 0.3s linear;
}
.slide-fade-enter,
.slide-fade-leave-to {
	transform: translateY(-10px);
	opacity: 0;
}
</style>