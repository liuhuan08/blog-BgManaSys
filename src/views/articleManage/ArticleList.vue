<template>
	<div class="article-list-page">
		<div class="search-section">
			<l-input
				class="search-ipt"
				v-model="articleName"
				:ipt-value="articleName"
				type="text"
				placeholder="请输入文章标题"
				clearable
			>
			</l-input>
			<l-botton
				type="primary"
				size="midle"
				@click="handelSearch"
				style="margin-right: 10px"
			>
				搜索
			</l-botton>
		</div>

		<div class="table-section">
			<div class="thead">
				<div class="td-num">序号</div>
				<div class="td-title">文章标题</div>
				<div class="td-subtitle">文章副标题</div>
				<div class="td-img">文章封面</div>
				<div class="td-time">
					创建时间
					<div class="item">
						<i
							class="iconfont icon-triangle icon-triangle-up"
							:class="sortType === 1 ? 'active' : ''"
							@click.stop="sortByTimeUp"
						></i>
						<i
							class="iconfont icon-triangle"
							:class="sortType === 2 ? 'active' : ''"
							@click.stop="sortByTimeDown"
						></i>
					</div>
				</div>
				<div class="td-time">修改时间</div>
				<div class="td-btn">操作</div>
			</div>
			<div class="tbody" :class="showBorder ? 'showBorder' : ''" ref="tbody">
				<div v-for="v in tableData" :key="v.article_id" class="tr">
					<div class="td-num">{{ v.article_id }}</div>
					<div class="td-title">{{ v.title }}</div>
					<div class="td-subtitle">{{ v.subTitle }}</div>
					<div class="td-img">
						<img :src="v.coverUrl" referrerPolicy="no-referrer" />
					</div>
					<div class="td-time">{{ v.createTime | handelData }}</div>
					<div class="td-time">{{ v.updateTime | handelData }}</div>
					<div class="td-btn">
						<div class="btn-group">
							<l-botton
								class="btn"
								type="primary"
								size="mini"
								@click="handelEdit(v.article_id)"
								style="margin-right: 10px"
							>
								编辑
							</l-botton>
							<l-botton
								class="btn"
								type="danger"
								size="mini"
								@click="handelDel(v.article_id)"
							>
								删除
							</l-botton>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="page-section">
			<l-pagination
				:total="total"
				:size="pageSize"
				@size-change="handelSizeChange"
				:sizeArr="[10, 20, 30, 40, 50]"
				@current-change="handelCurrentChange"
				:current-page="currentPage"
				layout="total, sizes, jumper"
			></l-pagination>
		</div>
	</div>
</template>

<script>
import { getArticleList, delArticle } from "@/api/article";
import local from "@/utils/local";
import { normalizeDate, normalizeTime } from "../../utils/tools";

import LInput from "@/components/input.vue";
import LBotton from "@/components/botton.vue";
import LPagination from "@/components/pagination.vue";

export default {
	data() {
		return {
			articleName: "",
			total: 0,
			pageSize: 10,
			currentPage: 1,
			sortType: 1,
			tableData: [],
			showBorder: false
		};
	},
	components: {
		LInput,
		LBotton,
		LPagination,
	},
	methods: {
		getData() {
			let bloggerId = local.get("blog_userinfo").bloggerId;
			let data = {
				bloggerId,
				limit: this.pageSize,
				page: this.currentPage,
				articleTitle: "",
				sortType: this.sortType,
			};
			getArticleList(data).then((res) => {
				if (res.status === 200) {
					this.tableData = res.data.data.records;
					this.total = res.data.data.total;

					this.handelResize();
				}
			});
		},
		handelSearch() {},
		// 按时间排序
		sortByTimeUp() {
			this.sortType = 1;
			this.getData();
		},
		sortByTimeDown() {
			this.sortType = 2;
			this.getData();
		},
		handelEdit(id) {
			console.log(id);
			this.$router.push({
				path: "/article/add_modify-article",
				query: {
					id: id,
				},
			});
		},
		handelDel(id) {
			delArticle(id).then((res) => {
				if (res.status === 200) {
					this.Msg(res.data.message, "success", 1500);
					this.getData();
				}
			});
		},
		handelSizeChange(val) {
			this.pageSize = val;
            this.getData();
		},
		handelCurrentChange(val) {
			this.currentPage = val;
            this.getData();
		},
		handelResize() {
			this.$nextTick(() => {
				let h = 0;
				let len = document.querySelectorAll('.tbody .tr').length;
				for(let i = 0; i < len; i ++) {
					h += document.querySelectorAll('.tbody .tr')[i].offsetHeight;
				};
				if(h < this.$refs.tbody.offsetHeight) {
					this.showBorder = true;
				}else {
					this.showBorder = false;
				}
			})
		}
	},
	filters: {
		handelData(val) {
			return normalizeDate(val, "-") + " " + normalizeTime(val);
		},
	},
	created() {
		this.getData();
	},
};
</script>

