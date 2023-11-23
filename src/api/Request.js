import axios from 'axios'
import Cookies from 'js-cookie'
import local from '@/utils/local'
import router from "@/router/index"

import { Message, MessageBox } from 'element-ui';

axios.defaults.baseURL = 'https://api.excellentlld.com';
axios.defaults.timeout = 10000; // 请求超时时间


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    let token = Cookies.get('blog_t&k')

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
    }else if (res.code === 1 || res.code === 5001) {
        // Message.error(res.msg)
    }else if (res.code === 500) {
        Message.error(res.msg)
    }

    return response;
}, function (error) {
    // 对响应错误做点什么
    console.log(error);
    if (error.response.status === 401) {
        const res = error.response.data
        if (res.code === 401) {
            MessageBox.alert('登录已过期，请重新登录！', '系统提示', {
                confirmButtonText: '确定',
                callback: action => {
                    Cookies.remove('blog_t&k')
                    local.clear()
                    router.push({ path: "/login" })
                    location.reload()
                }
            });
        }
    } else if (error.response.status === 500) {
        MessageBox.alert('服务器异常')
    }
    return Promise.reject(error);
});


export default axios;