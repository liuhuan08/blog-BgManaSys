import request from './Request'

// 登录
export const Login = (data) => {
    return request({
        method: 'post',
        url: '/blog/back/login',
        data
    })
}