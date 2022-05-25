<template>
	<div class="add-article-page" ref="addArticePage">
		<div class="title">{{ pageTitle }}</div>
		<div class="form-wrap">
			<div class="item-wrap">
				<div class="item">
					<div class="label">文章标题</div>
					<l-input
						class="edit"
						v-model="articleForm.title"
						:ipt-value="articleForm.title"
						type="text"
						placeholder="请输入文章标题"
						clearable
					>
					</l-input>
				</div>
				<div class="item item-subTitle">
					<div class="label">文章副标题</div>
					<l-input
						class="edit"
						v-model="articleForm.subTitle"
						:ipt-value="articleForm.subTitle"
						type="textarea"
						placeholder="请输入文章副标题"
						maxlength="50"
						clearable
					></l-input>
				</div>
				<div class="item">
					<div class="label">文章封面</div>
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
				</div>
				<div class="item item-select">
					<div class="label">文章标签</div>
					<div class="select-wrap" @mouseenter="toggleShow" @mouseleave="toggleHide">
						<p v-if="tagSelList.length > 0" class="sel-tags">
							<span class="text"
								>{{ tagSelList[0].tagName }}
							</span>
							<span class="text more" v-if="tagSelList.length > 1"
								>+{{ tagSelList.length - 1 }}</span
							>
						</p>
						<p v-else class="placeholder">请选择</p>
						<i class="iconfont icon-down"></i>
						<div ref="optionWrap" class="option-wrap">
							<ul class="option" ref="option" id="option">
								<li class="add-tag" @click.stop="handelAddTag">
									新增标签<i class="iconfont icon-addtag"></i>
								</li>
								<li
									:class="v.active ? 'active' : ''"
									v-for="v in tags"
									:key="v.tagId"
									@click.stop="handelChoose(v)"
								>
									{{ v.tagName }}
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div class="item item-content">
				<div class="label">文章内容</div>
				<div class="content">
    			<mavon-editor v-model="articleForm.content" ref="md" @imgAdd="handleImgUpload"></mavon-editor>
				</div>
			</div>
			<div class="item item-btn">
				<l-botton type="primary" @click="submit">提交</l-botton>
				<l-botton type="info" class="reset" @click="reset"
					>重置</l-botton
				>
			</div>
		</div>

		<div class="dialog" v-if="dialogVisible">
			<div class="title">添加标签</div>
			<div class="add-ipt">
				<div class="label">文章标签</div>
				<l-input
					class="edit"
					v-model="addTagName"
					:ipt-value="addTagName"
					type="text"
					placeholder="请输入文章标签"
					clearable
				>
				</l-input>
			</div>
			<div class="btn-group">
				<l-botton
					type="primary"
					size="mini"
					@click="confirm"
					style="margin-right: 10px"
					>添加</l-botton
				>
				<l-botton type="info" size="mini" class="reset" @click="cancle"
					>取消</l-botton
				>
			</div>
			<i class="iconfont icon-closeCard" @click="cancle"></i>
		</div>

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
			tags: [],
			tagSelList: [],
			addTagName: "",
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
		getArticleInfo() {
			if (this.$route.query.id) {
				this.pageTitle = "修改文章";
				let id = this.$route.query.id;
				getArticleInfoData(id).then((res) => {
					if (res.status === 200) {
						let data = res.data.data;
						(this.articleForm.title = data.title),
							(this.articleForm.subTitle = data.subTitle),
							(this.articleForm.coverUrl = data.coverUrl),
							(this.articleForm.content = data.content),
							(this.articleForm.articleTagList = data.tags),
							(this.tagSelList = data.tags);
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
				this.tagSelList = [];
			}
		},
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
		submit() {
			let bloggerId = local.get("blog_userinfo").bloggerId;
			this.articleForm.bloggerId = bloggerId;
			this.tagSelList.forEach((v) => {
				this.articleForm.articleTagList.push(v.tagId);
			});
			let flag = true;
			for (let key in this.articleForm) {
				if (this.articleForm[key].length <= 0) {
					flag = false;
				}
			}
			if (!flag) return;
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
						this.tagSelList = [];
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
						this.tagSelList = [];
					}
				});
			}
		},
		reset() {
			this.articleForm = {
				title: "",
				subTitle: "",
				coverUrl: "",
				content: "",
				bloggerId: "",
				articleTagList: [],
			};
		},
		toggleShow() {
			this.$refs.optionWrap.style.height = (30 + 12) * (this.tags.length + 1) + 5 + "px";
			this.$refs.optionWrap.style.opacity = 1;
		},
		toggleHide() {
			this.$refs.optionWrap.style.height = 0;
			this.$refs.optionWrap.style.opacity = 0;
		},
		handelAddTag() {
			this.dialogVisible = !this.dialogVisible;
		},
		handelChoose(val) {
			if (this.tagSelList.indexOf(val) === -1) {
				this.tagSelList.push(val);
				val.active = true;
			} else {
				this.tagSelList.splice(this.tagSelList.indexOf(val), 1);
				val.active = false;
			}
		},
		confirm() {
			if (this.addTagName.length > 0) {
				addArticleTagList({
					bloggerId: this.articleForm.bloggerId,
					tagName: this.addTagName,
				})
					.then((res) => {
						if (res.status === 200) {
							this.$modal.msgSuccess('添加成功 ~');
							this.getTags();
							this.$refs.optionWrap.style.height = 30 + 12 + 12 + this.$refs.optionWrap.style.height + "px";
							this.dialogVisible = false;
						}
					})
					.catch((err) => {
						this.$modal.msgError('添加失败...');
						console.log(err);
					});
			}
		},
		cancle() {
			this.dialogVisible = false;
		}
	},
	created() {
		this.getArticleInfo();
		this.getTags();
	},
	mounted() {
		// this.editorInit.height = this.$refs.addArticePage.offsetHeight - 61 - 202 - 80;
	},
};
</script>

