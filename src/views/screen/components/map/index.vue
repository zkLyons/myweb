<template>
  <div class="frame" ref="map"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import chinaJson from './china.json'
import * as echarts from 'echarts'
let map = ref()
echarts.registerMap('china', chinaJson as any)
onMounted(() => {
  let mycharts = echarts.init(map.value)
  let Option = {
    //地图组件
    geo: {
      map: 'china', //中国地图
      roam: true, //鼠标缩放的效果
      //地图的位置调试
      left: 200,
      top: 200,
      // right: 150,
      zoom: 1.5,
      // bottom: 0,
      //地图上的文字的设置
      label: {
        show: true, //文字显示出来
        // color: 'white',
        fontSize: 14,
      },

      //地图高亮的效果
      emphasis: {
        itemStyle: {
          color: 'red',
        },
        label: {
          fontSize: 40,
        },
      },
    },

    series: [
      {
        type: 'lines', //航线的系列
        data: [
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [119.306239, 26.075302], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: 'orange',
              width: 5,
            },
          },
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [114.298572, 30.584355], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: 'yellow',
              width: 5,
            },
          },
        ],
        //开启动画特效
        effect: {
          show: true,
          symbol: 'arrow',
          color: 'black',
          symbolSize: 10,
        },
      },
    ],
  }
  mycharts.setOption(Option)
})
</script>

<style scoped lang="scss"></style>
