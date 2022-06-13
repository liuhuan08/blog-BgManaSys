<template>
	<div class="cropper-content">
		<div class="cropper-box">
			<div class="cropper">
				<vue-cropper
					ref="cropper"
					:img="option.img"
					:outputSize="option.outputSize"
					:outputType="option.outputType"
					:info="option.info"
					:canScale="option.canScale"
					:autoCrop="option.autoCrop"
					:autoCropWidth="option.autoCropWidth"
					:autoCropHeight="option.autoCropHeight"
					:fixed="option.fixed"
					:fixedNumber="option.fixedNumber"
					:full="option.full"
					:fixedBox="option.fixedBox"
					:canMove="option.canMove"
					:canMoveBox="option.canMoveBox"
					:original="option.original"
					:centerBox="option.centerBox"
					:height="option.height"
					:infoTrue="option.infoTrue"
					:maxImgSize="option.maxImgSize"
					:enlarge="option.enlarge"
					:mode="option.mode"
					@realTime="realTime"
					@imgLoad="imgLoad"
				>
				</vue-cropper>
			</div>
			<!--底部操作工具按钮-->
			<div class="footer-btn">
				<div class="scope-btn">
					<label class="btn" for="uploads">选择封面</label>
					<input
						type="file"
						id="uploads"
						style="position: absolute; clip: rect(0 0 0 0)"
						accept="image/png, image/jpeg, image/gif, image/jpg"
						@change="selectImg($event)"
					/>
					<l-botton class="l-btn l-btn-scale" type="warning" size="mini" @click="changeScale(1)">
						<i class="iconfont icon-enlarge"></i>放大
					</l-botton>
					<l-botton class="l-btn l-btn-scale" type="warning" size="mini" @click="changeScale(-1)">
						<i class="iconfont icon-narrow"></i>缩小
					</l-botton>
					<l-botton class="l-btn" type="warning" size="mini" @click="rotateLeft">
						↺ 右旋转
					</l-botton>
					<l-botton class="l-btn" type="warning" size="mini" @click="rotateRight">
						↻ 左旋转
					</l-botton>
					<div class="clip-proportion">
						裁剪比例：宽 <input class="clip-input" type="text" v-model="w" @input="handelInputW"> ：高 <input class="clip-input" type="text" v-model="h" @input="handelInputH">
					</div>
				</div>
				<div class="upload-btn">
					<l-botton type="primary" size="mini" @click="uploadImg('blob')">上传</l-botton>
				</div>
			</div>
		</div>
		<!--预览效果图-->
		<div class="show-preview">
			<div :style="previews.div" class="preview">
				<img :src="previews.url" :style="previews.img" />
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios"
import * as imageConversion from 'image-conversion';
import { VueCropper } from "vue-cropper";

import LBotton from "./botton.vue"
import LInput from "./botton.vue"

