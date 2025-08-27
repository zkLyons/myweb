<template>
  <div class="frame">
    <div class="top">
      <span class="age_title">年龄比例</span>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <!-- echarts -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
let charts = ref()
onMounted(() => {
  let mycharts = echarts.init(charts.value)
  let option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: 35,
      right: 10,
      orient: 'vertical',
      textStyle: {
        color: 'white',
        fontSize: 16,
      },
    },

    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '90%'],
        avoidLabelOverlap: false,
        // 修改饼状图的位置
        center: ['30%', '50%'],
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white',
          fontSize: 16,
        },

        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' },
        ],
      },
    ],
  }
  mycharts.setOption(option)
})
</script>

<style scoped lang="scss">
.frame {
  margin-top: 5px;
  margin-bottom: 5px;

  background: url(../../images/dataScreen-main-lc.png) no-repeat;
  background-size: cover;
  .top {
    display: flex;
    flex-direction: column;
    .age_title {
      font-size: 20px;
      color: white;
      margin-bottom: 10px;
    }
    img {
      width: 68px;
      height: 7px;
    }
  }
  .charts {
    width: 100%;
    height: 250px;
    margin-top: 20px;
  }
}
</style>
