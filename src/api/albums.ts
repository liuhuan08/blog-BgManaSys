import request from './Request'

// 上传图片
export const uploadImgApi = (data: object) => {
    return request({
        method: 'post',
        url: '/blog/back/upload-image',
        headers: { "Content-Type": "multipart/form-data" },
        data
    })
}

// 获取相册列表
export const getAlbumsList = (data: object) => {
    return request({
        method: 'post',
        url: '/blog/front/get-albums',
        data
    })
}

// 新增相册
export const addAlbums = (data: object) => {
    return request({
        method: 'post',
        url: '/blog/back/add-album',
        data
    })
}

// 删除相册
export const delAlbums = (data: object) => {
    return request({
        method: 'post',
        url: '/blog/back/delete-album',
        data
    })
}

// 编辑相册
export const editAlbums = (data: object) => {
    return request({
        method: 'post',
        url: '/blog/back/edit-album',
        data
    })
}

// 获取相册图片
export const getAlbumImgs = (data: object) => {
    return request({
        method: 'post',
        url: '/blog/front/get-album-imgs',
        data
    })
}

// 相册新增图片
export const albumAddImgs = (data: object) => {
    return request({
        method: 'post',
        url: '/blog/back/post-album',
        data
    })
}

// 删除相册图片
export const albumDelImgs = (data: object) => {
    return request({
        method: 'post',
        url: '/blog/back/delete-album-imgs',
        data
    })
}