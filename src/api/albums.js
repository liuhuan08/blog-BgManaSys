import request from './Request'

// 获取文章列表
export const getAlbumsList = (bloggerId) => {
    return request({
        method: 'get',
        url: '/blog/front/get-albums',
        params: { bloggerId }
    })
}
