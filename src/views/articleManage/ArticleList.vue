<template>
    <div class="article-list-page">
        <div class="search-section">
            <l-input
                class="search-ipt"
                v-model="articleName"
                :ipt-value="articleName"
                type="text"
                placeholder="请输入文章标题"
                clearable
            >
            </l-input>
            <l-botton
                type="primary"
                size="midle"
                @click="handelSearch"
                style="margin-right: 10px"
            >
                搜索
            </l-botton>
        </div>

        <div class="table-section">
            <table class="table">
                <thead>
                    <tr>
                        <th>序号</th>
                        <th>文章标题</th>
                        <th>文章副标题</th>
                        <th>文章封面</th>
                        <th>创建时间</th>
                        <th>修改时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="v in tableData" :key="v.article_id">
                        <td class="td-num">{{ v.article_id }}</td>
                        <td>{{ v.title }}</td>
                        <td>{{ v.subTitle }}</td>
                        <td class="td-img">
                            <img :src="v.coverUrl" />
                        </td>
                        <td>{{ v.createTime | handelData }}</td>
                        <td>{{ v.updateTime | handelData }}</td>
                        <td class="td-btn">
                            <div class="btn-group">
                                <l-botton
                                    class="btn"
                                    type="primary"
                                    size="mini"
                                    @click="handelEdit(v.article_id)"
                                    style="margin-right: 10px"
                                >
                                    编辑
                                </l-botton>
                                <l-botton
                                    class="btn"
                                    type="danger"
                                    size="mini"
                                    @click="handelDel(v.article_id)"
                                >
                                    删除
                                </l-botton>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="page-section">
            <div>共{{ total }}条{{ Math.ceil(total / limit) }}页</div>
            <div>第{{ page }}页</div>
            <div class="item" @click="goFirst">首页</div>
            <div class="item" @click="goUp">上一页</div>
            <div class="item" @click="goDown">下一页</div>
            <div class="item" @click="goLast">尾页</div>
        </div>
    </div>
</template>

<script>
import { getArticleList, delArticle } from "@/api/article";
import local from "@/utils/local";
import { normalizeDate, normalizeTime } from "../../utils/tools";

import LInput from "@/components/input.vue";
import LBotton from "@/components/botton.vue";

export default {
    data() {
        return {
            articleName: "",
            total: 0,
            limit: 10,
            page: 1,
            sortType: 2,
            tableData: [],
        };
    },
    components: {
        LInput,
        LBotton,
    },
    methods: {
        getData() {
            let bloggerId = local.get("blog_userinfo").bloggerId;
            let data = {
                bloggerId,
                limit: this.limit,
                page: this.page,
                articleTitle: "",
                sortType: this.sortType,
            };
            getArticleList(data).then((res) => {
                if (res.status === 200) {
                    this.tableData = res.data.data.records;
                    this.total = res.data.data.total;
                }
            });
        },
        handelSearch() {},
        handelEdit(id) {
            console.log(id);
            this.$router.push({
                path: "/article/add_modify-article",
                query: {
                    id: id,
                },
            });
        },
        handelDel(id) {
            delArticle(id).then((res) => {
                if (res.status === 200) {
                    this.Msg(res.data.message, "success", 1500);
                    this.getData();
                }
            });
        },
        goFirst() {
            this.page = 1;
            this.getData();
        },
        goUp() {
            if(this.page === 1) return;
            this.page -= 1;
            this.getData();
        },
        goDown() {
            if(this.page === Math.ceil(this.total / this.limit)) return;
            this.page += 1;
            this.getData();
        },
        goLast() {
            this.page = Math.ceil(this.total / this.limit);
            this.getData();
        },
    },
    filters: {
        handelData(val) {
            return normalizeDate(val, "-") + " " + normalizeTime(val);
        },
    },
    created() {
        this.getData();
    },
};
</script>

<style lang="less" scoped>
.article-list-page {
    padding: 20px;
    width: 100%;
    background-color: #fff;

    .search-section {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 20px;
        border-bottom: 1px dashed #ccc;

        .search-ipt {
            width: 300px;
        }
    }

    .table-section {
        margin-top: 20px;
        width: 100%;

        .table {
            width: 100%;
            // border: 1px solid #333;

            th,
            td {
                // width: 10%;
                padding: 10px;
                text-align: center;
                border: 1px solid #ccc;
            }

            .td-num {
                min-width: 60px;
            }

            .td-img {
                width: 121px;

                img {
                    width: 100px;
                    height: 100px;
                }
            }

            .td-btn {
                .btn-group {
                    display: flex;

                    .btn {
                        width: 50px;
                    }
                }
            }
        }
    }

    .page-section {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 20px;
        width: 100%;

        div {
            padding: 5px 10px;
            margin-left: 10px;
        }

        .item {
            background-color: #eee;
            border-radius: 4px;
            cursor: pointer;
            user-select: none;
        }
    }
}
</style>