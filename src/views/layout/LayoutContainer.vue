<script setup>
import { userLogoutService } from '@/api/manager'

import { Management, User, VideoCameraFilled, SwitchButton } from '@element-plus/icons-vue'

import { useUserStore } from '@/stores'
const userStore = useUserStore()

import { useRouter } from 'vue-router'
const router = useRouter()
// import { ElMessage, ElMessageBox } from 'element-plus'，这里不需要是因为用了按需引入elementplus组件的插件
const logout = () => {
    //退出登录
    ElMessageBox.confirm('您确认要退出吗?', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(async () => {
            //退出登录
            //1.发送退出登录请求
            await userLogoutService()
            //2.清空pinia中存储的token以及个人信息
            await userStore.removeToken()
            //3.跳转到登录页面
            router.push('/login')
            ElMessage({
                type: 'success',
                message: '退出登录成功'
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '退出登录无法被服务器接收'
            })
        })
}
</script>

<template>
    <!-- element-plus中的容器 -->
    <el-container class="layout-container">
        <!-- 头部区域 -->
        <el-header>
            <div class="el-header__logo"></div>
            <div><strong style="font-size: 30px">后台管理系统</strong></div>
            <!-- 下拉菜单 -->
            <el-button @click="logout()" :icon="SwitchButton"><span>退出登录</span></el-button>
        </el-header>

        <!-- 下侧主区域 -->
        <el-container>
            <!-- 左侧菜单 -->
            <el-aside width="200px">
                <!-- element-plus的菜单标签 -->
                <el-menu
                    active-text-color="#00000"
                    background-color="#ecf5ff"
                    text-color="#6d6d6e"
                    :default-active="$route.path"
                    style="--el-menu-hover-bg-color: #c6e2ff"
                    router
                >
                    <el-menu-item index="/manage/freshman">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>新生数据管理</span>
                    </el-menu-item>
                    <el-menu-item index="/manage/employment">
                        <el-icon>
                            <Management />
                        </el-icon>
                        <span>就业数据管理</span>
                    </el-menu-item>
                    <el-menu-item index="/manage/slideshow">
                        <el-icon><VideoCameraFilled /></el-icon>
                        <span>轮播图管理</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>

            <el-container>
                <!-- 中间区域 -->
                <el-main style="padding: 30px">
                    <router-view></router-view>
                </el-main>
                <!-- 底部区域 -->
                <el-footer style="height: 50px">前端后台管理</el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>

<style scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #ecf5ff;
        border: solid 1px #d9ecff;
        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-header__logo {
            width: 200px;
            height: 60px;
            background: url('@/assets/logo.png') no-repeat left / 120px auto;
        }

        .el-button {
            width: 90px;
            height: 30px;
        }
    }

    .el-menu-item.is-active {
        background-color: var(--el-color-primary-light-5);
        color: var(--el-menu-active-color);
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>
