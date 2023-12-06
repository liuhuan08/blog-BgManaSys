<template>
  <div class="title">{{ title }}</div>

  <div class="card_container">
    <card v-for="cardData in cardList" :key="cardData.name" :card-data="cardData" />
  </div>

  <div class="line_chart_container" ref="line_chart_container"></div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue';
import card from './card.vue';
import { getNumData } from "@/api/user";
import local from "@/utils/local"
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);

let title = ref('加油，你是最棒的！');
let cardList = reactive<any>([
  { icon: 'article', name: '发表文章总数:', value: 0, color: '#FF9900' },
  { icon: 'article', name: '近一周发表文章数:', value: 0, color: '#FF0033' },
  { icon: 'imgs', name: '图片总数:', value: 0, color: '#333399' },
  { icon: 'imgs', name: '近一周上传图片数:', value: 0, color: '#663399' }
]);
let dateArr = reactive<any>([])
let imgsData = reactive<any>([0, 0, 0, 0, 0, 0, 0])
let articleData = reactive<any>([0, 0, 0, 0, 0, 0, 0])
const bloggerId = local.get('blog_userinfo').bloggerId;
const line_chart_container = ref<any>(null);
let myChart = reactive<any>(null);
let timer = ref<any>(null)

const getTitle = () => {
  if (cardList[1].value === 0 && cardList[3].value === 0) {
    title.value = '最近有点懈怠哦，没有发表任何文章或图片...';
  } else if (cardList[1].value <= 2 && cardList[3].value <= 2) {
    title.value = '不错，继续努力！';
  } else {
    title.value = '哇噻，高产似母猪~(头发还好吗)';
  }
}

const getData = () => {
  let today = new Date().getTime()
  for (let i = 0; i < 7; i++) {
    let month = (new Date(today - i * 24 * 60 * 60 * 1000).getMonth() + 1);
    let day = new Date(today - i * 24 * 60 * 60 * 1000).getDate();
    let date = month + '-' + day
    dateArr.unshift(date)
  }

  getNumData(bloggerId).then(res => {
    if (res.status === 200) {
      let data = res.data.data;
      cardList[0].value = data.articles.total;
      cardList[1].value = data.articles.recently;
      cardList[2].value = data.albumImages.total;
      cardList[3].value = data.albumImages.recently;

      for (let key in data.albumImages.recentList) {
        if (dateArr.indexOf(key) !== -1) {
          imgsData[dateArr.indexOf(key)] = data.albumImages.recentList[key]
        }
      }
      for (let key in data.articles.recentList) {
        if (dateArr.indexOf(key) !== -1) {
          articleData[dateArr.indexOf(key)] = data.articles.recentList[key]
        }
      };

      getTitle();
      drawLine();
    }
  })
}

const drawLine = () => {
  myChart = echarts.init(line_chart_container.value);
  let option;

  option = {
    title: {
      text: '近一周发表情况'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['文章数', '图片数']
    },
    color: [
      "#FF0033",
      "#663399"
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dateArr
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '文章数',
        type: 'line',
        stack: 'Total',
        data: imgsData
      },
      {
        name: '图片数',
        type: 'line',
        stack: 'Total',
        data: articleData
      }
    ]
  };

  option && myChart.setOption(option);
}

const handleResize = () => {
  if (timer.value) clearTimeout(timer.value);
  timer.value = setTimeout(() => {
    myChart.resize()
  }, 100)
}

onMounted(() => {
  getData();
  window.addEventListener('resize', handleResize);
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped lang="scss">
.card_container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.line_chart_container {
  margin-top: 20px;
  height: calc(100% - 140px);
}
</style>