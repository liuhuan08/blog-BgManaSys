<template>
  <div class="card">
    <el-icon :color="cardData.color">
      <icon-management v-if="cardData.icon === 'article'"/>
      <icon-picture-filled v-if="cardData.icon === 'imgs'"/>
    </el-icon>
    <div class="name">{{ cardData.name }}</div>
    <div class="number">{{ cardData.value }}</div>
  </div>
</template>

<script setup lang="ts">
import {
  Management as IconManagement,
  PictureFilled as IconPictureFilled
} from '@element-plus/icons-vue'

defineProps({
  cardData: Object
})
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  align-items: flex-end;
  padding: 20px;
  height: 80px;
  width: 23%;
  background-color: #79bbff;
  border-radius: 8px;

  .el-icon {
    font-size: 40px;

    svg {
      width: 40px;
      height: 40px;
    }
  }

  .name {
    flex: 1;
    padding-bottom: 3px;
    margin: 0 5px;
    font-size: 12px;
    text-align: right;
  }

  .number {
    font-size: 40px;
    transform: translateY(5px);
  }
}
</style>