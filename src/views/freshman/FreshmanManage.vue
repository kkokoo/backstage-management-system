<script setup>
import { ref, onMounted } from 'vue'
import { userSelectallService, userDelectService, userInsertService, userDownloadService, userUpdateService } from '@/api/manager'

import { Delete, Edit, Upload } from '@element-plus/icons-vue'

const tableData = ref([])

//将当前页面默认定为1
let currentPage = ref(1)

const searchAllUser = async () => {
    try {
        const response = await userSelectallService({ page: currentPage.value })
        tableData.value = response.data.data // 更新用户数据
    } catch (error) {
        console.error('Failed to fetch users:', error)
    }
}
// 定义一个方法来获取所有用户的数据，不断发送请求直到返回的数组为空
// const counterAll = async () => {
//     try {
//         let totalSize = 0
//         let counter = 1
//         while (counter) {
//             const response = await userSelectallService({ page: counter })
//             totalSize += response.data.data.length
//             counter++
//             if (response.data.data.length === 0) {
//                 counter = 0
//             }
//         }
//         return totalSize // 返回总数
//     } catch (error) {
//         console.error('Failed to fetch users:', error)
//         return 0 // 或抛出错误
//     }
// }

// 只需要发送一次请求就可以获取全部数据了
const counterAll = async () => {
    try {
        let totalSize = 0
        const response = await userSelectallService({ page: 0 })
        totalSize += response.data.data.length
        return totalSize // 返回总数
    } catch (error) {
        console.error('Failed to fetch users:', error)
        return 0 // 或抛出错误
    }
}
const total = ref(1) // 假设总记录数为1
onMounted(async () => {
    try {
        const totalSize = await counterAll()
        total.value = totalSize // 显示更新后的值
    } catch (error) {
        console.error('Error fetching user count:', error)
    }
})
// 处理每页条数变化,这里不需要进行处理
// const handleSizeChange = (val) => {
//     console.log(`每页 ${val} 条`)
//     // 这里可以根据需要更新数据或进行其他操作
// }

// 处理当前页码变化,默认参数val就是当前页数
const handleCurrentChange = (val) => {
    currentPage.value = val
    // 更新完毕后调用函数获取当前页面的数据
    searchAllUser()
}

// 在组件挂载后调用searchAllUser方法
onMounted(() => {
    searchAllUser()
})

//删除
const handleDelete = (row) => {
    // index就是当前页的索引值，row就是当前行的所有数据
    ElMessageBox.confirm('您确认要删除吗?', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(async () => {
            //1.发送删除请求
            await userDelectService({ id: row.id })
            ElMessage({
                type: 'success',
                message: '删除成功'
            })
            // 删除后总数据的值减一
            total.value--
            // 重新获取当前页面的数据
            searchAllUser()
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除'
            })
        })
}

// 弹框相关
const ruleForm = ref({
    name: '',
    banji: '',
    xuehao: '',
    youxiang: '',
    fangxiang: '',
    jieshao: ''
})
// 弹框中的title相关
let title = '标题'

