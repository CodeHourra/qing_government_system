<template>
  <a-layout class="dashboard-layout">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo">
        <span v-if="!collapsed">大清政务系统</span>
        <span v-else>大清</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
      >
        <a-menu-item key="memorials" @click="() => router.push('/dashboard/memorials')">
          <template #icon>
            <FileTextOutlined />
          </template>
          <span>奏章管理</span>
        </a-menu-item>
        <a-menu-item key="officials" @click="() => router.push('/dashboard/officials')">
          <template #icon>
            <TeamOutlined />
          </template>
          <span>官员管理</span>
        </a-menu-item>
        <a-menu-item key="profile" @click="() => router.push('/dashboard/profile')">
          <template #icon>
            <UserOutlined />
          </template>
          <span>个人信息</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header">
        <div class="header-right">
          <a-dropdown>
            <a class="user-dropdown" @click.prevent>
              <img
                v-if="userRole === 'emperor'"
                src="../assets/images/emperor-avatar.svg"
                alt="皇帝头像"
                class="header-avatar"
              />
              <UserOutlined v-else />
              <span class="username">{{ userRole === 'emperor' ? '皇帝' : '大臣' }}</span>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile" @click="() => router.push('/dashboard/profile')">
                  <UserOutlined />
                  <span>个人信息</span>
                </a-menu-item>
                <a-menu-item key="logout" @click="handleLogout">
                  <LogoutOutlined />
                  <span>退出登录</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const collapsed = ref(false)
const selectedKeys = ref(['memorials'])
const userRole = ref(localStorage.getItem('userRole') || '')

onMounted(() => {
  const path = route.path.split('/')
  if (path.length > 2) {
    selectedKeys.value = [path[2]]
  }
})

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  router.push('/login')
}
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
}

.logo {
  height: 32px;
  margin: 16px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  line-height: 32px;
  white-space: nowrap;
  overflow: hidden;
}

.header {
  background: #fff;
  padding: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-right {
  margin-right: 24px;
}

.user-dropdown {
  color: rgba(0, 0, 0, 0.85);
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  height: 100%;
}

.username {
  margin-left: 8px;
}

.header-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 4px;
}

.content {
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
}
</style>