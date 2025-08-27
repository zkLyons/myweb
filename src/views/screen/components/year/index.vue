<template>
  <div class="box1">
    <div class="box12">
      <div class="top">
        <p>预约渠道数据统计</p>
        <img src="../../images/dataScreen-title.png" alt="" />
      </div>
      <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
let charts = ref()
onMounted(() => {
  let mycharts = echarts.init(charts.value)
  mycharts.setOption({
    xAxis: {
      type: 'category',
      show: true,
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      show: true,
      axisLine: {
        show: true,
      },
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        type: 'scatter',
        data: [32, 45, 61, 22, 12, 54, 91, 3, 51, 34, 1],
        label: {
          show: true,
          position: 'top',
          fontSize: 15,
          fontFamily: 'Microsoft YaHei',
        },
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.box1 {
  .box12 {
    width: 100%;
    height: 95%;
    background: url(../../images/dataScreen-main-rc.png) no-repeat;
    background-size: cover;
    .top {
      p {
        font-size: 20px;
        color: white;
      }
    }
    .charts {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
