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
          <a-tag :color="record.status === 'active' ? 'green' : 'red'">
            {{ record.status === 'active' ? '在职' : '离职' }}
          </a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="viewOfficial(record)">查看</a>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'

const searchText = ref('')
const loading = ref(false)
const officials = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

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

const onSearch = (value) => {
  // 实现搜索逻辑
  console.log('搜索:', value)
}

const handlePageChange = (page) => {
  currentPage.value = page
  // 实现分页加载逻辑
}

const viewOfficial = (record) => {
  // 实现查看官员详情逻辑
  console.log('查看官员:', record)
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
</style>