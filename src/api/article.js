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

// 获取标签列表
export const getArticleTagList = (bloggerId) => {
    return request({
        method: 'get',
        url: '/blog/back/get-article-tag',
        params: { bloggerId }
    })
}