<template>
	<div class="blogger-info-page">
		<div class="title">博主信息</div>
		<div class="edit-section">
			<div class="item">
				<div class="label">博主名</div>
				<l-input
					class="edit"
					v-model="formData.name"
					:ipt-value="formData.name"
					type="text"
					placeholder="请输入姓名"
					clearable
				></l-input>
			</div>
			<div class="item">
				<div class="label">头像</div>
				<div class="upload-avatar">
					<div class="add-wrap" v-if="!formData.avatar" @click="dialogVisible = true">
						<i class="iconfont icon-add"></i>
					</div>
					<div
						class="img-wrap"
						v-if="formData.avatar"
						title="更换"
					>
						<img :src="formData.avatar" class="img" v-if="formData.avatar" />
						<div class="remove" @click="dialogVisible = true">
							<i class="iconfont icon-change"></i>
						</div>
					</div>
				</div>
			</div>
			<div class="item">
				<div class="label">简介</div>
				<l-input
					class="edit"
					v-model="formData.conciseDesc"
					:ipt-value="formData.conciseDesc"
					type="textarea"
					placeholder="请输入简介"
					maxlength="20"
					clearable
				></l-input>
			</div>
			<div class="item">
				<div class="label">详细介绍</div>
				<l-input
					class="edit"
					v-model="formData.detailDesc"
					:ipt-value="formData.detailDesc"
					type="textarea"
					placeholder="请输入详细介绍"
					maxlength="200"
                    rows="10"
					clearable
				></l-input>
			</div>
			<div class="item item-btn">
				<l-botton type="primary" @click="submit()">提交</l-botton>
				<l-botton type="info" class="reset" @click="reset">重置</l-botton>
			</div>
		</div>

		<div class="dialog" v-show="dialogVisible">
			<i class="iconfont icon-error" title="关闭" @click="dialogVisible = false"></i>
			<div class="dialog-title">裁剪图片</div>
			<cropper @on-success="handleAvatarSuccess"></cropper>
		</div>
	</div>
</template>

<script>
import LInput from "@/components/input.vue";
import LUploadImage from "@/components/uploadImage.vue";
import LBotton from "@/components/botton.vue";
import cropper from "../../components/cropper.vue"

import local from "@/utils/local";
import { modifyBlogger } from "@/api/user"

export default {
	data() {
		return {
			formData: {
                bloggerId: 0,
				name: "",
				avatar: "",
				conciseDesc: "",
				detailDesc: "",
			},
			dialogVisible: false
		};
	},
	components: {
		LInput,
		LUploadImage,
		LBotton,
		cropper
	},
	methods: {
		getData() {
			this.formData = local.get("blog_userinfo");
		},
		handleAvatarSuccess(data) {
			this.formData.avatar = data;
			this.dialogVisible = false;
		},
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
        submit() {
            modifyBlogger(this.formData).then(res => {
                if(res.status === 200) {
                    this.Msg(res.data.message, 'success', 2000);
                    local.set("blog_userinfo", this.formData);
                    this.$EventBus.$emit('changeAvatar', this.formData.avatar)
                }
            })
        },
        reset() {
            this.formData = local.get("blog_userinfo");
        }
	},
	created() {
		this.getData();
	},
	mounted() {},
};
</script>

<style lang="less" scoped>
.blogger-info-page {
	padding: 20px;
	padding-top: 0;
	width: 100%;
	height: 100%;
	background-color: #fff;

	.title {
		margin-bottom: 20px;
		font-size: 20px;
		text-indent: 100px;
		line-height: 60px;
		border-bottom: 1px dashed #ccc;
	}

	.edit-section {
		width: 50%;

		.item {
			display: flex;
			margin-bottom: 20px;

			.label {
				margin-right: 20px;
				width: 80px;
				line-height: 38px;
				text-align: right;
			}

			.edit {
				flex: 1;
			}

			.upload-avatar{
				position: relative;
				width: 120px;
				height: 120px;
				border-radius: 6px;
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
						line-height: 120px;
						background-color: rgba(255, 255, 255, .3);
					}

					&:hover .remove{
						display: block;
					}
				}
			}
		}
		.item-btn {
            margin-top: 50px;
			margin-left: 100px;

			.reset {
				margin-left: 20px;
			}
		}
	}
}

.dialog{
	position: fixed;
	top: 0;
	left: 0;
	padding: 40px;
	width: 100%;
	min-width: 1450px;
	height: 100%;
	background-color: rgba(255, 255, 255, .8);

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
</style>