<template>
	<div class="imgs-page">
		<div class="top">
			<span class="title">{{ title }}</span>
			<div>
				<label class="check-wrap"
					>全选<input
						type="checkbox"
						:checked="checkall"
						class="checkall"
						@click="checkAll"
				/></label>
				<l-popconfirm @confirm="handelDelChecked" :title="'确认删除这些图片吗？'">
					<l-botton
						slot="reference"
						style="width: 60px"
						type="danger"
						size="mini"
					>
						删除
					</l-botton>
				</l-popconfirm>
				<l-botton
					style="margin-left: 10px"
					type="primary"
					size="mini"
					@click="handelAddImg"
				>
					上传新图片
				</l-botton>
			</div>
		</div>
		<ul class="list" ref="imgsListDom" @mousewheel="initImgsList">
            <li v-if="imgsList.length === 0">这个相册是空的！</li>
			<li class="item" v-for="(v, i) in imgsList" :key="v.id">
				<img :src="v.url" @click="showBigImg(v.url, i)" referrerPolicy="no-referrer" />
				<!-- <p class="info">创建时间：{{v.createTime | handelData}}</p> -->
				<div class="del-wrap" @click="handelRemove(v.id)">
					<i class="iconfont icon-remove"></i>
				</div>
				<input
					type="checkbox"
					class="checkbox"
					:checked="v.checkone"
					@click="checkOne(v.id)"
				/>
			</li>
		</ul>

		<div class="bigimg-dialog" v-if="isShowBigImg" @click.self="handelCloseBigImg">
			<i class="iconfont icon-error" title="关闭" @click.self="handelCloseBigImg"></i>
			<i class="iconfont icon-left" title="上一张" @click="toPre"></i>
			<div class="wrap">
				<img :src="bigimgUrl">
			</div>
			<i class="iconfont icon-right" title="下一张" @click="toNext"></i>
		</div>

		<div class="dialog" v-if="dialogVisible">
			<i class="iconfont icon-closeCard" @click="handelClose"></i>
			<div class="title">新增图片</div>
			<div class="item">
				<div class="label">上传图片</div>
				<l-upload-image
					:src="[]"
					:multiple="true"
					action="http://api.excellentlld.com/blog/back/upload-image"
					@on-success="handleAvatarSuccess"
					@on-remove="handleAvatarRemove"
					:before-upload="beforeAvatarUpload"
				></l-upload-image>
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

		<div class="dialog-tips" v-if="dialogTipsVisible">
			<span v-if="showCircle" class="circle circle-side"></span>
			<span v-if="showCircle" class="circle circle-center"></span>
			<span v-if="showCircle" class="circle circle-side"></span>
			<p v-else>我是有底线的~~~</p>
		</div>
	</div>
</template>

<script>
import * as imageConversion from 'image-conversion';

import { getAlbumImgs, albumAddImgs, albumDelImgs } from "@/api/albums";

import { normalizeDate, normalizeTime } from "@/utils/tools";

import LBotton from "@/components/botton.vue";
import LUploadImage from "@/components/uploadImage.vue";
import LPopconfirm from "@/components/popconfirm.vue"

