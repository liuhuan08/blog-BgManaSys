import request from './Request'

// 获取文章列表
export const getArticleList = (data: object) => {
    return request({
        method: 'post',
        url: '/blog/front/get-article',
        data
    })
}

// 获取文章详情
export const getArticleInfoData = (id: number) => {
    return request({
        method: 'get',
        url: '/blog/front/get-article-info',
        params: { id }
    })
}

// 新增文章
export const addArticle = (data: object) => {
    return request({
        method: 'post',
        url: '/blog/back/add-article',
        data
    })
}

// 编辑文章
export const editArticle = (data: object) => {
    return request({
        method: 'post',
        url: '/blog/back/edit-article',
        data
    })
}

// 删除文章
export const delArticle = (articleId: number) => {
    return request({
        method: 'post',
        url: '/blog/back/delete-article',
        data: { articleId }
    })
}

// 获取标签列表
export const getArticleTagList = (bloggerId: number) => {
    return request({
        method: 'get',
        url: '/blog/front/get-article-tag',
        params: { bloggerId }
    })
}

// 添加标签列表
export const addArticleTagList = (data: object) => {
    return request({
        method: 'post',
        url: '/blog/back/add-articletag',
        data
    })
}