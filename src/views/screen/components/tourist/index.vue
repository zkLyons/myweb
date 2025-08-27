<template>
  <div class="main">
    <div class="top">
      <p class="left">游客</p>
      <p class="bg"></p>
      <p class="number">
        可预约总量
        <span>99999</span>
        人
      </p>
    </div>
    <div class="people">
      <span v-for="(item, index) in num_peo" :key="index">{{ item }}</span>
    </div>
    <div class="charts" ref="ball">tuxingtubiao</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import 'echarts-liquidfill'
let num_peo = ref('29757430')
let ball = ref()

onMounted(() => {
  let myecharts = echarts.init(ball.value)
  myecharts.setOption({
    // title
    // title: { text: '水球图' },
    // x|y轴
    xAxis: {},
    yAxis: {},
    // 系列，决定展示什么样的图片
    series: {
      type: 'liquidFill',
      data: [0.6, 0.5],
      animationDuration: 3,
      radius: '70%',
    },
    // 布局组件
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  })
})
</script>

<style scoped lang="scss">
.main {
  background: url(../../images/dataScreen-main-lb.png);
  background-size: cover;
  margin-top: 15px;
  .top {
    position: relative;
    .left {
      font-size: 20px;
      color: white;
      margin-top: 20px;
      margin-left: 5px;
    }
    .bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png);
      margin-top: 5px;
    }
    .number {
      position: absolute;
      top: 40px;
      left: 65%;
      color: white;
      font-size: 15px;
    }
  }
  .people {
    margin-top: 50px;
    display: flex;
    justify-content: space-around;

    span {
      width: 40px;
      height: 40px;

      background: url(../../images/total.png) no-repeat;
      background-size: cover;
      text-align: center;
      line-height: 40px;
      font-size: 30px;
      color: white;
    }
  }
  .charts {
    width: 100%;
    height: 240px;
  }
}
</style>
