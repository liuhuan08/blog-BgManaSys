import request from './Request'

// 获取文章列表
export const getArticleList = (data) => {
    return request({
        method: 'post',
        url: '/blog/front/get-article',
        headers: {'Content-Type': 'application/json'},
        data
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