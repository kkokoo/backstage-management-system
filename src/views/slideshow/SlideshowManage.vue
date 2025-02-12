<script setup>
import { ref, onMounted } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
// import { useUserStore } from '@/stores'
import { userDelectimagesService, userGetallimagesService, userUploadService } from '@/api/manager'

// const userstore = useUserStore()
// 必须在这里设置token
// const headerObj = ref({
//     token: userstore.token
// })

const isLoading = ref(false)
// 上传
const upload = async (params) => {
    try {
        const formData = new FormData()
        formData.append('file', params.file)
        isLoading.value = true
        await userUploadService(formData)
        await getAllImages()
        isLoading.value = false
        ElMessage({
            type: 'success',
            message: '上传成功'
        })
    } catch (error) {
        console.error('图片上传失败', error)
    }
}
const fileList = ref([])

// 获取
const getAllImages = async () => {
    try {
        const res = await userGetallimagesService()
        const arr = JSON.parse(JSON.stringify(res.data.data).replace(/imagename/g, 'name'))
        fileList.value = arr
    } catch (error) {
        console.error('图片数据获取失败', error)
    }
}

onMounted(() => {
    getAllImages()
})
// 删除

const handleRemove = async (uploadFile) => {
    if (isUpload.value) {
        ElMessageBox.confirm('您确认要删除吗?', '温馨提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(async () => {
                //1.发送删除请求
                await userDelectimagesService({ id: uploadFile.id })
                await getAllImages()
                ElMessage({
                    type: 'success',
                    message: '删除成功'
                })
            })
            .catch(async () => {
                await getAllImages()
                ElMessage({
                    type: 'info',
                    message: '取消删除'
                })
            })
    } else {
        try {
            await userDelectimagesService({ id: uploadFile.id })
        } catch (error) {
            console.error('服务器出错', error)
        }
    }
}
// 预览
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handlePreview = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url
    dialogVisible.value = true
}

// import {ElMessageBox, UploadProps, UploadUserFile} from 'element-plus'
const isUpload = ref(true)
const beforeAvatarUpload = (rawFile) => {
    return new Promise((resolve, reject) => {
        var reader = new FileReader()
        // reader.onload = function (event) {
        //     var txt = event.target.result
        //     var img = document.createElement('img')
        //     img.src = txt
        //     img.onload = function () {
        //         if (img.width > 196 || img.height > 110) {
        //             ElMessage.error('图片尺寸最大为196*110')
        //             return reject(false)
        //         }
        //     }
        // }
        reader.readAsDataURL(rawFile)
        if (rawFile.type !== 'image/png' && rawFile.type !== 'image/jpg' && rawFile.type !== 'image/jpeg') {
            ElMessage.error('图片仅支持jpg、jpeg、png格式!')
            isUpload.value = false
            return reject(false)
        } else if (rawFile.size / 1024 / 1024 > 0.5) {
            ElMessage.error('图片大小不能超过500kb!')
            isUpload.value = false
            return reject(false)
        }
    })
}
</script>

<template>
    <!-- 但此时我们为action填写地址不能不写基本地址而仅写upload，
     要写完整的地址。
     这是因为el-upload上传组件在上传发送请求时，
     不会去使用我们设置的axios，而是在组件内部自己封装了自己的请求方法。
     所以我们必须把地址写完整。
     但是有跨域问题 
    -->
    <!-- v-model:file-list="fileList" 绑定name和URL
        action="https://abmy.online/welcome/guanliyuan/upload" 绑定上传的路径
        :headers="headerObj" 上传路径的请求头（token）
        class="upload-demo" 类名
        :on-preview="handlePreview" 预览
        :on-remove="handleRemove" 移除的方法
        list-type="picture" 列表的方法
        drag 拖拽上传
    -->
    <el-upload v-model:file-list="fileList" v-loading="isLoading" action="" :http-request="upload" class="upload"
        :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" drag multiple
        :before-upload="beforeAvatarUpload" accept="image/jpg, image/jpeg, image/png">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">拖拽图片或 <em>点击上传</em></div>
        <template #tip>
            <div class="el-upload__tip">轮播图的上传大小最好小于500kb</div>
        </template>
    </el-upload>

    <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 820px" />
    </el-dialog>
</template>
