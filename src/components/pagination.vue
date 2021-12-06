<template>
	<div class="pagination-page">
		<div class="total" v-if="hasTotal">共 {{ total }} 条</div>
		<div class="size pagination_click_lh_toggleShow_ttt" ref="size" v-if="hasSizes" @click.self="toggleShow">
			{{ size }}条/页 <i class="iconfont icon-down pagination_click_lh_toggleShow_ttt" @click.self="toggleShow"></i>

			<div class="size-list-wrap pagination_click_lh_toggleShow_ttt" ref="sizeListWrap">
                <ul class="size-list pagination_click_lh_toggleShow_ttt">
                    <li class="first pagination_click_lh_toggleShow_ttt"></li>
                    <li class="pagination_click_lh_toggleShow_ttt" v-for="v in sizeArr" :key="v" @click.stop="handelSizeChange(v)">{{ v }}条/页</li>
                </ul>
            </div>
		</div>

        <button class="page-btns" @click="pagedown"><i class="iconfont icon-left"></i></button>
        <ul class="page-item-list">
            <li class="page-item" @click="handelPageChange(1)" v-if="leftPage">1</li>
            <li class="page-item" @click="goLeft" @mouseenter="toleft = false" @mouseleave="toleft = true" v-if="leftPage"><i class="iconfont icon-ellipsis" v-if="toleft"></i><i v-if="!toleft" class="iconfont icon-bdleft"></i></li>
            <li class="page-item" @click="handelPageChange(i)" v-for="i in pageArr" :key="i">{{i}}</li>
            <li class="page-item" @click="goRight"  @mouseenter="toright = false" @mouseleave="toright = true" v-if="rightPage"><i class="iconfont icon-ellipsis" v-if="toright"></i><i v-if="!toright" class="iconfont icon-dbright"></i></li>
            <li class="page-item" @click="handelPageChange(totalPage)" v-if="rightPage">{{totalPage}}</li>
        </ul>
        <button class="page-btns" @click="pageup"><i class="iconfont icon-right"></i></button>

        <div class="page-inpt-container" v-if="hasJumper">前往第 <input v-model="nowPage" @input="handelInput($event.target.value)" class="page-inpt" type="text"> 页</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			show: false,
            pageArr: [4, 5, 6, 7, 8],
            totalPage: 0,
            toleft: true,
            leftPage: true,
            toright: true,
            rightPage: true,
            nowPage: 1,
            hasTotal: false,
            hasSizes: false,
            hasJumper: false,
		};
	},
	props: {
		total: {
			type: Number,
		},
		size: {
			type: Number,
			default: 20,
		},
		sizeArr: {
			type: Array,
		},
        currentPage: {
            type: Number
        },
        layout: {
            type: String
        }
	},
	methods: {
		toggleShow() {
			this.show = !this.show;
            if(this.show) {
                this.$refs.sizeListWrap.style.opacity = 1;
                this.$refs.sizeListWrap.style.height = this.sizeArr.length * 36 + 10 + 12 + 'px';
                this.$refs.size.style.border = '1px solid #409eff'
            }else {
                this.changeStyle();
            }
		},
        handelSizeChange(val) {
            this.show = false;
            this.changeStyle();
            this.$emit("size-change", val);
        },
        handelPageChange(val) {
            this.changeActive(val);
            this.nowPage = val;
            this.$emit("current-change", this.nowPage);
        },
        init() {
            this.totalPage = Math.ceil(this.total / this.size);
            if(this.totalPage > 7) {
                if(this.currentPage <= 0) {
                    this.nowPage = 1;
                }else if(this.currentPage > 0 && this.currentPage <= 5) {
                    this.nowPage = this.currentPage;
                    this.pageArr = [1, 2, 3, 4, 5];
                    this.leftPage = false;
                    this.rightPage = true;
                    this.toright = true;
                }else if(this.currentPage > 5) {
                    this.nowPage = this.currentPage;
                    this.leftPage = true;
                    this.toleft = true;
                    this.pageArr = [this.nowPage - 2, this.nowPage - 1, this.nowPage, this.nowPage + 1, this.nowPage + 2];
                }
            }else {
                if(this.currentPage <= 0) {
                    this.nowPage = 1;
                }else{
                    this.nowPage = this.currentPage;
                };
                this.pageArr = [];
                for(let i = 0; i < this.totalPage; i ++) {
                    this.pageArr.push(i + 1);
                }
                this.leftPage = false;
                this.rightPage = false
            }
        },
        goLeft() {
            this.nowPage -= 5;
            if(this.nowPage === this.totalPage) {
                this.rightPage = true;
                this.toright = true;
                this.pageArr = [this.totalPage - 7, this.totalPage - 6, this.totalPage - 5, this.totalPage - 4, this.totalPage - 3];
            }else {
                this.rightPage = true;
                this.toright = true;
                if(this.nowPage <= 5) {
                    this.leftPage = false;
                    if(this.nowPage <= 0) {
                        this.nowPage = 1;
                    }
                    this.pageArr = [1, 2, 3, 4, 5];
                }else if(this.nowPage > 2) {
                    this.pageArr = [this.nowPage - 2, this.nowPage - 1, this.nowPage, this.nowPage + 1, this.nowPage + 2];
                };
            };
            this.$emit("current-change", this.nowPage);
        },
        goRight() {
            this.nowPage += 5;
            if(this.nowPage === 1) {
                this.leftPage = true;
                this.toleft = true;
                this.pageArr = [4, 5, 6, 7, 8];
            }else {
                this.leftPage = true;
                this.toleft = true;
                if(this.nowPage > (this.totalPage - 5)) {
                    this.rightPage = false;
                    if(this.nowPage >= this.totalPage) {
                        this.nowPage = this.totalPage;
                    }
                    this.pageArr = [this.totalPage - 4, this.totalPage - 3, this.totalPage - 2, this.totalPage - 1, this.totalPage];
                }else if(this.nowPage <= (this.totalPage - 2)) {
                    this.pageArr = [this.nowPage - 2, this.nowPage - 1, this.nowPage, this.nowPage + 1, this.nowPage + 2];
                };
            };
            this.$emit("current-change", this.nowPage);
        },
        pagedown() {
            if(this.nowPage <= 1) return;
            this.nowPage --;
            if(this.totalPage > 7) {
                if(this.nowPage < 5) {
                    this.leftPage = false;
                    this.rightPage = true;
                    this.toright = true;
                    if(this.nowPage <= 0) {
                        this.nowPage = 1;
                    }
                    this.pageArr = [1, 2, 3, 4, 5];
                }else if(this.nowPage <= this.totalPage - 5) {
                    this.rightPage = true;
                    this.toright = true;
                    this.pageArr = [this.nowPage - 2, this.nowPage - 1, this.nowPage, this.nowPage + 1, this.nowPage + 2];
                };
            }
            this.$emit("current-change", this.nowPage);
        },
        pageup() {
            if(this.nowPage >= this.totalPage) return;
            this.nowPage ++;
            if(this.totalPage > 7) {
                if(this.nowPage >= 6) {
                    if(this.nowPage > (this.totalPage - 5)) {
                        this.rightPage = false;
                        this.leftPage = true;
                        this.toleft = true;
                        if(this.nowPage >= this.totalPage) {
                            this.nowPage = this.totalPage;
                        }
                        this.pageArr = [this.totalPage - 4, this.totalPage - 3, this.totalPage - 2, this.totalPage - 1, this.totalPage];
                    }else {
                        this.leftPage = true;
                        this.toleft = true;
                        this.pageArr = [this.nowPage - 2, this.nowPage - 1, this.nowPage, this.nowPage + 1, this.nowPage + 2];
                    };
                }
            }
            this.$emit("current-change", this.nowPage);
        },
        handelInput(val) {
            if(val <= 0 || !Boolean(Number(val))) {
                this.nowPage = 1;
            }else if(val >= this.totalPage) {
                this.nowPage = this.totalPage;
            };
            if(this.nowPage <= 5) {
                this.leftPage = false;
                this.pageArr = [1, 2, 3, 4, 5];
            }else if(this.nowPage >= 6) {
                this.leftPage = true;
                this.toleft = true;
                if(this.nowPage > (this.totalPage - 5)) {
                    this.rightPage = false;
                    this.pageArr = [this.totalPage - 4, this.totalPage - 3, this.totalPage - 2, this.totalPage - 1, this.totalPage];
                }else {
                    this.pageArr = [this.nowPage-2, this.nowPage - 1, this.nowPage, this.nowPage * 1 + 1, this.nowPage * 1 + 2];
                }
            };
            this.$emit("current-change", this.nowPage);
        },
        changeStyle() {
            this.$refs.sizeListWrap.style.opacity = 0;
            this.$refs.sizeListWrap.style.height = '0px';
            this.$refs.size.style.border = '1px solid #dcdfe6'
        },
        changeActive(page) {
            document.querySelectorAll('.page-item').forEach(v => {
                if(v.innerText == page) {
                    v.className = 'page-item active';
                }else {
                    v.className = 'page-item';
                }
            });
        },
        initLayout() {
            this.layout.split(',').forEach(v => {
                if(v.replace(' ', '') == 'total') {
                    this.hasTotal = true;
                }else if(v.replace(' ', '') == 'sizes') {
                    this.hasSizes = true;
                }else if(v.replace(' ', '') == 'jumper') {
                    this.hasJumper = true;
                }
            });
        }
	},
    watch: {
        nowPage(newVal) {
            this.$nextTick(() => {
                this.changeActive(newVal);
            })
        },
        currentPage(newVal) {
            this.nowPage = newVal;
        },
        size(newVal) {
            this.init();
        }
    },
    created() {
        this.initLayout();
        this.init();
    },
    mounted() {
        this.changeActive(this.nowPage);
        window.addEventListener('click', (e) => {
            if(!this.show) return;
            if(e.target.className.indexOf('pagination_click_lh_toggleShow_ttt') === -1) {
                this.show = false;
                this.changeStyle();
            }
        });
    }
};
</script>

