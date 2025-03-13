<template>
  <div class="profile-container">
    <h2>个人信息</h2>
    <a-card class="profile-card">
      <div class="avatar-container">
        <img
          v-if="userInfo.role === 'emperor'"
          src="../assets/images/emperor-avatar.svg"
          alt="皇帝头像"
          class="avatar-image animate-fade-in"
        />
        <a-avatar v-else :size="128" icon="user" class="animate-fade-in" />
      </div>
      <a-descriptions title="基本信息" bordered>
        <a-descriptions-item label="用户名">
          {{ userInfo.username }}
        </a-descriptions-item>
        <a-descriptions-item label="角色">
          {{ userInfo.role === 'emperor' ? '皇帝' : '大臣' }}
        </a-descriptions-item>
        <a-descriptions-item label="职位">
          {{ userInfo.position || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="品级">
          {{ userInfo.rank || '无' }}
        </a-descriptions-item>
      </a-descriptions>

      <a-divider />

      <div class="profile-actions">
        <a-button type="primary" @click="showChangePasswordModal">
          修改密码
        </a-button>
      </div>
    </a-card>

    <a-modal
      v-model:visible="changePasswordVisible"
      title="修改密码"
      @ok="handleChangePassword"
      :confirmLoading="loading"
    >
      <a-form :model="formState" layout="vertical">
        <a-form-item
          label="原密码"
          name="oldPassword"
          :rules="[{ required: true, message: '请输入原密码' }]"
        >
          <a-input-password v-model:value="formState.oldPassword" />
        </a-form-item>
        <a-form-item
          label="新密码"
          name="newPassword"
          :rules="[{ required: true, message: '请输入新密码' }]"
        >
          <a-input-password v-model:value="formState.newPassword" />
        </a-form-item>
        <a-form-item
          label="确认新密码"
          name="confirmPassword"
          :rules="[{ required: true, message: '请确认新密码' }]"
        >
          <a-input-password v-model:value="formState.confirmPassword" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'

const userInfo = reactive({
  username: localStorage.getItem('username') || '未知用户',
  role: localStorage.getItem('userRole') || 'official',
  position: localStorage.getItem('userPosition') || '无',
  rank: localStorage.getItem('userRank') || '无'
})

const changePasswordVisible = ref(false)
const loading = ref(false)

const formState = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showChangePasswordModal = () => {
  changePasswordVisible.value = true
}

const handleChangePassword = () => {
  if (formState.newPassword !== formState.confirmPassword) {
    message.error('两次输入的新密码不一致')
    return
  }

  loading.value = true
  // 实现修改密码的逻辑
  setTimeout(() => {
    message.success('密码修改成功')
    changePasswordVisible.value = false
    loading.value = false
    // 清空表单
    formState.oldPassword = ''
    formState.newPassword = ''
    formState.confirmPassword = ''
  }, 1000)
}
</script>

<style scoped>
.profile-container {
  padding: 24px;
}

.profile-card {
  max-width: 800px;
  margin: 24px auto;
}

.profile-actions {
  text-align: center;
}

.avatar-container {
  text-align: center;
  margin-bottom: 24px;
}

.avatar-image {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  object-fit: cover;
  transition: all 0.3s ease;
  cursor: pointer;
}

.avatar-image:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.avatar-image:active {
  transform: scale(0.95);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}
</style>