export default {
	data() {
		return {
			title: "",
			imgsList: [],
			imgsTotal: 0,
			bigimgUrl: '',
			bigimgUrlIndex: 0,
			isShowBigImg: false,
			page: 1,
			size: 10,
			total: 0,
			checkedList: [],
			checkall: false,
			dialogVisible: false,
			dialogTipsVisible: false,
			showCircle: true,
			newImgs: [],
			showOne: true,
			timer: null,
			timer2: null,
			timer3: null
		};
	},
	components: {
		LBotton,
		LUploadImage,
		LPopconfirm
	},
	methods: {
		// 获取图片列表
		getImgs() {
			let id = this.$route.query.albumId;
			getAlbumImgs({ albumId: id, page: this.page, size: this.size }).then((res) => {
				if (res.status === 200) {
					if(this.total === res.data.data.total) {
						this.showCircle = false;
						setTimeout(() => {
							this.dialogTipsVisible = false;
							clearInterval(this.timer2);
							this.timer2 = null;
						}, 500)
						return;
					};
					this.showCircle = true;
					this.total = res.data.data.records.length;
					this.imgsList = [...res.data.data.records];
					this.imgsList.forEach((v, i) => {
						this.$set(this.imgsList[i], "checkone", false);
					});
					this.imgsTotal = res.data.data.total;

					this.$nextTick(() => {
						this.fall();
						setTimeout(() => {
							this.dialogTipsVisible = false;
							clearInterval(this.timer2);
							this.timer2 = null;
						}, 500)
					})
				}
			});
		},
		// 初始化滚动条
		initImgsList(e) {
			if(e.deltaY > 0) {
				this.$nextTick(() => {
					if(this.timer3) clearTimeout(this.timer3);
					this.timer3 = setTimeout(() => {
						let scrollHeight = this.$refs.imgsListDom.scrollHeight;
						let height = this.$refs.imgsListDom.offsetHeight;
						if(scrollHeight <= height) {
							this.size += 10;
							this.getImgs();
						}
					}, 200)
				})
			};
		},
		// 监听滚动，加载更多
		handelScroll() {
			let scrollHeight = this.$refs.imgsListDom.scrollHeight;
			let height = this.$refs.imgsListDom.offsetHeight;
			let scrollTop = this.$refs.imgsListDom.scrollTop;
			if((height + scrollTop) === scrollHeight) {
				this.changShow();
				this.size += 20;
				this.getImgs();
			}
		},
		// 点击显示大图
		showBigImg(url, index) {
			this.bigimgUrl = url;
			this.bigimgUrlIndex = index;
			this.isShowBigImg = true;
		},
		// 上一张
		toPre() {
			if(this.bigimgUrlIndex === 0) {
				this.Msg('已经是第一张了哦~~~', 'warning', 2000);			
			} else {
				this.bigimgUrlIndex --;
				this.bigimgUrl = this.imgsList[this.bigimgUrlIndex].url;
			}
		},
		// 下一张
		toNext() {
			if(this.bigimgUrlIndex === (this.imgsList.length - 1)) {
				this.Msg('已经是最后一张了哦~~~', 'warning', 2000);			
			} else {
				this.bigimgUrlIndex ++;
				this.bigimgUrl = this.imgsList[this.bigimgUrlIndex].url;
			}
		},
		// 关闭大图
		handelCloseBigImg() {
			this.bigimgUrl = '';
			this.isShowBigImg = false;
		},
		// 添加图片
		handelAddImg() {
			this.dialogVisible = true;
		},
		// 上传图片成功
		handleAvatarSuccess(data) {
			this.newImgs = data;
		},
		handleAvatarRemove(data) {
			this.newImgs.splice(data, 1);
		},
		// 上传图片限制
		beforeAvatarUpload(file) {
			const isJPG = file.type === "image/jpeg";

			if (!isJPG) {
				this.Msg("上传头像图片只能是 JPG 格式!", "error", 2000);
				return isJPG
			}else {
				return new Promise((resolve, reject) => {
					let isLt200KB = file.size / 1024 / 1024 < 0.2; // 判定图片大小是否小于200KB
					if (isLt200KB) {
						resolve(file);
					}
					// console.log(file); // 压缩到200KB,这里的200就是要压缩的大小,可自定义
					imageConversion.compressAccurately(file, 200).then((res) => {
						resolve(res);
					});
				});
			}
		},
		// 确认
		handelConfirm() {
			let albumId = this.$route.query.albumId;
			let sendData = {
				albumId,
				imgList: this.newImgs,
			};
			albumAddImgs(sendData).then((res) => {
				if (res.status === 200) {
					this.Msg("新增相册图片成功！", "success", 1500);
					this.newImgs = [];
					this.dialogVisible = false;
					this.getImgs();
				}
			});
		},
		// 关闭dialog
		handelClose() {
			this.newImgs = [];
			this.dialogVisible = false;
		},
		// 单个删除
		handelRemove(id) {
			albumDelImgs({ deleteIds: [id] }).then((res) => {
				if (res.status === 200) {
					this.Msg("删除成功~", "success", 1500);
					this.getImgs();
				}
			});
		},
		// 全选
		checkAll() {
			if (this.checkall) {
				this.checkall = false;
				this.checkedList = [];
				this.imgsList.forEach((v, i) => {
					this.$set(this.imgsList[i], "checkone", false);
				});
			} else {
				this.checkall = true;
				this.checkedList = this.imgsList.map((v) => {
					return v.id;
				});
				this.imgsList.forEach((v, i) => {
					this.$set(this.imgsList[i], "checkone", true);
				});
			}
		},
		// 单选
		checkOne(id) {
			if (this.checkedList.indexOf(id) === -1) {
				this.checkedList.push(id);
			} else {
				this.checkedList.splice(this.checkedList.indexOf(id), 1);
				this.checkall = false;
			}
			if (this.checkedList.length === this.imgsList.length) {
				this.checkall = true;
			} else {
				this.checkall = false;
			}
		},
		// 删除选中
		handelDelChecked() {
			if (this.checkedList.length === 0) {
				this.Msg("请先选中要删除的图片~", "warning", 1500);
			} else {
				albumDelImgs({ deleteIds: this.checkedList }).then((res) => {
					if (res.status === 200) {
						this.Msg("删除成功~", "success", 1500);
						this.getImgs();
					}
				});
			}
		},
		// 计算瀑布流布局
		fall() {
			if(this.timer) clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				const minGap = 15; // 最小间距，让每一列的最小空隙可以自定义，避免太过拥挤的情况发生。但是，会通过计算得到真实的间距。
				const itemWidth = 200; // 每一项的宽度，即当前每一个图片容器的宽度。保证每一列都是等宽不等高的。
				const scrollBarWidth = 10; // 获取滚动条的宽度
				const pageWidth = document.querySelector('.list').offsetWidth - scrollBarWidth; // 获取当前页面的宽度
				const column = Math.floor(pageWidth / (itemWidth + minGap)); // 实际列数=页面宽度/(图片宽度+最小间距)
				const gap = (pageWidth - itemWidth * column) / (column-1); // 计算真实间距 = (页面宽度- 图片宽度*实际列数)/实际列数/2
				const items = document.querySelectorAll(".list .item"); // 获取所有的外层元素
				const heightArr = []; // 定义一个空数组，保存最低高度。
	
				for (let i = 0; i < items.length; i++) {
					// 遍历所有的外层容器
					const height = items[i].offsetHeight;
					// console.log(height);
					// 如果当前处在第一行
					if (i < column) {
						// 直接设置元素距离上部的位置和距离左边的距离。
						items[i].style.cssText = `top: 0px;left: ${(itemWidth + gap) * i}px`;
						// 保存当前元素的高度。
						heightArr.push(height);
					} else {
						// 不是第一行的话，就进行比对。
						let minHeight = heightArr[0]; // 先保存第一项的高度
						let minIndex = 0; // 保存第一项的索引值
						for (let j = 0; j < heightArr.length; j++) {
							// 通过循环遍历比对，拿到最小值和最小值的索引。
							if (minHeight > heightArr[j]) {
								minHeight = heightArr[j];
								minIndex = j;
							}
						}
						// 通过最小值为当前元素设置top值，通过索引为当前元素设置left值。
						items[i].style.cssText = `top: ${minHeight + 20}px; left: ${(itemWidth + gap) * minIndex}px`;
						// 并修改当前索引的高度为当前元素的高度
						heightArr[minIndex] = minHeight + gap + height;
					}
				};
			}, 100)
		},
		// 控制加载中效果
		changShow() {
			this.dialogTipsVisible = true;
			if(this.timer2) clearInterval(this.timer2);
			if(!this.showCircle) return;
			this.timer2 = setInterval(() => {
				this.showOne = !this.showOne;
				let circleSide = document.querySelectorAll('.circle-side');
				if(this.showOne) {
					for(let i = 0; i < circleSide.length; i ++) {
						circleSide[i].style.opacity = 0;
						circleSide[i].style.width = "12px";
						circleSide[i].style.height = "12px";
					};
					document.querySelector('.circle-center').style.opacity = 1;
				}else {
					for(let i = 0; i < circleSide.length; i ++) {
						circleSide[i].style.opacity = 1;
						circleSide[i].style.width = "8px";
						circleSide[i].style.height = "8px";
					};
					document.querySelector('.circle-center').style.opacity = 0;
				};
			}, 150);
		}
	},
	filters: {
		// 格式化时间
		handelData(val) {
			return normalizeDate(val, "-") + " " + normalizeTime(val);
		},
	},
	created() {
		this.title = this.$route.query.albumName;
		this.getImgs();
	},
	mounted() {
		window.addEventListener('resize', this.fall);
		this.$refs.imgsListDom.addEventListener('scroll', this.handelScroll)
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.fall);
	}
};
</script>

