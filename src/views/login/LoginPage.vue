<script setup>
import { userLoginService } from '@/api/manager'
import { useUserStore } from '@/stores'
import { User, Lock } from '@element-plus/icons-vue'
//这边不可以引入，不然ElMessage.success('登录成功')会出错（因为图标组件要在上面引入）
// 因为我们使用了默认引入的组件
// import { ElMessage } from 'element-plus'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
// 整个用于提交的数据对象
const formModel = ref({
    name: '',
    password: ''
})
const form = ref()
//整个表单的效验规则
const rules = {
    name: [
        // 非空校验 required:true  message消息提示， trigger失去焦点时进行校验blur，更改值时使用change
        { required: true, message: '请输入用户名', trigger: 'blur' },
        // 长度校验
        { min: 5, max: 20, message: '用户名必须是 5-20位 的字符', trigger: 'blur' }
    ],
    password: [
        //非空校验
        { required: true, message: '请输入密码', trigger: 'blur' },
        //正则校验
        { pattern: /^\S{6,15}$/, message: '密码必须是6-15位非空字符', trigger: 'blur' }
    ]
    //还有一个自定义校验 => 自己写逻辑校验
    // validator:(rule,value,callback)
    // rule 当前校验规则相关的信息
    // value 所校验的表单元素目前的表单值
    // callback 无论成功还是失败，都需要你callback回调
    // callback() 校验成功
    // callback(new Error(错误信息)) 校验失败
}
// 点击登录时进行一次校验
// 这里必须进行异步操作，要等到效验完成了，再进行下一步操作
const userStore = useUserStore()
const router = useRouter()
const login = async () => {
    await form.value.validate()
    const res = await userLoginService(formModel.value)
    // res中的数据已经有token了
    userStore.setToken(res.data.data)
    ElMessage.success('登录成功')
    router.push('/manage/freshman')
}

//点击回车键登录
const keyDown = (e) => {
    if (e.keyCode == 13 || e.keyCode == 100) {
        login()
    }
}
onMounted(() => {
    //绑定监听事件
    window.addEventListener('keydown', keyDown)
})

onUnmounted(() => {
    //销毁事件
    window.removeEventListener('keydown', keyDown)
})
</script>

<template>
    <!-- el-row表示一行 一行分成24份
     el-col表示列，:offset="3"代表一行中，左侧margin份数 
     
     el-form 表示整个表单
     el-form-item 表单的一行
     el-input 表单的元素（输入框）

     查看文档，我们知道要绑定才可以进行输入（缺一不可）
     el-form => :model="ruleForm" 绑定整个form的数据对象
     el-form => :rule="rules" 绑定的整个rules规则对象
     表单元素 => v-model="ruleForm.xxx" 给表单元素，绑定form子属性
     el-form-item => prop="xxx" 配置生效的是哪个效验规则
     -->
    <el-row class="login-page">
        <el-col class="bg" :span="11" :offset="1"></el-col>
        <el-col class="bj" :span="11">
            <el-form :model="formModel" :rules="rules" ref="form" class="form" size="large" autocomplete="off">
                <el-form-item class="title">
                    <h1>后台管理登录</h1>
                </el-form-item>
                <el-form-item prop="name">
                    <el-input v-model="formModel.name" :prefix-icon="User" placeholder="请输入用户名"> </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="formModel.password" :prefix-icon="Lock" type="password" placeholder="请输入密码"> </el-input>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login" @keydown.enter="keyDown">登录</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style scoped>
.login-page {
    height: 100vh;
    background-color: #acd0f2;
}

.bg {
    background: center / 100% 90% url('../../assets/BackgroundImage.png') no-repeat;
}

.bj {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    --webkit-user-select: none;
    align-content: stretch;
    align-items: center;
    justify-content: space-around;
    margin-top: 5vh;
    height: 90vh;
    background-color: rgba(255, 255, 255, 0.7);
}

.form {
    display: flex;
    --webkit-user-select: none;
    align-items: center;
    flex-direction: column;
    flex-wrap: nowrap;
    width: 400px;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 15px;
}

.button {
    width: 100%;
}
</style>
