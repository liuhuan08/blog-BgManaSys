import request from './Request'

// 获取相册列表
export const getAlbumsList = (data) => {
    return request({
        method: 'post',
        url: '/blog/front/get-albums',
        data
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

// 获取相册图片
export const getAlbumImgs = (data) => {
    return request({
        method: 'post',
        url: '/blog/front/get-album-imgs',
        data
    })
}

// 相册新增图片
export const albumAddImgs = (data) => {
    return request({
        method: 'post',
        url: '/blog/back/post-album',
        data
    })
}

// 删除相册图片
export const albumDelImgs = (data) => {
    return request({
        method: 'post',
        url: '/blog/back/delete-album-imgs',
        data
    })
}