<template>
  <div class="profile-container">
    <h2>个人信息</h2>
    <a-card class="profile-card">
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
  username: '用户名',
  role: 'official',
  position: '礼部尚书',
  rank: '正一品'
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
</style>