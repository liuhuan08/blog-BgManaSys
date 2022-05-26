<template>
	<div class="blogger-info-page">
		<div class="title">博主信息</div>
		<el-form :model="formData" :rules="rules" ref="formData" label-width="100px">
      <el-form-item label="博主名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入博主名" clearable></el-input>
      </el-form-item>
			<el-form-item label="头像" prop="avatar">
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
      </el-form-item>
			<el-form-item label="简介" prop="conciseDesc" class="conciseDesc">
        <el-input type="textarea" :rows="1" maxlength="20" show-word-limit v-model="formData.conciseDesc" placeholder="请输入简介" clearable></el-input>
      </el-form-item>
			<el-form-item label="详细介绍" prop="detailDesc">
        <el-input type="textarea" :rows="10" maxlength="200" show-word-limit v-model="formData.detailDesc" placeholder="请输入详细介绍" clearable></el-input>
      </el-form-item>
      <el-form-item>
				<el-button type="info" @click="reset('formData')">重置</el-button>
        <el-button type="primary" @click="submit('formData')">提交</el-button>
      </el-form-item>
    </el-form>

		<div class="dialog" v-show="dialogVisible">
			<i class="iconfont icon-error" title="关闭" @click="dialogVisible = false"></i>
			<div class="dialog-title">裁剪图片</div>
			<cropper :proportion="[5, 7]" @on-success="handleAvatarSuccess"></cropper>
		</div>
	</div>
</template>

<script>
import LInput from "@/components/input.vue";
import LUploadImage from "@/components/uploadImage.vue";
import LBotton from "@/components/botton.vue";
import cropper from "../../components/cropper.vue"

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
			rules: {
				name: [
          { required: true, message: '请输入博主名', trigger: 'blur' },
        ],
				avatar: [
          { required: true, message: '请选择头像', trigger: 'blur' },
        ],
				conciseDesc: [
          { required: true, message: '请输入简介', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
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
			this.$store.commit('GET_USERINFO')
			this.formData = {...this.$store.state.userinfo}
		},
		handleAvatarSuccess(data) {
			this.formData.avatar = data;
			this.dialogVisible = false;
		},
		beforeAvatarUpload(file) {
			const isJPG = file.type === "image/jpeg";
			const isLt2M = file.size / 1024 / 1024 < 2;

			if (!isJPG) {
				this.$modal.msgError("上传头像图片只能是 JPG 格式!");
			}
			if (!isLt2M) {
				this.$modal.msgError("上传头像图片大小不能超过 2MB!");
			}
			return isJPG && isLt2M;
		},
    submit() {
			this.$refs.formData.validate((valid) => {
        if (valid) {
					modifyBlogger(this.formData).then(res => {
						if(res.status === 200) {
							this.$modal.msgSuccess(res.data.message);
							this.$store.dispatch('set_userinfo', this.formData)
						} else {
							this.getData()
						}
					}).catch((err) => {
						this.$modal.msgError('修改失败');
						this.getData()
					})
				}
			})
    },
    reset() {
			this.$refs.formData.resetFields();
      this.getData()
    }
	},
	created() {
		this.getData();
	},
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

	.el-form {
		width: 50%;

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
				
				&:hover {
					border-color: #409EFF;
				}
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

		.conciseDesc {
			.el-textarea {
				height: 40px;
				line-height: 40px;

				/deep/.el-textarea__inner {
					height: 40px;
					line-height: 28px;
				}
			}
		}

		/deep/.el-input__count {
			bottom: 10px;
			height: 20px;
			line-height: 20px;
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