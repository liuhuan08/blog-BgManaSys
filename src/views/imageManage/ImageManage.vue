<template>
	<div class="album-page">
		<div class="title">相册列表</div>
		<ul class="list">
			<li v-for="v in albumsList" :key="v.id" class="item">
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
								@click="handelEdit(v.id)"
							>
								编辑相册
							</l-botton>
							<l-botton
								type="primary"
								size="mini"
								@click="handelEdit(v.id)"
							>
								进入相册
							</l-botton>
						</div>
					</transition>
				</div>
				<div class="album-name">
					{{ v.albumName }}
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
</template>

<script>
import { getAlbumsList } from "../../api/albums";
import local from "@/utils/local";
import { normalizeDate, normalizeTime } from "../../utils/tools";

import LInput from "@/components/input.vue";
import LBotton from "@/components/botton.vue";

export default {
	data() {
		return {
			albumsList: [],
		};
	},
	components: {
		LInput,
		LBotton,
	},
	methods: {
		getAlbum() {
			let bloggerId = local.get("blog_userinfo").bloggerId;
			getAlbumsList(bloggerId).then((res) => {
				if (res.status === 200) {
					this.albumsList = [...res.data.data.records];
					this.albumsList.forEach((v, i) => {
						this.$set(this.albumsList[i], "showInfo", false);
						this.$set(this.albumsList[i], "showOperation", false);
					});
					console.log(this.albumsList);
				}
			});
		},
		handelEdit() {},
	},
	filters: {
		handelData(val) {
			return normalizeDate(val, "-") + " " + normalizeTime(val);
		},
	},
	created() {
		this.getAlbum();
	},
};
</script>

<style lang="less" scoped>
.album-page {
	padding: 20px;
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

	.list {
		display: flex;
		flex-wrap: wrap;

		.item {
			margin: 5px;

			.img-wrap {
				position: relative;
				padding: 5px;
				margin-bottom: 10px;
				width: 150px;
				height: 180px;
				background-color: #fff;
				box-shadow: 5px 5px 4px #333;
				border: 1px solid #ddd;
				transition: all 2s linear;

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

.fade-leave-active,
.fade-enter-active {
	transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>