<template>
  <div class="memorial-list">
    <div class="memorial-header">
      <h2>奏章管理</h2>
      <a-space>
        <a-input-search
          v-model:value="searchText"
          placeholder="搜索奏章"
          style="width: 200px"
          @search="onSearch"
        />
        <a-button type="primary" @click="showCreateModal" v-if="userRole !== 'emperor'">
          <template #icon><PlusOutlined /></template>
          上呈奏章
        </a-button>
      </a-space>
    </div>

    <a-table
      :columns="columns"
      :data-source="memorials"
      :loading="loading"
      :pagination="{
        total: total,
        current: currentPage,
        pageSize: pageSize,
        onChange: handlePageChange
      }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">
            {{ getStatusText(record.status) }}
          </a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="viewMemorial(record)">查看</a>
            <a-divider type="vertical" />
            <a @click="handleMemorial(record)" v-if="userRole === 'emperor' && record.status === 'pending'">
              批复
            </a>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 创建奏章对话框 -->
    <a-modal
      v-model:visible="createModalVisible"
      title="上呈奏章"
      @ok="handleCreateSubmit"
      :confirmLoading="submitLoading"
    >
      <a-form :model="createForm" :rules="rules" ref="createFormRef">
        <a-form-item name="title" label="标题">
          <a-input v-model:value="createForm.title" placeholder="请输入奏章标题" />
        </a-form-item>
        <a-form-item name="content" label="内容">
          <a-textarea
            v-model:value="createForm.content"
            :rows="4"
            placeholder="请输入奏章内容"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 查看奏章对话框 -->
    <a-modal
      v-model:visible="viewModalVisible"
      :title="currentMemorial.title"
      :footer="null"
      width="600px"
    >
      <div class="memorial-detail">
        <div class="memorial-info">
          <p><strong>提交人：</strong>{{ currentMemorial.author }}</p>
          <p><strong>提交时间：</strong>{{ currentMemorial.createTime }}</p>
          <p><strong>状态：</strong>
            <a-tag :color="getStatusColor(currentMemorial.status)">
              {{ getStatusText(currentMemorial.status) }}
            </a-tag>
          </p>
        </div>
        <div class="memorial-content">
          <p><strong>奏章内容：</strong></p>
          <p>{{ currentMemorial.content }}</p>
        </div>
        <div class="memorial-reply" v-if="currentMemorial.reply">
          <p><strong>批复内容：</strong></p>
          <p>{{ currentMemorial.reply }}</p>
        </div>
      </div>
    </a-modal>

    <!-- 批复奏章对话框 -->
    <a-modal
      v-model:visible="replyModalVisible"
      title="批复奏章"
      @ok="handleReplySubmit"
      :confirmLoading="submitLoading"
    >
      <a-form :model="replyForm" :rules="rules" ref="replyFormRef">
        <a-form-item name="reply" label="批复内容">
          <a-textarea
            v-model:value="replyForm.reply"
            :rows="4"
            placeholder="请输入批复内容"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'

const userRole = ref(localStorage.getItem('userRole') || '')
const loading = ref(false)
const searchText = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 表格列定义
const columns = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '提交人',
    dataIndex: 'author',
    key: 'author',
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 模拟数据
const memorials = ref([
  {
    id: 1,
    title: '关于修建水利工程的奏章',
    author: '李大人',
    content: '臣发现江南一带水患频发，建议修建水利工程...',
    createTime: '2024-01-15',
    status: 'pending',
  },
  {
    id: 2,
    title: '关于科举改革',
    author: '张大人',
    content: '为提高科举考试公平性，臣建议改革考试制度...',
    createTime: '2024-01-14',
    status: 'approved',
    reply: '准奏。着即改革科举制度，确保公平公正。',
  },
])

// 状态相关
const getStatusColor = (status) => {
  const colors = {
    pending: 'gold',
    approved: 'green',
    rejected: 'red',
  }
  return colors[status] || 'default'
}

