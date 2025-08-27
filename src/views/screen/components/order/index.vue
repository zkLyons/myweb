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
    legend: {
      data: ['周一', '周二'],
      textStyle: {
        color: 'white',
        fontSize: 20,
      },
      orient: 'vertical',
      left: 10,
      top: 20,
    },
    radar: {
      // shape: 'circle',
      indicator: [
        { name: 'a', max: 6500 },
        { name: 'b', max: 16000 },
        { name: 'c', max: 30000 },
        { name: 'd', max: 38000 },
        { name: 'e', max: 52000 },
        { name: 'f', max: 25000 },
      ],
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: '周一',
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: '周二',
          },
        ],
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