const rule_form = ref()
// 表单规则相关
const rules = {
    name: [
        // 非空校验 required:true  message消息提示， trigger失去焦点时进行校验blur，更改值时使用change
        { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
    banji: [
        //非空校验
        { required: true, message: '请输入班级', trigger: 'blur' }
    ],
    xuehao: [
        // 学号非空校验
        { required: true, message: '请输入学号', trigger: 'blur' },
        { min: 12, max: 12, message: '学号必须是 12位 的字符', trigger: 'blur' }
    ],
    youxiang: [
        // 非空校验
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        //正则校验
        { pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, message: '邮箱格式不正确', trigger: 'blur' }
    ],
    fangxiang: [
        // 非空校验
        { required: true, message: '请输入方向', trigger: 'blur' }
    ],
    jieshao: [
        // 关闭效验
        { required: false, message: '', trigger: 'blur' }
    ]
}

// 可视化
const isVisible = ref(false)
// 判断是添加还是编辑
const isAdd = ref(true)
// 编辑 isAdd.value = false为编辑
const handleEdit = async (row) => {
    title = '编辑数据'
    isVisible.value = true
    isAdd.value = false
    // 这里就是修改时将原来的值赋值给表单中，使修改更方便
    ruleForm.value = row
}
// 编辑提交
const resetUser = async () => {
    try {
        await rule_form.value.validate()
        await userUpdateService(ruleForm.value)
        ElMessage.success('修改成功')
        // 更新页面
        searchAllUser()
    } catch (error) {
        console.error('上传失败', error)
    }
}

// 添加 isAdd = ref(true)为添加
const submitUser = async () => {
    await rule_form.value.validate()
    await userInsertService(ruleForm.value)
    ElMessage.success('添加成功')
    // 添加后总数据的值加一
    total.value++
    // 添加后默认跳到最后一页，查看添加成功的学生
    // 1.先计算总页数
    const totalPage = Math.ceil(total.value / 10)
    // 2.再跳转到最后一页
    handleCurrentChange(totalPage)
}
const resetForm = () => {
    ruleForm.value = {
        name: '',
        banji: '',
        xuehao: '',
        youxiang: '',
        fangxiang: '',
        jieshao: ''
    }
}
const addUser = () => {
    resetForm()
    title = '添加新人'
    isVisible.value = true
    isAdd.value = true
}

//下载为excel文件
const downloadUser = async () => {
    try {
        const blob = await userDownloadService()
        const url = URL.createObjectURL(new Blob([blob.data], { type: 'application/vnd.ms-excel' }))
        // 创建一个a标签用于下载
        const link = document.createElement('a')
        link.href = url
        // 设置下载文件名
        link.download = '报名数据.xlsx'
        // 触发点击
        document.body.appendChild(link)
        link.click()
        // 清理
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    } catch (error) {
        console.error('下载失败:', error)
    }
}
</script>

<template>
    <div>
        <el-row style="background-color: #ffffff; padding: 10px">
            <el-button type="success" @click="addUser()">新增</el-button>
            <el-button type="primary" @click="downloadUser()">
                下载为Excel表格<el-icon class="el-icon--right"><Upload /></el-icon>
            </el-button>
        </el-row>

        <el-table :data="tableData" style="width: 100%; height: 520px">
            <el-table-column prop="id" label="编号" width="100" />
            <el-table-column prop="name" label="新生姓名" width="150" />
            <el-table-column prop="banji" label="新生班级" width="200" />
            <el-table-column prop="xuehao" label="新生学号" width="150" />
            <el-table-column prop="youxiang" label="邮箱" width="200" />
            <el-table-column prop="fangxiang" label="方向" width="100" />
            <el-table-column prop="jieshao" label="自我介绍" />
            <el-table-column label="操作" width="100">
                <!-- 这是一个插槽 -->
                <template #default="scope">
                    <el-button type="primary" @click="handleEdit(scope.row)" :icon="Edit" circle></el-button>
                    <el-button type="danger" @click="handleDelete(scope.row)" :icon="Delete" circle></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页相关-->
        <!-- @size-change="handleSizeChange"   :page-sizes="pageSizes"单页数据数配置项 -->
        <el-pagination
            style="padding: 10px; background-color: #ffffff"
            :current-page="currentPage"
            :page-sizes="[10]"
            layout="total, sizes,prev, pager, next, jumper"
            :total
            @current-change="handleCurrentChange"
        ></el-pagination>
        <!-- 编辑和增加 -->
        <el-dialog :title="title" v-model="isVisible" draggable>
            <el-form :model="ruleForm" :rules="rules" ref="rule_form" label-width="80px" class="rule_form">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="ruleForm.name" style="width: 30%" />
                </el-form-item>

                <el-form-item label="班级" prop="banji" style="width: 80%">
                    <el-input v-model="ruleForm.banji" />
                </el-form-item>

                <el-form-item label="学号" prop="xuehao" style="width: 50%">
                    <el-input v-model="ruleForm.xuehao" />
                </el-form-item>

                <el-form-item label="邮箱" prop="youxiang" style="width: 80%">
                    <el-input v-model="ruleForm.youxiang" />
                </el-form-item>

                <el-form-item label="方向" prop="fangxiang" style="width: 40%">
                    <el-select v-model="ruleForm.fangxiang" placeholder="请选择方向">
                        <el-option label="前端" value="前端" />
                        <el-option label="后端" value="后端" />
                        <el-option label="UI" value="UI" />
                    </el-select>
                </el-form-item>

                <el-form-item label="介绍" prop="jieshao" style="width: 80%">
                    <el-input v-model="ruleForm.jieshao" />
                </el-form-item>

                <el-form-item v-if="isAdd">
                    <el-button type="primary" @click="submitUser('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
                <el-form-item v-else>
                    <el-button type="primary" @click="resetUser('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<style scoped></style>
