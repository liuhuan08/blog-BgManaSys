import axios from 'axios'
import local from '@/utils/local'

import Msg from "../utils/msg"

axios.defaults.baseURL = 'http://api.excellentlld.com';
axios.defaults.timeout = 5000; // 请求超时时间


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    let token = local.get('blog_t&k')

    if (token) {
        config.headers.Authorization = 'Bearer ' + token
    }

    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    let res = response.data;

    if (res.code === 0) {
        // Message({
        //     type: 'success',
        //     message: res.msg
        // })
        Msg(`${res.msg}`, 'success', 2000);
    }

    if (res.code === 1 || res.code === 5001) {
        Message.error(res.msg)
    }

    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});


export default axios;