<style>
body {
	margin: 0px !important;
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

	.form-wrap {
		display: flex;
		flex-direction: column;

		.item-wrap{
			display: flex;
			flex-wrap: wrap;
		}

		.item {
			display: flex;
			margin-bottom: 20px;
			width: 30%;

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
						line-height: 120px;
						background-color: rgba(255, 255, 255, .3);
					}

					&:hover .remove{
						display: block;
					}
				}
			}
		}

		.item-subTitle {
			margin-left: 20px;
			width: 50%;
		}

		.item-select {
			margin-left: 20px;
			height: 40px;

			.select-wrap {
				position: relative;
				padding: 0 20px;
				width: 200px;
				line-height: 40px;
				border: 1px solid #dcdfe6;
				border-radius: 6px;
				cursor: pointer;

				.sel-tags {
					display: flex;
					align-items: center;
					height: 40px;

					.text {
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: 0 12px 0 12px;
						height: 24px;
						font-size: 12px;
						line-height: 24px;
						background-color: #f4f4f5;
						border-radius: 4px;
					}

					.more{
						margin-left: 10px;
					}
				}

				.placeholder {
					user-select: none;
					color: #c0c4cc;
				}

				.icon-down {
					position: absolute;
					top: 50%;
					right: 20px;
					transform: translateY(-50%);
					color: #c0c4cc;
				}

				.option-wrap {
					position: absolute;
					top: 45px;
					left: 0;
					width: 100%;
					height: 0;
					transition: all 0.1s linear;
					opacity: 0;
					overflow: hidden;
					z-index: 9998;

					.option {
						position: absolute;
						top: 5px;
						left: 0;
						width: 100%;
						border: 1px solid #e4e7ed;
						border-radius: 6px;
						box-shadow: -1px 2px 5px #e4e7ed;
						background-color: #fff;
						z-index: 9998;

						.active{
							color: #409eff;
							background-color: #f5f7fa;
						}

						&::before {
							position: absolute;
							top: -5px;
							left: 20px;
							transform: rotateZ(45deg);
							width: 8px;
							height: 8px;
							content: "";
							background-color: #fff;
							border-left: 1px solid #eee;
							border-top: 1px solid #eee;
						}

						.add-tag {
							display: flex;
							justify-content: space-between;
							align-items: center;
							border-bottom: 1px dashed #ccc;

							.icon-addtag {
								color: #999;
							}
						}

						li {
							padding: 0 20px;
							margin: 6px 0;
							line-height: 30px;

							&:hover {
								background-color: #f5f7fa;
							}
						}
					}
				}
			}
		}

		.item-content {
			flex: 1;
			position: relative;
			width: 100%;
			z-index: 98;

			.content {
				flex: 1;
			}
		}

		.item-btn {
			margin-top: 20px;
			margin-left: 100px;

			.reset {
				margin-left: 20px;
			}
		}
	}
}

.dialog {
	position: absolute;
	top: 30%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 400px;
	background-color: #fff;
	border: 1px solid #e4e7ed;
	border-radius: 6px;
	z-index: 9999;

	.title {
		margin: 0;
		font-size: 14px;
		line-height: 30px;
	}

	.add-ipt {
		display: flex;
		align-items: center;
		padding: 0 20px;
		height: 60px;

		.label {
			width: 80px;
		}

		.edit {
			flex: 1;
		}
	}

	.btn-group {
		display: flex;
		justify-content: flex-end;
		padding: 0 20px 10px;
	}

	.icon-closeCard {
		position: absolute;
		top: 4px;
		right: 8px;
		cursor: pointer;
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