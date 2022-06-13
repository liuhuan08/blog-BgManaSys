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
import { getNumData } from "@/api/user";
import local from "@/utils/local" 

export default {
	data() {
		return {
			cardList: [
				{
					icon: "icon-articleNum",
					title: "发表文章总数",
					num: 0,
					color: "#FF9900",
				},
				{
					icon: "icon-articleNum",
					title: "近一周发表文章数",
					num: 0,
					color: "#FF0033",
				},
				{
					icon: "icon-imgs",
					title: "图片总数",
					num: 0,
					color: "#333399",
				},
				{
					icon: "icon-imgs",
					title: "近一周上传图片数",
					num: 0,
					color: "#663399",
				},
			],
			desc: { text: "", icon: "" },
			articleData: [0, 0, 0, 0, 0, 0, 0],
            imgsData: [0, 0, 0, 0, 0, 0, 0],
            dateArr: [],
			chart: null,
			timer: null
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
    getData() {
			let today = new Date().getTime()
      for(let i = 0; i < 7; i++) {
          let month = (new Date(today - i*24*60*60*1000).getMonth() + 1);
          let day = (new Date(today - i*24*60*60*1000).getDate()) < 10 ? ('0' + (new Date(today - i*24*60*60*1000).getDate())) : new Date(today - i*24*60*60*1000).getDate();
          let date = month + '-' + day
          this.dateArr.unshift(date)
      }

			if (local.get('blog_userinfo')) {
				let bloggerId = local.get('blog_userinfo').bloggerId
				getNumData(bloggerId).then(res => {
					if(res.status === 200) {
						let data = res.data.data;
						
						this.cardList[0].num = data.articles.total;
						this.cardList[1].num = data.articles.recently;
						this.cardList[2].num = data.albumImages.total;
						this.cardList[3].num = data.albumImages.recently;
	
						for(let key in data.albumImages.recentList) {
							if(this.dateArr.indexOf(key) !== -1) {
								this.$set(this.imgsData, this.dateArr.indexOf(key), data.albumImages.recentList[key]);
							}
						}
						for(let key in data.articles.recentList) {
							if(this.dateArr.indexOf(key) !== -1) {
								this.$set(this.articleData, this.dateArr.indexOf(key), data.articles.recentList[key]);
							}
						};
						this.getDesc();
						this.drawCharts();
					}
				})
			} else {
				this.$alert('登录信息已失效，请重新登录！', '系统提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$store.dispatch('FedLogOut')
            }
        });
			}
    },
		drawCharts() {
			this.chart = echarts.init(this.$refs.chartContainer);
			var option;

			option = {
				title: {
					text: "近一周发表情况",
                    left: 20
				},
				tooltip: {
					trigger: "axis",
				},
				legend: {
					data: [
						"文章数",
						"图片数",
					],
				},
                color: [
                    "#FF0033",
                    "#663399"
                ],
				grid: {
					left: "3%",
					right: "4%",
					bottom: "3%",
					containLabel: true,
				},
				xAxis: {
					type: "category",
					boundaryGap: true,
					data: this.dateArr,
				},
				yAxis: {
					type: "value",
				},
				series: [
					{
						name: "文章数",
						type: "line",
						stack: "Total",
						data: this.articleData,
					},
					{
						name: "图片数",
						type: "line",
						stack: "Total",
						data: this.imgsData,
					}
				],
			};

			option && this.chart.setOption(option);
		},
		handelResize() {
			if(this.timer) clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.chart.resize()
			}, 100)
		}
	},
	created() {
		this.getDesc();
        this.getData()
	},
    mounted() {
        this.drawCharts();
		window.addEventListener('resize', this.handelResize)
    },
	beforeDestroy() {
		window.removeEventListener('resize', this.handelResize)
	}
};
</script>

<style lang="less" scoped>
.home-page {
	padding: 20px 10px;
	width: 100%;
	height: 100%;
	background-color: rgba(255, 255, 255, .5);

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