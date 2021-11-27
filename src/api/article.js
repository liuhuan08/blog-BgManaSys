import request from './Request'

// 获取文章列表
export const getArticleList = (data) => {
    return request({
        method: 'post',
        url: '/blog/front/get-article',
        data
    })
}

// 获取文章详情
export const getArticleInfoData = (id) => {
    return request({
        method: 'get',
        url: '/blog/front/get-article-info',
        params: { id }
    })
}

// 新增文章
export const addArticle = (data) => {
    return request({
        method: 'post',
        url: '/blog/back/add-article',
        data
    })
}

// 编辑文章
export const editArticle = (data) => {
    return request({
        method: 'post',
        url: '/blog/back/edit-article',
        data
    })
}

// 删除文章
export const delArticle = (articleId) => {
    return request({
        method: 'post',
        url: '/blog/back/delete-article',
        data: { articleId }
    })
}

// 获取标签列表
export const getArticleTagList = (bloggerId) => {
    return request({
        method: 'get',
        url: '/blog/back/get-article-tag',
        params: { bloggerId }
    })
}

// 添加标签列表
export const addArticleTagList = (data) => {
    return request({
        method: 'post',
        url: '/blog/back/add-articletag',
        data
    })
}