const getStatusText = (status) => {
  const texts = {
    pending: '待批复',
    approved: '已批准',
    rejected: '已驳回',
  }
  return texts[status] || '未知'
}

// 创建奏章相关
const createModalVisible = ref(false)
const createForm = reactive({
  title: '',
  content: '',
})
const createFormRef = ref()

const showCreateModal = () => {
  createModalVisible.value = true
}

// 查看奏章相关
const viewModalVisible = ref(false)
const currentMemorial = ref({})

const viewMemorial = (record) => {
  currentMemorial.value = record
  viewModalVisible.value = true
}

// 批复奏章相关
const replyModalVisible = ref(false)
const replyForm = reactive({
  reply: '',
})
const replyFormRef = ref()
const submitLoading = ref(false)

const handleMemorial = (record) => {
  currentMemorial.value = record
  replyModalVisible.value = true
}

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' },
  ],
  reply: [
    { required: true, message: '请输入批复内容', trigger: 'blur' },
  ],
}

// 搜索功能
const onSearch = (value) => {
  loading.value = true
  if (!value.trim()) {
    // 当搜索框为空时，重置显示所有数据
    memorials.value = [
      {
        id: 1,
        title: '关于修建水利工程的奏章',
        author: '李大人',
        content: '臣发现江南一带水患频发，建议修建水利工程...',
        createTime: '2024-01-15',
        status: 'pending',
      },
      {
        id: 2,
        title: '关于科举改革建议',
        author: '张大人',
        content: '为提高科举考试公平性，臣建议改革考试制度...',
        createTime: '2024-01-14',
        status: 'approved',
        reply: '准奏。着即改革科举制度，确保公平公正。',
      },
    ]
    total.value = memorials.value.length
    currentPage.value = 1
    loading.value = false
    return
  }
  
  const searchValue = value.toLowerCase()
  const filteredMemorials = memorials.value.filter(memorial => {
    return memorial.title.toLowerCase().includes(searchValue) ||
           memorial.author.toLowerCase().includes(searchValue) ||
           memorial.content.toLowerCase().includes(searchValue)
  })
  
  if (filteredMemorials.length === 0) {
    message.info('未找到匹配的奏章')
  }
  
  memorials.value = filteredMemorials
  total.value = filteredMemorials.length
  currentPage.value = 1
  loading.value = false
}

// 分页处理
const handlePageChange = (page) => {
  currentPage.value = page
  // TODO: 加载对应页数据
}

// 提交创建奏章
const handleCreateSubmit = () => {
  createFormRef.value.validate().then(() => {
    submitLoading.value = true
    // TODO: 调用创建奏章API
    setTimeout(() => {
      message.success('奏章提交成功')
      createModalVisible.value = false
      submitLoading.value = false
      // 重置表单
      createFormRef.value.resetFields()
    }, 1000)
  })
}

// 提交批复
const handleReplySubmit = () => {
  replyFormRef.value.validate().then(() => {
    submitLoading.value = true
    // 更新当前奏章的状态和批复内容
    const memorialIndex = memorials.value.findIndex(m => m.id === currentMemorial.value.id)
    if (memorialIndex !== -1) {
      const updatedMemorial = {
        ...memorials.value[memorialIndex],
        status: 'approved',
        reply: replyForm.reply
      }
      memorials.value[memorialIndex] = updatedMemorial
      // 更新当前查看的奏章信息
      currentMemorial.value = updatedMemorial
      message.success('批复成功')
      replyModalVisible.value = false
      submitLoading.value = false
      // 重置表单
      replyFormRef.value.resetFields()
    } else {
      message.error('批复失败：未找到对应奏章')
      submitLoading.value = false
    }
  })
}
</script>

<style scoped>
.memorial-list {
  padding: 24px;
}

.memorial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.memorial-detail {
  padding: 16px;
}

.memorial-info {
  margin-bottom: 24px;
}

.memorial-content {
  margin-bottom: 24px;
  white-space: pre-wrap;
}

.memorial-reply {
  padding: 16px;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>