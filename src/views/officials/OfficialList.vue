<template>
  <div class="official-list">
    <div class="official-header">
      <h2>官员管理</h2>
      <a-space>
        <a-input-search
          v-model:value="searchText"
          placeholder="搜索官员"
          style="width: 200px"
          @search="onSearch"
        />
        <a-button type="primary" @click="showCreateModal" v-if="userRole === 'emperor'">
          <template #icon><PlusOutlined /></template>
          任命官员
        </a-button>
      </a-space>
    </div>

    <a-table
      :columns="columns"
      :data-source="officials"
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
            <a @click="viewOfficial(record)">查看</a>
            <template v-if="userRole === 'emperor' && record.status === 'active'">
              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link" @click.prevent>
                  处置
                  <DownOutlined />
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="handleDismiss(record)">罢黜</a-menu-item>
                    <a-menu-item @click="handleExile(record)">流放</a-menu-item>
                    <a-menu-item @click="handleRetire(record)">退休</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 任命官员对话框 -->
    <a-modal
      v-model:visible="createModalVisible"
      title="任命官员"
      @ok="handleCreateSubmit"
      :confirmLoading="submitLoading"
    >
      <a-form :model="createForm" :rules="rules" ref="createFormRef">
        <a-form-item name="name" label="姓名">
          <a-input v-model:value="createForm.name" placeholder="请输入官员姓名" />
        </a-form-item>
        <a-form-item name="position" label="职位">
          <a-input v-model:value="createForm.position" placeholder="请输入官员职位" />
        </a-form-item>
        <a-form-item name="rank" label="品级">
          <a-select v-model:value="createForm.rank" placeholder="请选择品级">
            <a-select-option value="一品">一品</a-select-option>
            <a-select-option value="二品">二品</a-select-option>
            <a-select-option value="三品">三品</a-select-option>
            <a-select-option value="四品">四品</a-select-option>
            <a-select-option value="五品">五品</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="biography" label="生平">
          <a-textarea
            v-model:value="createForm.biography"
            :rows="4"
            placeholder="请输入官员生平"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 查看官员详情对话框 -->
    <a-modal
      v-model:visible="viewModalVisible"
      :title="currentOfficial.name + ' - 详细信息'"
      :footer="null"
      width="600px"
    >
      <div class="official-detail">
        <div class="official-info">
          <p><strong>姓名：</strong>{{ currentOfficial.name }}</p>
          <p><strong>职位：</strong>{{ currentOfficial.position }}</p>
          <p><strong>品级：</strong>{{ currentOfficial.rank }}</p>
          <p><strong>状态：</strong>
            <a-tag :color="getStatusColor(currentOfficial.status)">
              {{ getStatusText(currentOfficial.status) }}
            </a-tag>
          </p>
        </div>
        <div class="official-biography">
          <p><strong>生平：</strong></p>
          <p>{{ currentOfficial.biography }}</p>
        </div>
        <div class="official-achievements">
          <p><strong>政绩：</strong></p>
          <a-timeline>
            <a-timeline-item v-for="(achievement, index) in currentOfficial.achievements" :key="index">
              {{ achievement.time }} - {{ achievement.content }}
            </a-timeline-item>
          </a-timeline>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, DownOutlined } from '@ant-design/icons-vue'

const userRole = ref(localStorage.getItem('userRole') || '')
const loading = ref(false)
const searchText = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 表格列定义
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '职位',
    dataIndex: 'position',
    key: 'position'
  },
  {
    title: '品级',
    dataIndex: 'rank',
    key: 'rank'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '操作',
    key: 'action'
  }
]

