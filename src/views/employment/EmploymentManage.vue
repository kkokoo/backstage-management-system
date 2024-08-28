<script setup>
import { computed, ref } from 'vue'
import { userGetmapService, userEditmapService } from '@/api/manager'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const total = ref(1)
const getMap = async () => {
    try {
        const res = await userGetmapService()
        tableData.value = res.data.data
        total.value = res.data.data.length
    } catch (error) {
        console.error('获取失败', error)
    }
}
getMap()

let title = '标题'
const isVisible = ref(false)
const editForm = ref({
    name: '',
    value: ''
})
const rules = {
    name: [
        //空
        { required: false, message: '请输入省份名', trigger: 'blur' }
    ],
    value: [
        //非空校验
        { required: true, message: '请输入该省份就业人数', trigger: 'blur' }
    ]
}
let mapName = '省份名'
const handleEdit = (row) => {
    title = '编辑'
    isVisible.value = true
    mapName = row.name
    editForm.value = row
    // console.log(index, row)
}
const resetEditForm = () => {
    editForm.value.value = '0'
}
// 表单验证
const edit_Form = ref()
const submitEdit = async () => {
    try {
        await edit_Form.value.validate()
        await userEditmapService({ name: mapName, value: editForm.value.value })
        ElMessage.success('修改成功')
    } catch (error) {
        console.error('上传就业数据失败', error)
    }
}
// 分页
let pageSize = ref(35)
// const pageSizes = ref([10, 15, 20, 35])
let currentPage = ref(1)
//前端限制分页（tableData为当前展示页表格）
// 搜索
const search = ref('')
let isSearch = ref(false)
const handleCurrentChange = (val) => {
    currentPage.value = val
    isSearch.value = false
}
const handleSizeChange = (val) => {
    pageSize.value = val
    isSearch.value = false
}

const filteredTableData = computed(() => {
    if (isSearch.value) {
        // 如果启用了搜索，则根据搜索词过滤数据
        return tableData.value.filter((data) => !search.value || data.name.toLowerCase().includes(search.value.toLowerCase()))
    } else {
        // 否则，根据分页来过滤数据
        const start = (currentPage.value - 1) * pageSize.value
        const end = currentPage.value * pageSize.value
        return tableData.value.slice(start, end)
    }
})
</script>
<template>
    <el-table :data="filteredTableData" style="width: 100%; height: 550px">
        <el-table-column label="省份" prop="name" />
        <el-table-column label="人数" sortable prop="value" />
        <el-table-column>
            <template #header>
                <el-input v-model="search" @click="isSearch = true" style="width: 50%" size="small" placeholder="请输入省份" />
            </template>
            <template #default="scope">
                <el-button type="primary" plain size="small" @click="handleEdit(scope.row)"> Edit </el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination
        style="padding: 10px; background-color: #ffffff"
        :current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 15, 20, 35]"
        layout="total, sizes,prev, pager, next, jumper"
        :total
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    ></el-pagination>
    <!-- 编辑和增加 -->
    <el-dialog :title="title" v-model="isVisible" style="width: 300px" draggable>
        <el-form :model="editForm" :rules="rules" ref="edit_Form" label-width="80px" class="edit_Form">
            <el-form-item label="省份" prop="name">
                <el-input v-model="editForm.name" style="width: 80%" />
            </el-form-item>

            <el-form-item label="人数" prop="value">
                <el-input v-model="editForm.value" style="width: 30%" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitEdit()">提交</el-button>
                <el-button @click="resetEditForm()">重置</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
