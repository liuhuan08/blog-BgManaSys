<template>
	<div class="test-page">
		<div class="tohome" @click="tohome" title="回首页"></div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			
		};
	},
	methods: {
		tohome() {
			this.$router.push('/home')
		}
	},
};
</script>

<style lang="less" scoped>
.test-page {
	position: relative;
	padding: 20px;
	width: 100%;
	height: 100%;
    background: url("../assets/imgs/404-2.jpg") center no-repeat;
    background-size: 100% 100%;

	.tohome{
		position: absolute;
		top: 38%;
		left: 46%;
		transform: rotateZ(-10deg);
		width: 200px;
		height: 50px;
		background-color: rgba(255, 255, 255, 0);
		border-radius: 20px;
		cursor: pointer;
	}
}
</style>