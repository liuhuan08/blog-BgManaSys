<template>
	<div>
		<transition name="slide-fade">
			<router-view class="page" />
		</transition>
	</div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.page {
	overflow-y: scroll;

	&::-webkit-scrollbar {
		width: 6px;
	}
	&::-webkit-scrollbar-thumb {
		border-radius: 6px;
		background: #ccc;
	}
	&::-webkit-scrollbar-track {
		border-radius: 0;
		background: #eee;
	}
}

.slide-fade-enter-active {
	transition: all 0.3s linear;
}
.slide-fade-leave-active {
	transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
	transform: translateX(10px);
	opacity: 0;
}
.slide-fade-leave-to {
	display: none;
}
</style>