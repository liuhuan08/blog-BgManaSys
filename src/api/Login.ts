import request from './Request'

// 登录
export const Login = (data: object) => {
    return request({
        method: 'post',
        url: '/blog/back/login',
        data
    })
}