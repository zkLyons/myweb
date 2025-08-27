<template>
  <div class="top">
    <div class="left">
      <!-- <span class="lbtn">首页</span> -->
      <button class="btn" @click="goHome">首页</button>
    </div>
    <div class="center">
      <div class="title">智慧旅游可视化大数据展示平台</div>
    </div>
    <div class="right">
      <button class="rbtn">统计报告</button>
      <span class="time">时间:{{ time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import moment from 'moment'
//存储当前时间
let time = ref(moment().format('YYYY年MM月DD日 hh:mm:ss'))
let $router = useRouter()
let timer = ref<any>(0)
const goHome = () => {
  $router.push('/home')
}
// 每次挂载设置一次定时器
onMounted(() => {
  timer.value = setInterval(() => {
    time.value = moment().format('YYYY年MM月DD日 hh:mm:ss')
  }, 1000)
})
onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>

<style scoped lang="scss">
.top {
  width: 100%;
  height: 42px;
  display: flex;
  .left {
    flex: 1;
    background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
    background-size: cover;
    display: flex;
    justify-content: flex-end;
    .btn {
      width: 135px;
      height: 40px;
      text-align: center;
      background: url(../../images/dataScreen-header-btn-bg-l.png);
      color: #29fcff;
      font-size: 20px;
    }
  }
  .center {
    flex: 2;
    .title {
      width: 100%;
      height: 74px;
      background: url(../../images/dataScreen-header-center-bg.png) no-repeat;
      background-size: cover;
      color: #29fcff;
      line-height: 74px;
      text-align: center;
      font-size: 30px;
    }
  }
  .right {
    flex: 1;
    background: url(../../images/dataScreen-header-right-bg.png) no-repeat;
    background-size: cover;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .rbtn {
      width: 135px;
      height: 42px;
      background: url(../../images/dataScreen-header-btn-bg-r.png) no-repeat;
      color: #29fcff;
      font-size: 20px;
    }
    .time {
      background: none;
      color: #29fcff;
      font-size: 20px;
      margin-right: 30px;
    }
  }
}
</style>
