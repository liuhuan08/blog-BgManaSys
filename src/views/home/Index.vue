<template>
	<div class="home-page">
		<h2 class="desc">
			<i class="iconfont" :class="desc.icon"></i>{{ desc.text }}
		</h2>
		<div class="card-list">
			<div class="item" v-for="v in cardList" :key="v.title">
				<i
					class="iconfont"
					:class="v.icon"
					:style="{ color: v.color }"
				></i>
				<div class="left-side">
					<div class="title">{{ v.title }}：</div>
					<div class="num">
						{{ v.num | handleNum }}<span v-if="v.num.toString().length > 3" style="font-size: 20px; line-height: 20px">+</span>
					</div>
				</div>
			</div>
		</div>

		<div ref="chartContainer" class="chart-container"></div>
	</div>
</template>

<script>
import * as echarts from "echarts";

export default {
	data() {
		return {
			cardList: [
				{
					icon: "icon-articleNum",
					title: "发表文章总数",
					num: 40,
					color: "#FF9900",
				},
				{
					icon: "icon-articleNum",
					title: "近一周发表文章数",
					num: 2,
					color: "#FF0033",
				},
				{
					icon: "icon-imgs",
					title: "图片总数",
					num: 2000,
					color: "#333399",
				},
				{
					icon: "icon-imgs",
					title: "近一周上传图片数",
					num: 30,
					color: "#663399",
				},
			],
			desc: { text: "", icon: "" },
		};
	},
	filters: {
		handleNum(val) {
			if (val.toString().length > 3) {
				return 999;
			} else {
				return val;
			}
		},
	},
	methods: {
		getDesc() {
			if (this.cardList[1].num === 0 && this.cardList[3].num === 0) {
				this.desc = {
					text: "最近有点懈怠哦，没有发表任何文章或图片...",
					icon: "icon-emjo-bad",
				};
			} else if (this.cardList[1].num <= 2 && this.cardList[3].num <= 2) {
				this.desc = {
					text: "不错，继续努力！",
					icon: "icon-emjo-nice",
				};
			} else {
				this.desc = {
					text: "哇噻，高产似母猪~(头发还好吗)",
					icon: "icon-emjo-best",
				};
			}
		},
		drawCharts() {
			var myChart = echarts.init(this.$refs.chartContainer);
			var option;

			option = {
				title: {
					text: "Stacked Line",
				},
				tooltip: {
					trigger: "axis",
				},
				legend: {
					data: [
						"Email",
						"Union Ads",
						"Video Ads",
						"Direct",
						"Search Engine",
					],
				},
				grid: {
					left: "3%",
					right: "4%",
					bottom: "3%",
					containLabel: true,
				},
				toolbox: {
					feature: {
						saveAsImage: {},
					},
				},
				xAxis: {
					type: "category",
					boundaryGap: false,
					data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				},
				yAxis: {
					type: "value",
				},
				series: [
					{
						name: "Email",
						type: "line",
						stack: "Total",
						data: [120, 132, 101, 134, 90, 230, 210],
					},
					{
						name: "Union Ads",
						type: "line",
						stack: "Total",
						data: [220, 182, 191, 234, 290, 330, 310],
					}
				],
			};

			option && myChart.setOption(option);
		},
	},
	created() {
		this.getDesc();
	},
    mounted() {
        this.drawCharts();
    }
};
</script>

<style lang="less" scoped>
.home-page {
	padding: 20px 10px;
	width: 100%;
	height: 100%;
	background-color: #fff;

	.desc {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
		text-indent: 10px;

		.iconfont {
			font-size: 20px;
			color: #ff6666;
		}
	}

	.card-list {
		display: flex;
		justify-content: space-around;

		.item {
			display: flex;
			align-items: center;
			padding: 20px;
			width: 22%;
			height: 100px;
			background-color: #99ccff;
			border-radius: 20px;

			.iconfont {
				font-size: 40px;
				margin-right: 20px;
			}

			.left-side {
				flex: 1;
				display: flex;
				align-items: end;

				.title {
					margin-bottom: 10px;
					line-height: 14px;
				}

				.num {
					font-size: 60px;
					line-height: 60px;
					color: #006600;
				}
			}
		}
	}

    .chart-container{
        width: 100%;
        height: 600px;
        margin-top: 20px;
    }
}
</style>