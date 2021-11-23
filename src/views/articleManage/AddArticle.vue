<template>
	<div class="add-article-page">
		<div class="title">添加文章</div>
		<div class="form-wrap">
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
					maxlength="20"
					clearable
				></l-input>
			</div>
			<div class="item">
				<div class="label">文章封面</div>
				<l-upload-image
					class="edit"
					:src="articleForm.coverUrl"
					action="http://api.excellentlld.com/blog/back/upload-image"
					@on-success="handleAvatarSuccess"
					:before-upload="beforeAvatarUpload"
				></l-upload-image>
			</div>
			<div class="item item-select">
				<div class="label">文章标签</div>
				<div class="select-wrap" @click.stop="toggleShow">
					<p v-if="tagSelList.length > 0" class="sel-tags">
						<span class="text"
							>{{ tagSelList[0].tagName }}
							<i
								class="iconfont icon-closeCard"
								@click.stop="handelDel"
							></i
						></span>
						<span class="text" v-if="tagSelList.length > 1"
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
			<div class="item item-content">
				<div class="label">文章内容</div>
				<div class="content">
					<Editor
						id="tinymce"
						v-model="articleForm.content"
						:init="editorInit"
					></Editor>
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
	</div>
</template>

<script>
import LInput from "@/components/input.vue";
import LUploadImage from "@/components/uploadImage.vue";
import LBotton from "@/components/botton.vue";

import axios from "axios";
import { getArticleTagList, addArticleTagList, addArticle } from "../../api/article";

import local from "../../utils/local";

import tinymce from "tinymce/tinymce";
import "tinymce/themes/silver/theme";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/icons/default/icons";
import "tinymce/plugins/image";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/contextmenu";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/colorpicker";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/preview";
import "tinymce/plugins/code";
import "tinymce/plugins/link";
import "tinymce/plugins/advlist";
import "tinymce/plugins/codesample";
import "tinymce/plugins/hr";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/textpattern";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/autolink";
import "tinymce/plugins/directionality";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/visualchars";
import "tinymce/plugins/template";
import "tinymce/plugins/charmap";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/imagetools";
import "tinymce/plugins/autosave";
import "tinymce/plugins/autoresize";
import "@/assets/tinymce/plugins/lineheight/plugin";

export default {
	data() {
		return {
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
			editorInit: {
				language_url: require("../../tinymce/zh_CN.js"),
				language: "zh_CN",
				skin_url: require("../../tinymce/skins/ui/oxide/skin.css"),
				content_css: require("../../tinymce/skins/content/default/content.css"),
				height: 400,
				min_height: 400,
				max_height: 400,
				toolbar_mode: "wrap",
				plugins:
					"preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr nonbreaking insertdatetime advlist lists wordcount imagetools textpattern autosave autoresize lineheight",
				toolbar:
					"code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link codesample | alignleft aligncenter alignright alignjustify outdent indent lineheight formatpainter | \
                    styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
                    table image media charmap hr pagebreak insertdatetime | fullscreen preview",
				content_style: "p {margin: 5px 0;}",
				fontsize_formats:
					"12px 14px 16px 18px 24px 36px 48px 56px 72px",
				font_formats:
					"微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
				branding: false,
				images_upload_handler: (blobInfo, success, failure) => {
					this.handleImgUpload(blobInfo, success, failure);
				},
			},
			addTagName: "",
			show: false,
			dialogVisible: false,
		};
	},
	components: {
		LInput,
		LUploadImage,
		LBotton,
		Editor,
	},
	methods: {
		getTags() {
			let bloggerId = local.get("blog_userinfo").bloggerId;
			this.articleForm.bloggerId = bloggerId;
			getArticleTagList(bloggerId).then((res) => {
				if (res.status === 200) {
					this.tags = res.data.data;
				}
			});
		},
		handleImgUpload(blobInfo, success, failure) {
			let formData = new FormData();
			formData.append("image", blobInfo.blob());
			axios
				.post(
					"http://api.excellentlld.com/blog/back/upload-image",
					formData,
					{ headers: { "Content-Type": "multipart/form-data" } }
				)
				.then((res) => {
					if (res.status === 200) {
						success(res.data.data.url);
					}
				});
		},
		handleAvatarSuccess(data) {
			this.articleForm.coverUrl = data.data.url;
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
            this.tagSelList.forEach(v => {
                this.articleForm.articleTagList.push(v.tagId)
            })
            let flag = true;
            for(let key in this.articleForm) {
                if(this.articleForm[key].length <= 0) {
                    flag = false;
                }
            };
            console.log(flag);
            if(!flag) return;
            console.log(this.articleForm);
            addArticle(this.articleForm).then(res => {
                if (res.status === 200) {
                    this.Msg("发表成功 ~", "success", 1500);
                    this.articleForm = {
                        title: "",
                        subTitle: "",
                        coverUrl: "",
                        content: "",
                        bloggerId: "",
                        articleTagList: [],
                    }
                }
            })
        },
		reset() {
            this.articleForm = {
                        title: "",
                        subTitle: "",
                        coverUrl: "",
                        content: "",
                        bloggerId: "",
                        articleTagList: [],
                    }
        },
		toggleShow() {
			this.show = !this.show;
			if (this.show) {
				this.$refs.optionWrap.style.height = (30 + 12) * (this.tags.length + 1) + 5 + "px";
				this.$refs.optionWrap.style.opacity = 1;
			} else {
				this.$refs.optionWrap.style.height = 0;
				this.$refs.optionWrap.style.opacity = 0;
			}
		},
		handelAddTag() {
			this.dialogVisible = !this.dialogVisible;
		},
		handelDel() {
			this.tagSelList.shift();
		},
		handelChoose(val) {
			if (this.tagSelList.indexOf(val) === -1) {
				this.tagSelList.push(val);
				console.log(this.tagSelList);
			} else {
				this.tagSelList.splice(this.tagSelList.indexOf(val), 1);
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
							this.Msg("添加成功 ~", "success", 1500);
							this.getTags();
							this.$refs.optionWrap.style.height = (30 + 12 + 12) + this.$refs.optionWrap.style.height + "px";
							this.dialogVisible = false;
						}
					})
					.catch((err) => {
						this.Msg("添加失败...", "failed", 1500);
						console.log(err);
					});
			}
		},
		cancle() {
			this.dialogVisible = false;
		},
	},
	created() {
		this.getTags();
	},
	mounted() {
		tinymce.init({});
        document.addEventListener('click', (e) => {
            // console.dir(e.target);
            this.show = false;
            this.$refs.optionWrap.style.height = 0;
			this.$refs.optionWrap.style.opacity = 0;
            // if(e.target.id === 'option') {

            // }
        })
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
		flex-wrap: wrap;

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
						padding: 0 8px 0 12px;
						height: 24px;
						font-size: 12px;
						line-height: 24px;
						background-color: #f4f4f5;
						border-radius: 4px;

						.iconfont {
							margin-left: 6px;
						}
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
					top: 50px;
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
			position: relative;
			width: 100%;
			z-index: 98;

			.content {
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
</style>