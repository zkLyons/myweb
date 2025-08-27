<template>
    <div>
        <el-card>
            <el-form :inline="true" :disabled="scence">
                <el-form-item label="一级分类" style="width:300px;">
                    <el-select v-model="categoryStore.c1Id" placeholder="Select" @change="handler1">
                        <el-option v-for='(c1, index) in categoryStore.c1Arr' :key='c1.id' :label="c1.name"
                            :value="c1.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级分类" style="width:250px;">
                    <el-select v-model="categoryStore.c2Id" placeholder="Select" @change="handler2">
                        <el-option v-for='(c2, index) in categoryStore.c2Arr' :key='c2.id' :label="c2.name"
                            :value="c2.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="三级分类" style="width:250px;">
                    <el-select v-model="categoryStore.c3Id" placeholder="Select">
                        <el-option v-for='(c3, index) in categoryStore.c3Arr' :key='c3.id' :label="c3.name"
                            :value="c3.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

        </el-card>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { reqC1 } from '@/api/product/attr/index'
import useCategoryStore from '@/store/modules/category'


let categoryStore = useCategoryStore()

const getC1 = () => {
    categoryStore.getC1()
}
// 一级菜单绑定的change事件，当选中值发生改变的时候，就触发chagnge事件，获取二级菜单的数据。
const handler1 = () => {

    // 需要将上一次的二级和三级数据清空，二级只清空id，不清除刚获取到的数据，三级清空id和上次留存到的数据
    categoryStore.c2Arr = []
    categoryStore.c2Id = ''
    categoryStore.c3Arr = []
    categoryStore.c3Id = ''
    categoryStore.getC2()

}
// 二级菜单绑定的change事件，当选中值发生改变的时候，就触发chagnge事件，获取三级菜单的数据。
const handler2 = () => {
    // 需要将上一次的三级数据清空，三级只清空id，不清除刚获取到的数据
    categoryStore.c3Arr = []
    categoryStore.c3Id = ''
    categoryStore.getC3()

}
onMounted(() => {
    getC1()
})
defineProps(['scence'])
</script>
<style scoped lang="scss">
.demo-form-inline .el-input {
    --el-input-width: 220px;
}

.demo-form-inline .el-select {
    --el-select-width: 220px;
}
</style>