<style lang="less" scoped>
.imgs-page {
	position: relative;
	padding: 20px;
	width: 100%;
	height: 100%;
	background-color: #fff;

	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
		border-bottom: 1px dashed #ccc;

		.title {
			font-size: 20px;
			text-indent: 20px;
			line-height: 60px;
		}

		.check-wrap {
			cursor: pointer;

			.checkall {
				margin: 0 20px 2px 5px;
				cursor: pointer;
			}
		}
	}

	.list {
		position: relative;
		width: 100%;
		height: calc(~"100% - 81px");
		overflow-y: scroll;

		&::-webkit-scrollbar {
			width: 6px;
		}
		&::-webkit-scrollbar-thumb {
			border-radius: 6px;
			background: #ddd;
		}
		&::-webkit-scrollbar-track {
			border-radius: 0;
			background: #fff;
		}

		.item {
			position: absolute;
			width: 200px;
			border: 1px solid #eee;
			cursor: pointer;

			// .info{
			//     position: absolute;
			//     bottom: 0;
			//     left: 0;
			//     padding: 5px;
			//     width: 100%;
			//     background-color: rgba(255, 255, 255, .3);
			// }
			.img{
				width: 100%;
			}

			.del-wrap {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 0;
				color: #000;
				background-color: rgba(255, 255, 255, 0.3);
				overflow: hidden;
				transition: all 0.2s linear;

				.icon-remove {
					font-size: 18px;
				}
			}

			.checkbox {
				position: absolute;
				top: 5px;
				left: 5px;
				cursor: pointer;
			}

			&:hover .del-wrap {
				height: 20%;
			}
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
	width: 800px;
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
		margin-bottom: 20px;
		font-size: 20px;
		line-height: 60px;
		text-indent: 0;
		border-bottom: 1px dashed #ccc;
	}

	.item {
		display: flex;
		margin-top: 20px;

		.label {
			width: 100px;
		}

		.ipt {
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

.dialog-tips{
	position: absolute;
	bottom: 0;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 30px;
	background-color: rgba(0, 0, 0, .2);

	.circle{
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: #666;
		transition: all .5 linear;
	}

	.circle-center{
		width: 12px;
		height: 12px;
		margin: 0 10px;
	}
}

.bigimg-dialog{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, .5);

	.icon-error{
		position: absolute;
		top: 10px;
		right: 10px;
		font-size: 20px;
		color: #fff;
		cursor: pointer;
	}

	.icon-left, .icon-right{
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 40px;
		height: 40px;
		font-size: 20px;
		text-align: center;
		line-height: 40px;
		color: #fff;
		background-color: #999;
		border-radius: 50%;
		cursor: pointer;
	}

	.icon-left{
		left: 20px;
	}

	.icon-right{
		right: 20px;
	}

	.wrap{
		margin: 50px auto;
		width: 80%;
		height: 80%;
		text-align: center;

		img{
			height: 100%;
		}
	}
}
</style>