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
				<l-upload-image
					class="edit"
					:src="formData.avatar"
					action="http://api.excellentlld.com/blog/back/upload-image"
					@on-success="handleAvatarSuccess"
					:before-upload="beforeAvatarUpload"
				></l-upload-image>
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
	</div>
</template>

<script>
import LInput from "@/components/input.vue";
import LUploadImage from "@/components/uploadImage.vue";
import LBotton from "@/components/botton.vue";

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
		};
	},
	components: {
		LInput,
		LUploadImage,
		LBotton,
	},
	methods: {
		getData() {
			this.formData = local.get("blog_userinfo");
		},
		handleAvatarSuccess(data) {
			this.formData.avatar = data.data.url;
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
            console.log(this.formData);
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
</style>