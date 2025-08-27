<template>
  <div class="box1">
    <div class="box12">
      <div class="top">
        <p>热门景区排行</p>
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
    title: {
      text: '排行图表',
      textStyle: {
        color: 'white',
        fontSize: 25,
      },
      left: '40%',
      // top: '-5%',
      subtext: '景区热门度排名',
      subtextStyle: {
        fontSize: 18,
        color: 'yellowgreen',
      },
    },
    xAxis: {
      type: 'category',
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      // 显示y轴竖线
      axisLine: {
        show: true,
      },
      splitLine: {
        show: false,
      },
    },
    grid: {
      left: 30,
      right: 20,
      top: 40,
      bottom: 35,
    },
    series: [
      {
        type: 'bar',
        data: [10, 30, 20, 70, 40],
        showBackground: true,
        backgroundStyle: {
          color: 'gray',
        },
        label: {
          show: true,
          position: 'insideTop',
          fontSize: 15,
        },
        //柱条的样式
        itemStyle: {
          borderRadius: [10, 10, 0, 0],
          //柱条颜色
          color: function (data: any) {
            //给每一个柱条这是背景颜色
            let arr = [
              'red',
              'orange',
              'yellowgreen',
              'green',
              'purple',
              'hotpink',
              'skyblue',
            ]
            return arr[data.dataIndex]
          },
        },
      },
      {
        type: 'line',
        data: [10, 30, 20, 70, 40],
        lineStyle: {
          width: 4,
          color: 'white',
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
    margin-top: 10px;
    background: url(../../images/dataScreen-main-rt.png) no-repeat;
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
