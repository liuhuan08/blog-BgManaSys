<template>
	<div class="pagination-page">
		<div class="total">共 {{ total }} 条</div>
		<div class="size pagination_click_lh_toggleShow_ttt" ref="size" @click.self="toggleShow">
			{{ size }}条/页 <i class="iconfont icon-down pagination_click_lh_toggleShow_ttt" @click.self="toggleShow"></i>

			<div class="size-list-wrap pagination_click_lh_toggleShow_ttt" ref="sizeListWrap">
                <ul class="size-list pagination_click_lh_toggleShow_ttt">
                    <li class="first pagination_click_lh_toggleShow_ttt"></li>
                    <li class="pagination_click_lh_toggleShow_ttt" v-for="v in sizeArr" :key="v" @click.stop="handelSizeChange(v)">{{ v }}条/页</li>
                </ul>
            </div>
		</div>

        <ul class="page-item-list">
            <li class="page-item"><i class="iconfont icon-left"></i></li>
            <li class="page-item">1</li>
            <li class="page-item" @mouseenter="toleft = false" @mouseleave="toleft = true"><i class="iconfont icon-ellipsis" v-if="toleft"></i><i v-if="!toleft" class="iconfont icon-bdleft"></i></li>
            <li class="page-item">3</li>
            <li class="page-item">4</li>
            <li class="page-item">5</li>
            <li class="page-item">6</li>
            <li class="page-item">7</li>
            <li class="page-item" @mouseenter="toright = false" @mouseleave="toright = true"><i class="iconfont icon-ellipsis" v-if="toright"></i><i v-if="!toright" class="iconfont icon-dbright"></i></li>
            <li class="page-item">10</li>
            <li class="page-item"><i class="iconfont icon-right"></i></li>
        </ul>

        <div>前往第 <input class="page-inpt" type="text"> 页</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			show: false,
            toleft: true,
            toright: true
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
            this.$emit("size-change", val);
            this.show = false;
            this.changeStyle();
        },
        changeStyle() {
            this.$refs.sizeListWrap.style.opacity = 0;
            this.$refs.sizeListWrap.style.height = '0px';
            this.$refs.size.style.border = '1px solid #dcdfe6'
        }
	},
    mounted() {
        window.addEventListener('click', (e) => {
            if(!this.show) return;
            if(e.target.className.indexOf('pagination_click_lh_toggleShow_ttt') === -1) {
                this.show = false;
                this.changeStyle();
            }
        })
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
    }

    .page-inpt{
        width: 50px;
        height: 28px;
        text-align: center;
        color: #222;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
    }
}
</style>