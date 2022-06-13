<template>
	<div class="wrap">
		<div class="upload-section">
			<label v-if="!multiple" class="single-upload">
				<input
					type="file"
					class="ipt"
					:multiple="multiple"
					@change="upload"
				/>
				<div class="add-wrap">
					<i class="iconfont icon-add"></i>
				</div>
				<div
					class="img-wrap"
					v-if="url"
					title="更换"
				>
					<img :src="url" class="img" v-if="url" />
					<div class="remove">
						<i class="iconfont icon-change"></i>
					</div>
				</div>
			</label>
			<div class="imgs-list" v-if="multiple">
				<label style="margin-right: 10px">
					<input
						type="file"
						class="ipt"
						:multiple="multiple"
						accept="image/*"
						@change="upload"
					/>
					<div class="add-wrap">
						<i class="iconfont icon-add"></i>
					</div>
				</label>
				<div class="img-wrap1" v-for="(v, i) in url" :key="i">
					<img :src="v" class="img" />
					<div class="del" @click="removeImg(i)">
						<i class="iconfont icon-remove"></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="loading" v-if="showLoading">
			<div class="content">
				<div class="sircle"></div>
				上传中
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios";

export default {
	data() {
		return {
			url: this.src,
			file: null,
			showLoading: false,
		};
	},
	props: {
		action: {
			type: String,
		},
		beforeUpload: {
			type: Function,
		},
		src: {
			// type: Array || String,
		},
		multiple: {
			type: Boolean
		},
		path: {
			type: String,
		}
	},
	methods: {
		async upload(e) {
			if (e.target.files.length > 5) {
				this.$modal.msgWarning('最多5张，重新选择吧~');
			} else {
				if (this.file) return;
				this.showLoading = true;
				let path = ''
				if (this.$store.state.bloggerId || this.$store.state.bloggerId === 0) {
					switch (this.$store.state.bloggerId) {
						case 1:
							path = 'lf/blog/album'
							break

						case 2:
							path = 'lh/blog/album'
							break

						case 3:
							path = 'dy/blog/album'
							break

						default:
							path = ''
							break
					}
				}
				let promiseArr = []
				for (let i = 0; i < e.target.files.length; i++) {
					if (!this.beforeUpload(e.target.files[i])) {
						return;
					}else {
						let data = new FormData();
						let ret = await this.beforeUpload(e.target.files[i]);
						if (path) {
							data.append("path", `${path}/${this.path}`);
						}
						data.append("images", ret, "DX.jpg");
						const p = new Promise((rel, rej) => {
							axios.post(this.action, data, {headers: {"Content-Type": "multipart/form-data"}}).then(res => {
								if (res.status === 200) {
									rel(res.data.data.url)
								}
							}).catch(err => {
								rej(err);
							})
						})
						promiseArr.push(p)
					};
				}

				Promise.all(promiseArr).then(res => {
					this.url = res
					this.$emit("on-success", res);
					this.showLoading = false;
				}).catch(err => {
					console.log(err);
				})
			}
		},
    removeImg(i) {
      this.url.splice(i, 1);
      this.$emit("on-remove", i);
    }
	},
	watch: {
		src(newval) {
			this.url = newval;
		},
	},
};
</script>

<style lang="less" scoped>
.wrap {
	display: flex;
	align-items: flex-end;
	width: 100%;
	// width: 220px;
	// height: 120px;
}

.upload-section {
	position: relative;
	width: 100%;
	// width: 120px;
	// height: 120px;
}
.ipt {
	display: none;
}

.single-upload{
	width: 100%;
}
.add-wrap {
	position: relative;
	width: 120px;
	height: 120px;
	border: 1px dashed #ccc;
	border-radius: 6px;
	text-align: center;
	line-height: 120px;
	cursor: pointer;

	.icon-add {
		font-size: 20px;
		text-align: center;
		line-height: 20px;
	}

	&:hover {
		border-color: #409eff;
	}

	&:hover .icon-add {
		color: #409eff;
	}
}
.img-wrap {
	position: absolute;
	top: 0;
	left: 0;
	width: 120px;
	height: 120px;

	.img {
		width: 120px;
		height: 120px;
		border: 0;
		border-radius: 6px;
	}

	.remove {
		display: none;
		position: absolute;
		top: 0;
		left: 0;
		width: 120px;
		height: 120px;
		text-align: center;
		line-height: 120px;
		background-color: rgba(255, 255, 255, 0.5);
		cursor: pointer;

		.icon-remove {
			color: #333;
			font-weight: 700;
			font-size: 20px;
		}
	}

	&:hover .remove {
		display: block;
	}
}

.imgs-list {
	display: flex;
	flex-wrap: wrap;

	.img-wrap1 {
		position: relative;
		margin-bottom: 10px;
		margin-right: 10px;
		width: 120px;
		height: 120px;

		img {
			width: 100%;
			height: 100%;
		}

		.del {
			display: none;
			position: absolute;
			top: 0;
			left: 0;
			width: 120px;
			height: 120px;
			text-align: center;
			line-height: 120px;
			background-color: rgba(255, 255, 255, 0.5);
			cursor: pointer;

			.icon-remove {
				color: #333;
				font-weight: 700;
				font-size: 20px;
			}
		}

		&:hover .del {
			display: block;
		}
	}
}

.loading{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(255, 255, 255, .8);

	.content{
		display: flex;
		flex-direction: column;
		align-items: center;
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);

		.sircle{
			margin-bottom: 10px;
			width: 30px;
			height: 30px;
			border-bottom: 1px solid #59abff;
			border-radius: 50%;
			animation: goRotate .7s ease-in-out infinite;
		}
	}
}

@keyframes goRotate {
	0%{
		transform: rotateZ(0deg);
	}
	50%{
		transform: rotateZ(180deg);
	}
	100%{
		transform: rotateZ(360deg);
	}
}
</style>