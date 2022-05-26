<template>
	<div class="add-article-page" ref="addArticePage">
		<div class="title">{{ pageTitle }}</div>
		<el-form :model="articleForm" :rules="rules" ref="articleForm" label-width="100px">
      <el-form-item label="文章标题" prop="title" class="article-title">
        <el-input v-model="articleForm.title" placeholder="请输入文章标题" clearable></el-input>
      </el-form-item>
      <el-form-item label="文章副标题" prop="subTitle" class="article-subTitle">
        <el-input type="textarea" :rows="1" maxlength="50" show-word-limit v-model="articleForm.subTitle" placeholder="请输入文章副标题" clearable></el-input>
      </el-form-item>
			<el-form-item label="文章封面" prop="coverUrl" class="article-coverUrl">
        <div class="upload-avatar">
					<div class="add-wrap" v-if="!articleForm.coverUrl" @click="dialogVisible_clip = true">
						<i class="iconfont icon-add"></i>
					</div>
					<div
						class="img-wrap"
						v-if="articleForm.coverUrl"
						title="更换"
					>
						<img :src="articleForm.coverUrl" class="img" v-if="articleForm.coverUrl" />
						<div class="remove" @click="dialogVisible_clip = true">
							<i class="iconfont icon-change"></i>
						</div>
					</div>
				</div>
      </el-form-item>
			<el-form-item label="文章标签" prop="articleTagList">
				<el-select
					v-model="articleForm.articleTagList"
					multiple
					collapse-tags
					filterable
					allow-create
					default-first-option
					placeholder="请选择"
				>
					<p class="add-tag" prefix @click="handelAddTag">
						<span>添加标签</span>
						<i class="iconfont icon-addtag"></i>
					</p>
					<el-option
						v-for="tag in tags"
						:key="tag.tagId"
						:label="tag.tagName"
						:value="tag.tagId"
					>
					</el-option>
				</el-select>
      </el-form-item>
			<el-form-item label="文章内容" prop="content" class="article-content">
        <mavon-editor v-model="articleForm.content" ref="md" @imgAdd="handleImgUpload"></mavon-editor>
      </el-form-item>
      <el-form-item class="btns-group">
				<el-button type="info" @click="reset('articleForm')">重置</el-button>
        <el-button type="primary" @click="submit('articleForm')">提交</el-button>
      </el-form-item>
    </el-form>

		<!-- 添加标签dialog -->
		<el-dialog
			title="添加标签"
			:visible.sync="dialogVisible"
			width="30%"
			@close="cancle('addTagForm')">
			<el-form :model="addTagForm" :rules="addTagRules" ref="addTagForm" label-width="100px" style="width: 100%">
				<el-form-item label="文章标签" prop="addTagName" style="width: 100%">
					<el-input v-model="addTagForm.addTagName" placeholder="请输入文章标签" clearable style="width: 100%"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="confirm('addTagForm')">添加</el-button>
			</span>
		</el-dialog>


		<div class="dialog-clip" v-if="dialogVisible_clip">
			<i class="iconfont icon-error" title="关闭" @click="dialogVisible_clip = false"></i>
			<div class="dialog-title">裁剪图片</div>
			<cropper :proportion="[1, 1]" @on-success="handleAvatarSuccess"></cropper>
		</div>
	</div>
</template>

<script>
import LInput from "@/components/input.vue";
import LUploadImage from "@/components/uploadImage.vue";
import LBotton from "@/components/botton.vue";
import cropper from "../../components/cropper.vue"

import axios from "axios";
import {
	getArticleInfoData,
	getArticleTagList,
	addArticleTagList,
	editArticle,
	addArticle,
} from "../../api/article";

import local from "../../utils/local";

