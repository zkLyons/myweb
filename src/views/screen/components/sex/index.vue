<template>
  <div class="box1">
    <div class="top">
      <span class="sex_text">男女比例</span>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="center">
      <div class="man">
        <img src="../../images/man.png" alt="" />
      </div>
      <div class="woman">
        <img src="../../images/woman.png" alt="" />
      </div>
    </div>
    <div class="rate">
      <p>男士58%</p>
      <p>女62%</p>
    </div>
    <div class="charts">
      <div class="content" ref="charts"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

let charts = ref()
onMounted(() => {
  let myecharts = echarts.init(charts.value)
  myecharts.setOption({
    //组件标题
    title: {
      text: '男女比例', //主标题
      textStyle: {
        //主标题颜色
        color: 'skyblue',
      },
      left: '40%',
    },
    //x|y，将y轴设置为类型轴，x设置为数值轴，就可以将柱状图水平过来了。
    xAxis: {
      show: false,
      min: 0,
      max: 100,
    },
    yAxis: {
      show: false,
      type: 'category',
    },
    series: [
      {
        type: 'bar',
        data: [58],
        barWidth: 20,
        z: 100,
        itemStyle: {
          color: 'skyblue',
          borderRadius: 20,
        },
      },
      {
        type: 'bar',
        data: [100],
        barWidth: 20,
        //调整女士柱条位置
        barGap: '-100%',
        itemStyle: {
          color: 'hotpink',
          borderRadius: 20,
        },
      },
    ],
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  })
})
</script>

<style scoped lang="scss">
.box1 {
  margin-top: 5px;
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: cover;
  .top {
    display: flex;
    flex-direction: column;
    .sex_text {
      font-size: 20px;
      color: white;
    }
    img {
      width: 68px;
      height: 7px;
      margin-top: 10px;
    }
  }
  .rate {
    margin-top: 5px;
    display: flex;
    justify-content: space-around;
    color: white;
  }
  .center {
    display: flex;
    justify-content: center;
    margin-top: 50px;
    .man {
      width: 111px;
      height: 116px;
      background: url(../../images/man-bg.png);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 150px;

      img {
        width: 61px;
        height: 61px;
      }
    }
    .woman {
      width: 111px;
      height: 116px;
      background: url(../../images/woman-bg.png);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 10px;
      img {
        width: 61px;
        height: 61px;
      }
    }
  }
  .charts {
    width: 100%;
    height: 90px;
    padding: 0 40px 0 40px;
    .content {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
