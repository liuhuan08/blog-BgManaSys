<template>
	<div class="wrap">
		<div class="upload-section">
			<label v-if="!multiple">
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
					v-if="url && typeof url === 'string'"
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
	</div>
</template>

<script>
import axios from "axios";

export default {
	data() {
		return {
			url: this.src,
			file: null,
			multiple: true,
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
			type: Array,
		},
	},
	methods: {
		upload(e) {
			if (e.target.files.length > 5) {
				this.Msg("最多5张，重新选择吧~", "warning", 1500);
			} else {
				if (this.file) return;
				let formData = new FormData();
				for (let i = 0; i < e.target.files.length; i++) {
					if (!this.beforeUpload(e.target.files[i])) return;
					formData.append("images", e.target.files[i]);
				}

				axios.post(this.action, formData, { headers: { "Content-Type": "multipart/form-data" }, }).then((res) => {
					if (res.status === 200) {
						this.url = res.data.data;
						this.$emit("on-success", res.data.data);
					}
				});
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
</style>