export default {
	name: "CropperImage",
	components: {
		VueCropper,
		LInput,
		LBotton
	},
	props: {
		Name: {},
		proportion: {
			type: Array
		},
		path: {
			type: String,
		}
	},
	data() {
		return {
			name: this.Name,
			previews: {},
			w: 5,
			h: 7,
			option: {
				img: "", //裁剪图片的地址
				outputSize: 1, //裁剪生成图片的质量(可选0.1 - 1)
				outputType: "jpeg", //裁剪生成图片的格式（jpeg || png || webp）
				info: true, //图片大小信息
				canScale: true, //图片是否允许滚轮缩放
				autoCrop: true, //是否默认生成截图框
				autoCropWidth: 250, //默认生成截图框宽度
				autoCropHeight: 350, //默认生成截图框高度
				fixed: true, //是否开启截图框宽高固定比例
				fixedNumber: [5, 7], //截图框的宽高比例
				full: false, //false按原比例裁切图片，不失真
				fixedBox: false, //固定截图框大小，不允许改变
				canMove: true, //上传图片是否可以移动
				canMoveBox: true, //截图框能否拖动
				original: false, //上传图片按照原始比例渲染
				centerBox: true, //截图框是否被限制在图片里面
				height: true, //是否按照设备的dpr 输出等比例图片
				infoTrue: false, //true为展示真实输出图片宽高，false展示看到的截图框宽高
				maxImgSize: 3000, //限制图片最大宽度和高度
				enlarge: 1, //图片根据截图框输出比例倍数
				// mode: "250px 350px", //图片默认渲染方式
			},
		};
	},
	methods: {
		//初始化函数
		imgLoad(msg) {
			// console.log("工具初始化函数=====" + msg);
		},
		//图片缩放
		changeScale(num) {
			num = num || 1;
			this.$refs.cropper.changeScale(num);
		},
		//向左旋转
		rotateLeft() {
			this.$refs.cropper.rotateLeft();
		},
		//向右旋转
		rotateRight() {
			this.$refs.cropper.rotateRight();
		},
		handelInputW() {
			this.option.fixedNumber[0] = this.w;
			document.querySelector('.cropper-crop-box').style.width = document.querySelector('.cropper-crop-box').offsetHeight * (this.option.fixedNumber[0] / this.option.fixedNumber[1]) + 'px'
			this.option.autoCropWidth = document.querySelector('.cropper-crop-box').offsetWidth
		},
		handelInputH() {
			this.option.fixedNumber[1] = this.h;
			document.querySelector('.cropper-crop-box').style.height = document.querySelector('.cropper-crop-box').offsetWidth * (this.option.fixedNumber[1] / this.option.fixedNumber[0]) + 'px'
			this.option.autoCropHeight = document.querySelector('.cropper-crop-box').offsetHeight
		},
		//实时预览函数
		realTime(data) {
			this.previews = data;
		},
		//选择图片
		selectImg(e) {
			let file = e.target.files[0];
			if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
				this.$modal.msgError('图片类型要求：jpeg、jpg、png');
				return false;
			}
			//转化为blob
			let reader = new FileReader();
			reader.onload = (e) => {
				let data;
				if (typeof e.target.result === "object") {
					data = window.URL.createObjectURL(
						new Blob([e.target.result])
					);
				} else {
					data = e.target.result;
				}
				this.option.img = data;
			};
			//转化为base64
			reader.readAsDataURL(file);
		},
		// 上传图片限制
		beforeAvatarUpload(file) {
      return new Promise((resolve, reject) => {
				let isLt200Kb = file.size / 1024 / 1024 < 0.2; // 判定图片大小是否小于200kb
				if (isLt200Kb) {
					resolve(file);
				}
				// console.log(file); // 压缩到200KB,这里的200就是要压缩的大小,可自定义
				imageConversion.compressAccurately(file, 200).then((res) => {
					resolve(res);
				});
			});
		},
		//上传图片
		uploadImg(type) {
			if (type === "blob") {
				//获取截图的blob数据
				this.$refs.cropper.getCropBlob(async (file) => {
					let ret =await this.beforeAvatarUpload(file);
					let data = new FormData();
					if (this.$store.state.bloggerId || this.$store.state.bloggerId === 0) {
						let path = ''
						switch (this.$store.state.bloggerId) {
							case 1:
								path = 'lf/blog'
								break

							case 2:
								path = 'lh/blog'
								break

							case 3:
								path = 'dy/blog'
								break

							default:
								path = ''
								break
						}
						if (path) {
							const pathStr = this.path ? `${path}/${this.path}` : path
							data.append("path", pathStr);
						}
					}
					data.append("data", ret, "DX.jpg");
					// 调用axios上传
					axios.post("http://api.excellentlld.com/blog/back/upload-single", data, {headers: {"Content-Type": "multipart/form-data"}})
						.then((res) => {
							if (res.status === 200) {
								this.$emit("on-success", res.data.data.url);
							}
						});
				});
			}
		},
	},
	created() {
		this.w = this.proportion[0];
		this.h = this.proportion[1];
		this.option.fixedNumber = this.proportion;
		this.option.autoCropWidth = this.option.autoCropHeight * ( this.option.fixedNumber[0] / this.option.fixedNumber[1] )
	}
};
</script>

<style scoped lang="less">
.cropper-content {
	display: flex;
	display: -webkit-flex;
	justify-content: flex-end;
	margin-top: 20px;

	.cropper-box {
		// flex: 1;
		width: 65%;
		.cropper {
			width: auto;
			height: 500px;
		}
	}

	.show-preview {
		flex: 1;
		-webkit-flex: 1;
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		.preview {
			overflow: hidden;
			border: 1px solid #67c23a;
			background: #cccccc;

			img{
				max-width: none;
			}
		}
	}
}
.footer-btn {
	margin-top: 30px;
	display: flex;
	display: -webkit-flex;
	justify-content: flex-end;
	.scope-btn {
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		padding-right: 10px;
	}
	.upload-btn {
		flex: 1;
		-webkit-flex: 1;
		display: flex;
		display: -webkit-flex;
		justify-content: center;
	}

	.l-btn{
		margin-right: 10px;
		width: 70px;
	}

	.l-btn-scale{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60px;

		.iconfont{
			margin-right: 5px;
			font-size: 12px;
		}
	}

	.clip-proportion{
		padding: 0 10px;
		line-height: 28px;
		background-color: #ddd;
		border-radius: 4px;

		.clip-input{
			border: 1px solid #ccc
		}
	}
	.btn {
		outline: none;
		display: inline-block;
		line-height: 1;
		white-space: nowrap;
		cursor: pointer;
		-webkit-appearance: none;
		text-align: center;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		outline: 0;
		-webkit-transition: 0.1s;
		transition: 0.1s;
		font-weight: 500;
		padding: 8px 15px;
		font-size: 12px;
		border-radius: 3px;
		color: #fff;
		background-color: #409eff;
		border-color: #409eff;
		margin-right: 10px;
	}

	input{
		width: 30px;
	}
}
</style>