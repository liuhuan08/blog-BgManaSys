import request from './Request'

// 获取首页数据
export const getData = (bloggerId) => {
    return request({
        method: 'get',
        url: '/blog/back/get-statistics-info',
        params: { bloggerId }
    })
}

// 修改博主信息
export const modifyBlogger = (data) => {
    return request({
        method: 'post',
        url: '/blog/back/modify-blogger',
        data
    })
}