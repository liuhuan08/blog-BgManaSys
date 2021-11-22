<template>
	<div class="header">
		<div class="top">
			<div class="icon-group">
				<i
					class="iconfont icon-open"
					@click="$store.state.isCollapse = !$store.state.isCollapse"
					v-if="$store.state.isCollapse"
				></i>
				<i
					class="iconfont icon-close"
					@click="$store.state.isCollapse = !$store.state.isCollapse"
					v-else
				></i>
			</div>
			<div class="title">
				<span>{{ titleTime[titleTimeIndex] }}</span>
				<span>{{ title }}</span>
			</div>
			<div class="user">
				<img :src="avatar" />
				<div class="user-item" @click="isShow = !isShow">
					欢迎您，<span class="user-item">{{ name }}</span>
				</div>
				<transition name="fade">
					<div class="top-sel" v-if="isShow">
						<p class="item" @click="logout">退出登录</p>
					</div>
				</transition>
			</div>
		</div>

		<div class="card-list">
			<div v-for="(v, i) in cardList" :key="i" class="item">
				<transition name="fade">
					<div class="circle" v-if="isActive === i"></div>
				</transition>
				<router-link :to="v.path">
					<span :class="isActive === i ? 'active' : ''">{{ v.title }}</span>
				</router-link>
				<i class="iconfont icon-closeCard" v-if="v.title !== '首页'" @click="handleClose(i)"></i>
			</div>
		</div>
	</div>
</template>

<script>
import local from "@/utils/local";

export default {
	data() {
		return {
			name: "",
			avatar: "",
			titleTime: ["早上好，", "下午好，", "晚上好，"],
			titleTimeIndex: 0,
			title: "",
			isShow: false,
			cardList: [],
			isActive: 0,
		};
	},
	methods: {
		getData() {
			this.name = local.get("blog_userinfo").name;
			this.avatar = local.get("blog_userinfo").avatar;
			this.$EventBus.$on('changeAvatar', (data) => {
				this.avatar = data;
			})
		},
		showTitle() {
			let titleList = [
				"中午吃点什么呢？",
				"喝杯咖啡休息下吧！",
				"摸会鱼~~~",
				"又在写bug吗？",
				"注意保护眼睛哦~",
				"晚上开黑吗？",
				"晚上去看电影吧。",
				"摸会鱼~~~",
				"又在写bug吗？",
				"注意保护眼睛哦~",
				"今天又写了多少bug？",
				"今天的目标完成了吗？",
				"周末出去玩吗？",
				"注意保护眼睛哦~",
				"早点休息吧！",
			];
			let time = new Date().getHours();
			if (time >= 6 && time < 12) {
				this.titleTimeIndex = 0;
				let i = Math.floor(Math.random() * (4 - 0 + 1) + 0);
				this.title = titleList[i];
			} else if (time >= 12 && time < 18) {
				this.titleTimeIndex = 1;
				let i = Math.floor(Math.random() * (5 - 11 + 1) + 11);
				this.title = titleList[i];
			} else {
				this.titleTimeIndex = 2;
				let i = Math.floor(Math.random() * (9 - 14 + 1) + 14);
				this.title = titleList[i];
			}
		},
		toggleShow() {
			document.addEventListener("click", (e) => {
				if (!e.target.className.includes("user-item")) {
					this.isShow = false;
				}
			});
		},
		// 第一次加载时初始化卡片列表
		initCardList() {
			let list = local.get("cardList");
			if (!list) list = [{ path: "/home", title: "首页" }];
			this.cardList = list;
		},
		// 添加卡片
		addCard() {
			let list = local.get("cardList");
			if (!list) list = [{ path: "/home", title: "首页" }];
			if (this.$route.meta.title) {
				let flag = true;
				list.forEach((v) => {
					if (this.$route.meta.title === v.title) {
						flag = false;
					}
				});
				if (!flag) return;
				list.push(this.$route.meta);
				local.set("cardList", list);
			}
			this.cardList = list;
		},
		// 控制卡片激活效果
		changeActive() {
			let nowActive = local.get("nowActive");
			if (!nowActive) nowActive = 0;
			if (this.$route.path === "/home") {
				nowActive = 0;
			} else {
				nowActive = this.cardList.findIndex(
					(v) => v.title === this.$route.meta.title
				);
			}
			local.set("nowActive", nowActive);
			this.isActive = nowActive;
		},
		// 关闭卡片
		handleClose(i) {
			let list = local.get("cardList");
			if (!list) list = [{ path: "/home", title: "首页" }];
			if (this.isActive === i) {
				this.$router.push({ path: list[i - 1].path });
			} else if (this.isActive > i) {
				this.isActive = this.isActive - 1;
				local.set("nowActive", this.isActive);
			}
			list.splice(i, 1);
			local.set("cardList", list);
			this.cardList = list;
		},
		logout() {
			local.clear();
			this.Msg('成功退出 ~', 'success', 2000)
			setTimeout(() => {
				this.$router.push({ path: '/login' });
			}, 500)
		}
	},
	watch: {
		$route() {
			this.addCard();
			this.changeActive();
		},
	},
	created() {
		this.getData();
		this.showTitle();
		this.initCardList();
		this.changeActive();
	},
	mounted() {
		this.toggleShow();
	},
};
</script>

<style lang="less" scoped>
.header {
	.top {
		display: flex;
		align-items: center;
		padding: 20px;
		height: 60px;
		border-bottom: 1px solid #eee;

		.icon-group {
			.iconfont {
				font-size: 26px;
				line-height: 26px;
				cursor: pointer;
			}
		}

		.title {
			flex: 1;
			margin-left: 50px;
			font-size: 16px;
		}

		.user {
			display: flex;
			align-items: center;
			position: relative;
			font-size: 16px;
			line-height: 16px;
			cursor: pointer;

			img {
				margin-right: 20px;
				width: 40px;
				height: 40px;
				border-radius: 50%;
				overflow: hidden;
			}

			.top-sel {
				position: absolute;
				bottom: -50px;
				right: 0px;
				padding: 10px 0;
				font-size: 14px;
				background-color: #fff;
				border: 1px solid #eee;
				border-radius: 6px;
				box-shadow: 0px 2px 2px #efefef;

				.item {
					padding: 5px 20px;
					cursor: pointer;
					transition: all 2s linear;
				}

				.item:hover {
					color: #0099cc;
					background-color: #eee;
				}
			}

			.top-sel::before {
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
		}
	}

	.card-list {
		display: flex;
		line-height: 40px;
		background-color: #fff;
		border-bottom: 1px solid #ccc;

		a {
			color: #000;
		}

		.item {
			position: relative;
			padding: 0 30px;
			border-right: 1px solid #eee;
			cursor: pointer;

			.circle {
				position: absolute;
				top: 50%;
				left: 16px;
				transform: translateY(-50%);
				width: 6px;
				height: 6px;
				border-radius: 50%;
				background-color: #85ef47;
			}

			.icon-closeCard {
				position: absolute;
				top: 50%;
				right: 10px;
				transform: translateY(-50%);
				font-size: 14px;
				color: #ccc;
				opacity: 0;
				transition: all 0.3s;
			}
		}

		.active {
			color: #85ef47;
		}

		.item:hover .icon-closeCard {
			opacity: 1;
		}
	}
}

.fade-leave-active,
.fade-enter-active {
	transition: all 0.3s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>