<style lang="less" scoped>
.pagination-page {
	display: flex;
	line-height: 28px;
    color: #777;

	.total {
		margin-right: 10px;
	}

	.size {
		position: relative;
		padding: 0 10px;
        margin-right: 10px;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		cursor: pointer;

		.icon-down {
			margin-left: 5px;
			font-size: 12px;
			color: #dcdfe6;
		}

        .size-list-wrap{
            position: absolute;
            top: 38px;
            left: 0;
            height: 0;
            width: 100%;
            transition: all .1s linear;
            overflow: hidden;
        }

		.size-list {
			position: absolute;
			top: 5px;
			left: 0;
			padding: 5px 0;
			width: 100%;
			border: 1px solid #dcdfe6;
			border-radius: 4px;
            box-shadow: 0px 0px 5px #ddd;

			li {
				line-height: 36px;
				text-indent: 15px;

				&:hover {
					color: #409eff;
					background-color: #f5f7fa;
				}
			}

			.first {
				display: block;
				position: absolute;
				top: -5px;
				left: 30px;
				transform: rotateZ(45deg);
				width: 8px;
				height: 8px;
				border-left: 1px solid #dcdfe6;
				border-top: 1px solid #dcdfe6;
				background-color: #fff;
			}
		}
	}

    .page-btns{
        width: 38px;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        text-align: center;
        border: 0;
        background-color: #fff;
    }

    .page-item-list{
        display: flex;
        align-items: center;
        color: #222;

        .page-item{
            width: 38px;
            line-height: 28px;
            text-align: center;
            cursor: pointer;
            user-select: none;

            .iconfont{
                font-size: 14px;
            }

            &:hover{
                color: #409eff;
            }
        }

        .active{
            color: #409eff;
        }
    }

    .page-inpt-container{
        margin-left: 10px;

        .page-inpt{
            width: 50px;
            height: 28px;
            text-align: center;
            color: #222;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
        }
    }
}
</style>