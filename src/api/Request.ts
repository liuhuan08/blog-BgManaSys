import axios from 'axios'
import local from '@/utils/local'
import { ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import router from '../router';

axios.defaults.baseURL = 'https://api.excellentlld.com';
axios.defaults.timeout = 10000; // 请求超时时间


// 添加请求拦截器
axios.interceptors.request.use(function (config: any) {
	// 在发送请求之前做些什么
	let token = local.get('blog_t&k');

	if (token) {
		config.headers.Authorization = 'Bearer ' + token;
	}

	return config;
}, function (error: any) {
	// 对请求错误做些什么
	return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response: any) {
	// 对响应数据做点什么
	let res = response.data;

	if (res.code === 0) {
		// Message({
		//     type: 'success',
		//     message: res.msg
		// })
		// Msg(`${res.msg}`, 'success', 2000);
	}

	if (res.code === 1 || res.code === 5001) {
		// Message.error(res.msg)
		// Msg(`${res.msg}`, 'success', 2000);
	}

	return response;
}, function (error: any) {
	if (error.response.status === 401) {
		ElMessageBox.alert('您的登录状态已失效，请重新登录', '系统提示', {
			confirmButtonText: 'OK',
			callback: (action: Action) => {
				local.clear();
				router.push('/login')
			},
		})
	}
	// 对响应错误做点什么
	return Promise.reject(error);
});


export default axios;