<style lang="less" scoped>
.article-list-page {
	padding: 20px;
	width: 100%;
	height: 100%;
	background-color: #fff;

	.search-section {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 20px;
		border-bottom: 1px dashed #ccc;

		.search-ipt {
			width: 300px;
		}
	}

	.table-section {
		margin-top: 20px;
		width: 100%;
		height: calc(~"100% - 82px - 20px - 50px");
		border: 1px solid #ebeef5;

		.thead {
			display: flex;
			width: 100%;
			height: 42px;

			.td-time {
				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					height: 100%;
					border: 0;
					user-select: none;
					cursor: pointer;

					.icon-triangle {
						width: 12px;
						height: 12px;
						font-size: 12px;
						line-height: 12px;
						transform: scale(0.8);
						transform-origin: center;
						color: #999;
					}

					.icon-triangle-up {
						width: 12px;
						height: 12px;
						font-size: 12px;
						line-height: 12px;
						transform: rotateZ(180deg) scale(0.8);
						transform-origin: center;
						color: #999;
					}

					.icon-triangle.active {
						color: #409eff;
					}
				}
			}
		}

		.tbody .tr,
		.thead {
			width: 100%;
			display: flex;

			div {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 10px;
				text-align: center;
				border-bottom: 1px solid #ebeef5;
			}

			.td-num {
				width: 80px;
				border-right: 1px solid #ebeef5;
			}

			.td-title {
				width: 180px;
				border-right: 1px solid #ebeef5;
			}

			.td-subtitle {
				flex: 1;
				border-right: 1px solid #ebeef5;
			}

			.td-img {
				width: 180px;
				border-right: 1px solid #ebeef5;

				img {
					width: 100%;
				}
			}

			.td-time {
				width: 180px;
				border-right: 1px solid #ebeef5;
			}

			.td-btn {
				width: 150px;
				.btn-group {
					display: flex;
					justify-content: center;
					align-items: center;
					height: 100%;
					border: 0;

					.btn {
						width: 50px;
					}
				}
			}
		}

		.thead .td-btn {
			width: 156px;
		}

		.tbody .tr:last-child div {
			border-bottom: 0;
		}

		.showBorder .tr:last-child div {
			border-bottom: 1px solid #ebeef5;
		}

		.tbody .tr:nth-child(2n) {
			background-color: #fafafa;
		}

		.tbody .tr:hover {
			background-color: #f5f7fa;
		}

		.tbody {
			height: calc(~"100% - 42px");
			overflow-y: scroll;

			&::-webkit-scrollbar {
				width: 6px;
			}

			&::-webkit-scrollbar-thumb {
				border-radius: 6px;
				background: #aaa;
			}

			&::-webkit-scrollbar-track {
				border-radius: 0;
				background: #ddd;
			}
		}
	}

	.page-section {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-top: 20px;
		width: 100%;

		div {
			padding: 5px 10px;
			margin-left: 10px;
		}

		.item {
			background-color: #eee;
			border-radius: 4px;
			cursor: pointer;
			user-select: none;
		}
	}
}
</style>