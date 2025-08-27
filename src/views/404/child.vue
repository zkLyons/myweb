<template>
  <div>
    <slot :msg1="msg"  :$row="row"></slot>
    <header>
      <slot name="header" :permissionArr></slot>
    </header>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
const msg = ref('来自子组件的msg数据')
const permissionArr = reactive({
  name: 'zs',
  age: 18,
})
const row = ref(123)
</script>

<style scoped></style>