export default {
	data() {
		return {
			pageTitle: "添加文章",
			content: '',
			articleForm: {
				title: "",
				subTitle: "",
				coverUrl: "",
				content: "",
				bloggerId: "",
				articleTagList: [],
			},
			rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
        ],
        subTitle: [
          { required: true, message: '请输入文章副标题', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        coverUrl: [
          { required: true, message: '请选择文章封面', trigger: 'blur' },
        ],
        articleTagList: [
          { required: true, message: '请选择文章副标签', trigger: 'blur' },
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' },
        ]
      },
			tags: [],
			tagSelList: [],
			addTagForm: {
				addTagName: ""
			},
			addTagRules: {
				addTagName:[
					{ required: true, message: '请输入文章标签', trigger: 'blur' }
				]
			},
			show: false,
			dialogVisible: false,
			dialogVisible_clip: false
		};
	},
	components: {
		LInput,
		LUploadImage,
		LBotton,
		cropper
	},
	methods: {
		// 编辑文章-获取文章内容
		getArticleInfo() {
			if (this.$route.query.id) {
				this.pageTitle = "修改文章";
				let id = this.$route.query.id;
				getArticleInfoData(id).then((res) => {
					if (res.status === 200) {
						let data = res.data.data;
						this.articleForm.title = data.title;
						this.articleForm.subTitle = data.subTitle;
						this.articleForm.coverUrl = data.coverUrl;
						this.articleForm.content = data.content;
						this.articleForm.articleTagList = data.tags;
					}
				});
			} else {
				this.pageTitle = "添加文章";
				this.articleForm = {
					title: "",
					subTitle: "",
					coverUrl: "",
					content: "",
					bloggerId: "",
					articleTagList: [],
				};
			}
		},
		// 获取文章标签
		getTags() {
			let bloggerId = local.get("blog_userinfo").bloggerId;
			this.articleForm.bloggerId = bloggerId;
			getArticleTagList(bloggerId).then((res) => {
				if (res.status === 200) {
					this.tags = [...res.data.data];
					this.tags.forEach((v, i) => {
						this.$set(this.tags[i], "active", false);
					})
				}
			});
		},
		// 添加文章标签
		handelAddTag() {
			this.dialogVisible = !this.dialogVisible;
		},
		confirm(formName) {
			this.$refs[formName].validate((valid) => {
        if (valid) {
					addArticleTagList({
						bloggerId: this.articleForm.bloggerId,
						tagName: this.addTagForm.addTagName,
					})
						.then((res) => {
							if (res.status === 200) {
								this.$modal.msgSuccess('添加成功 ~');
								this.getTags();
								this.dialogVisible = false;
							}
						})
						.catch((err) => {
							this.$modal.msgError('添加失败...');
							console.log(err);
						});
        } else {
          console.log('error');
          return false;
        }
      });
		},
		cancle(formName) {
			this.$refs[formName].resetFields();
			this.dialogVisible = false;
		},
		handleImgUpload(pos, $file) {
			let formData = new FormData();
			formData.append("image", $file);
			axios
				.post(
					"http://api.excellentlld.com/blog/back/upload-image",
					formData,
					{ headers: { "Content-Type": "multipart/form-data" } }
				)
				.then((res) => {
					if (res.status === 200) {
						this.$refs.md.$img2Url(pos, res.data.data[0])
					}
				});
		},
		handleAvatarSuccess(data) {
			this.articleForm.coverUrl = data;
			this.dialogVisible_clip = false;
		},
		beforeAvatarUpload(file) {
			const isJPG = file.type === "image/jpeg";
			const isLt2M = file.size / 1024 / 1024 < 2;

			if (!isJPG) {
				this.$modal.msgError('上传头像图片只能是 JPG 格式!');
			}
			if (!isLt2M) {
				this.$modal.msgError('上传头像图片大小不能超过 2MB!');
			}
			return isJPG && isLt2M;
		},
		submit(formName) {
			let bloggerId = local.get("blog_userinfo").bloggerId;
			this.articleForm.bloggerId = bloggerId;
			console.log(this.articleForm);
			this.$refs[formName].validate((valid) => {
        if (valid) {
					if (this.$route.query.id) {
						let data = {
							title: this.articleForm.title,
							subTitle: this.articleForm.subTitle,
							coverUrl: this.articleForm.coverUrl,
							content: this.articleForm.content,
							articleTagList: this.articleForm.articleTagList,
							articleId: this.$route.query.id * 1,
						};
						editArticle(data).then((res) => {
							console.log(res);
							if (res.status === 200) {
								this.$modal.msgSuccess('修改成功 ~');
								this.articleForm = {
									title: "",
									subTitle: "",
									coverUrl: "",
									content: "",
									bloggerId: "",
									articleTagList: [],
								};
							}
						});
					} else {
						addArticle(this.articleForm).then((res) => {
							if (res.status === 200) {
								this.$modal.msgSuccess('发表成功 ~');
								this.articleForm = {
									title: "",
									subTitle: "",
									coverUrl: "",
									content: "",
									bloggerId: "",
									articleTagList: [],
								};
							}
						});
					}
				}
			})
		},
		reset(formName) {
			this.$refs[formName].resetFields();
			this.articleForm = {
				title: "",
				subTitle: "",
				coverUrl: "",
				content: "",
				bloggerId: "",
				articleTagList: [],
			};
		}
	},
	created() {
		this.getArticleInfo();
		this.getTags();
	},
	mounted() {
	},
};
</script>

<style lang="less">
body {
	margin: 0px !important;
}
.add-tag {
	display: flex;
	justify-content: space-between;
	padding-right: 20px;
	margin-bottom: 5px;
	line-height: 36px;
	text-indent: 20px;
	border-bottom: 1px dashed #ccc;
	cursor: pointer;

	&:hover {
		color: #409EFF;
	}
}
</style>
<style lang="less" scoped>
.add-article-page {
	position: relative;
	padding: 20px;
	padding-top: 0;
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

	.el-form {
		display: flex;
		flex-wrap: wrap;

		.article-title {
			margin-right: 20px;
			width: 30%;
		}

		.article-subTitle {
			width: calc(100% - 30% - 20px);

			.el-textarea {
				height: 40px;

				/deep/.el-textarea__inner {
					height: 40px;
					line-height: 28px;
				}

				/deep/.el-input__count {
					bottom: 10px;
					height: 20px;
					line-height: 20px;
					background-color: transparent;
				}
			}
		}

		.article-coverUrl {
			margin-right: 20px;
			width: 30%;

			.upload-avatar{
				position: relative;
				width: 120px;
				height: 120px;
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
		}

		.icon-addtag {
			color: #999;
		}

		.article-content, .btns-group {
			width: 100%;
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
</style>