// 默认官员数据
const officials = ref([
  {
    id: 1,
    name: '和珅',
    position: '军机大臣',
    rank: '一品',
    status: 'active',
    biography: '字永源，满洲镶黄旗人。乾隆年间任军机大臣，位极人臣。',
    achievements: [
      { time: '乾隆四十三年', content: '任军机大臣' },
      { time: '乾隆五十年', content: '督办国子监事务' }
    ]
  },
  {
    id: 2,
    name: '刘墉',
    position: '礼部尚书',
    rank: '二品',
    status: 'active',
    biography: '字崇如，号石庵，山东青州府诸城县人。乾隆四十四年进士，历任翰林院编修、侍讲等职。',
    achievements: [
      { time: '乾隆五十二年', content: '任礼部尚书' },
      { time: '乾隆五十五年', content: '整顿科举制度' }
    ]
  },
  {
    id: 3,
    name: '纪晓岚',
    position: '内阁学士',
    rank: '三品',
    status: 'active',
    biography: '名昀，字晓岚，河北献县人。乾隆二十四年进士，官至内阁学士。',
    achievements: [
      { time: '乾隆三十年', content: '参与编纂《四库全书》' },
      { time: '乾隆四十年', content: '任内阁学士' }
    ]
  }
])

// 状态相关
const getStatusColor = (status) => {
  const colors = {
    active: 'green',
    dismissed: 'orange',
    exiled: 'red',
    retired: 'gray'
  }
  return colors[status] || 'default'
}

const getStatusText = (status) => {
  const texts = {
    active: '在职',
    dismissed: '已罢黜',
    exiled: '已流放',
    retired: '已退休'
  }
  return texts[status] || '未知'
}

// 任命官员相关
const createModalVisible = ref(false)
const createForm = reactive({
  name: '',
  position: '',
  rank: undefined,
  biography: ''
})
const createFormRef = ref()
const submitLoading = ref(false)

const showCreateModal = () => {
  createModalVisible.value = true
}

// 查看官员相关
const viewModalVisible = ref(false)
const currentOfficial = ref({})

const viewOfficial = (record) => {
  currentOfficial.value = record
  viewModalVisible.value = true
}

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  position: [
    { required: true, message: '请输入职位', trigger: 'blur' }
  ],
  rank: [
    { required: true, message: '请选择品级', trigger: 'change' }
  ],
  biography: [
    { required: true, message: '请输入生平', trigger: 'blur' }
  ]
}

// 搜索功能
const onSearch = (value) => {
  loading.value = true
  const searchValue = value.toLowerCase()
  const filteredOfficials = officials.value.filter(official => {
    return official.name.toLowerCase().includes(searchValue) ||
           official.position.toLowerCase().includes(searchValue) ||
           official.biography.toLowerCase().includes(searchValue)
  })
  
  if (filteredOfficials.length === 0) {
    message.info('未找到匹配的官员')
  }
  
  officials.value = filteredOfficials
  total.value = filteredOfficials.length
  currentPage.value = 1
  loading.value = false
}

// 分页处理
const handlePageChange = (page) => {
  currentPage.value = page
  // TODO: 加载对应页数据
}

// 提交任命官员
const handleCreateSubmit = () => {
  createFormRef.value.validate().then(() => {
    submitLoading.value = true
    const newOfficial = {
      id: officials.value.length + 1,
      ...createForm,
      status: 'active',
      achievements: []
    }
    officials.value.unshift(newOfficial)
    message.success('官员任命成功')
    createModalVisible.value = false
    submitLoading.value = false
    createFormRef.value.resetFields()
  })
}

// 处置官员
const handleDismiss = (record) => {
  const officialIndex = officials.value.findIndex(o => o.id === record.id)
  if (officialIndex !== -1) {
    officials.value[officialIndex] = {
      ...officials.value[officialIndex],
      status: 'dismissed'
    }
    message.success(`已罢黜${record.name}`)
  }
}

const handleExile = (record) => {
  const officialIndex = officials.value.findIndex(o => o.id === record.id)
  if (officialIndex !== -1) {
    officials.value[officialIndex] = {
      ...officials.value[officialIndex],
      status: 'exiled'
    }
    message.success(`已流放${record.name}`)
  }
}

const handleRetire = (record) => {
  const officialIndex = officials.value.findIndex(o => o.id === record.id)
  if (officialIndex !== -1) {
    officials.value[officialIndex] = {
      ...officials.value[officialIndex],
      status: 'retired'
    }
    message.success(`${record.name}已荣休`)
  }
}
</script>

<style scoped>
.official-list {
  padding: 24px;
}

.official-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.official-detail {
  padding: 16px;
}

.official-info {
  margin-bottom: 24px;
}

.official-biography {
  margin-bottom: 24px;
  white-space: pre-wrap;
}

.official-achievements {
  padding: 16px;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>