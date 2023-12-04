<template>
  <div class="search_container">
    <el-input v-model="articleTitle" placeholder="请输入文章名称" />
    <div>
      <el-button type="primary" @click="getData">搜索</el-button>
      <el-button type="info" @click="() => { articleTitle = ''; getData() }">重置</el-button>
    </div>
  </div>
  <div class="table_container">
    <el-table :data="tableData" height="100%" stripe border>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="title" label="文章标题" width="180" />
      <el-table-column prop="subTitle" label="文章副标题" />
      <el-table-column prop="tags" label="文章类型" min-width="120">
        <template #default="scope">
          <el-tag v-if="scope.row.tags[0]">{{ scope.row.tags[0].tagName }}</el-tag>
          <el-tag v-if="scope.row.tags[1]" style="margin-left: 5px;">{{ scope.row.tags[1].tagName }}</el-tag>
          <span v-if="scope.row.tags.length > 2" style="margin-left: 5px;">...</span>
        </template>
      </el-table-column>
      <el-table-column prop="coverUrl" label="文章封面" width="120">
        <template #default="scope">
          <img :src="scope.row.coverUrl" style="width: 100%;">
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="170">
        <template #default="scope">
          <span>{{ handelData(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="修改时间" width="170">
        <template #default="scope">
          <span>{{ handelData(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="110">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-popconfirm title="你确认删除这条文章吗？" @confirm="handleDel(scope.row)">
            <template #reference>
              <el-button link type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div class="page_container">
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 50]"
      layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="getData" @current-change="getData" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getArticleList, delArticle } from "@/api/article";
import local from "@/utils/local";
import { normalizeDate, normalizeTime } from "@/utils/tools";

const router = useRouter();

let articleTitle = ref('');
let tableData = ref([]);
let currentPage = ref(1);
let pageSize = ref(10);
let sortType = ref(1);
let total = ref(0);

const getData = () => {
  let bloggerId = local.get("blog_userinfo").bloggerId;
  let data = {
    bloggerId,
    limit: pageSize.value,
    page: currentPage.value,
    articleTitle: articleTitle.value,
    sortType: sortType.value,
  };
  getArticleList(data).then((res) => {
    if (res.status === 200) {
      tableData.value = res.data.data.records;
      total = res.data.data.total;
    }
  });
}


const handelData = (val: any) => {
  return normalizeDate(val, "-") + " " + normalizeTime(val);
}

const handleEdit = (row: any) => {
  router.push({
    path: '/articles/modify-article',
    query: {
      id: row.article_id
    }
  })
}
const handleDel = (row: any) => {
  delArticle(row.article_id).then((res) => {
    if (res.status === 200) {
      ElMessage({ message: res.data.message, type: 'success' })
      getData();
    }
  });
}

getData();
</script>

<style lang="scss" scoped>
.search_container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  .el-input {
    width: 200px;
  }
}

.table_container {
  width: 100%;
  height: calc(100% - 104px);

  .el-table {
    width: 100%;
  }
}

.page_container {
  margin-top: 20px;
  height: 32px;

  .el-pagination {
    justify-content: flex-end;
  }
}
</style>