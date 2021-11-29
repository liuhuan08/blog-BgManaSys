import request from './Request'

// 获取相册列表
export const getAlbumsList = (bloggerId) => {
    return request({
        method: 'get',
        url: '/blog/front/get-albums',
        params: { bloggerId }
    })
}

// 新增相册
export const addAlbums = (data) => {
    return request({
        method: 'post',
        url: '/blog/back/add-album',
        data
    })
}

// 删除相册
export const delAlbums = (data) => {
    return request({
        method: 'post',
        url: '/blog/back/delete-album',
        data
    })
}

// 编辑相册
export const editAlbums = (data) => {
    return request({
        method: 'post',
        url: '/blog/back/edit-album',
        data
    })
}