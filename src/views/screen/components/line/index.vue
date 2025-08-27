<template>
  <div class="frame">
    <div class="content">
      <div class="top">
        <p class="top_left">游客折线图</p>
        <img src="../../images/dataScreen-title.png" alt="" />
      </div>
      <div class="charts" ref="line"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
let line = ref()

onMounted(() => {
  let mycharts = echarts.init(line.value)
  mycharts.setOption({
    // title: {
    //   text: '游客量/人',
    //   textStyle: {
    //     fontSize: 20,
    //     color: 'skyblue',
    //   },
    //   left: 50,
    // },
    xAxis: {
      name: '日期',
      nameTextStyle: {
        fontSize: 20,
        color: 'skyblue',
      },
      // 定义x轴为类目轴，y就为数值轴
      type: 'category',
      // 所有类目名称列表
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLabel: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
      },
    },
    yAxis: {
      name: '游客量/人',
      nameTextStyle: {
        fontSize: 20,
        color: 'skyblue',
      },

      // 显示y轴竖线
      axisLine: {
        show: true,
      },
      // 去掉垂直于y轴的网格线
      splitLine: {
        show: false,
      },
      axisLabel: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
      },
    },
    series: [
      {
        type: 'line',
        data: [120, 1240, 66, 2299, 321, 890, 1200],
        // 曲线平滑
        smooth: true,
        // 设置区域颜色填充，渐变
        areaStyle: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'red', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'blue', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
      },
    ],
    grid: {
      left: 60,
      right: 60,
      bottom: 30,
      top: 40,
    },
  })
})
</script>

<style scoped lang="scss">
.frame {
  margin-left: 10px;
  margin-right: 10px;
  .content {
    // width: 95%;
    height: 90%;
    background-color: skyblue;
    margin: 5px 0 5px 0;
    background: url(../../images/dataScreen-main-cb.png) no-repeat;
    background-size: cover;
    .top {
      width: 100%;
      height: 22%;
      .top_left {
        font-size: 20px;
        color: white;
      }
    }
    .charts {
      width: 100%;
      height: 78%;
      // background-color: red;
    }
  }
}
</style>
