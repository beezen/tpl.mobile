/* eslint-disable */
import axios from 'axios';
import qs from 'qs';
import {
    Toast
} from 'antd-mobile';
import {
    baseURL,
    definedEnv
} from "commons/config";

import { getQuery } from "clearlake"

const isMock = !!getQuery('mock') || /mock/ig.test(baseURL);
/**
 * 公用的ajax实例
 */
let _ajax = axios.create({
    baseURL: definedEnv == 'dev' ? (getQuery('api') || (isMock ? "" : baseURL) || window.location.origin) : baseURL,
    timeout: 30000,
    withCredentials: true,
});

let pending = []; // 申明一个数组用于存储每个请求的取消函数和ajax标识
let CancelToken = axios.CancelToken;
let removePending = (config, f) => { // 删除暂存ajax信息
    let flagUrl = config.method + '&' + config.url.replace(config.baseURL, '').replace(/^\/*/,"") + '&' + (typeof config.data == "string" ? config.data : JSON.stringify(config.data))
    if (pending.indexOf(flagUrl) !== -1) {
        if (f) {
            f() // 执行取消操作
        } else {
            pending.splice(pending.indexOf(flagUrl), 1) // 把这条记录从数组中移除
        }
    } else {
        if (f) {
            pending.push(flagUrl)
        }
    }
}
// 添加请求发送拦截器
_ajax.interceptors.request.use((config) => {
    if (config.method === 'post') { // 添加请求锁
        config.cancelToken = new CancelToken((c) => {
            removePending(config, c)
        })
    }
    // 在发送请求之前做些什么
    config.headers = Object.assign({
        'Content-Type': 'application/json'
    }, JSON.parse(sessionStorage.getItem("appHeader") || '{}'), config.headers); // 获取app请求头

    return config;
}, (error) => {
    Toast.fail(definedEnv == "prd" ? '网络连接超时，请稍后重试' : `前端接口异常：${error}`)
    return Promise.reject(error)
});

// 添加请求返回拦截器
_ajax.interceptors.response.use((response) => {
    const cfg = response.config;
    if (/post/i.test(cfg.method)) { // 删除请求锁
        removePending(cfg)
    }
    let res = response.data;
    if (res && res.status) {
        Toast.info('网络连接超时，请稍后重试');
        return Promise.reject(res);
    }

    if (res.code == 0) {
        cfg.success && cfg.success(res.data, res);
        return Promise.resolve(res.data);
    } else {
        if (res.code == 10001) {
            Toast.hide();
            Toast.fail("请您登录后再做尝试", 1, () => {
                logout().then(() => isLogin());
            });
        } else if (res.code == 10002) {
            Toast.hide();
            Toast.fail("权限不够，无法访问当前页面。");
        } else if (res.code > 0) {
            Toast.fail(res.message);
        } else if (res.code < 0) {
            Toast.fail("网络异常，请稍后重试");
        }
        cfg.error && cfg.error(res.message, res);
        return Promise.reject(res);
    }
}, (error) => {
    Toast.fail(definedEnv == "prd" ? '网络连接超时，请稍后重试' : `后端接口异常：${error}`)
    if (/post/i.test(error.config.method)) { // 删除请求锁
        removePending(error.config)
    }
    return Promise.reject(error)
});

/**
 * ajax 请求
 * @param options
 * @example ajax({url: "", method: "get", data: {a: 1} }).then(data => console.log(data))
 */
export function ajax(options) {
    if (definedEnv == 'dev' && isMock) {
        options.method = "get";
        options.url = options.url.replace('.json', '') + '.json';
    }

    options.method = (options.method || options.type || (options.data == null ? "get" : "post")).toLocaleLowerCase();
    options.contentType = options.contentType || 'application/x-www-form-urlencoded';
    options.headers = Object.assign({}, options.headers, {
        'Content-Type': options.contentType
    });

    if (options.cleanData !== false && options.data != null) {
        cleanData(options.data);
    }
    // 是否扁平化数据，默认为true
    if (!('flattenData' in options)) {
        options.flattenData = true;
    }
    if (options.flattenData && Object.prototype.toString.call(options.data) === '[object Object]' && !(options.data instanceof FormData)) {
        const data = options.data;
        options.data = {};
        for (const key in data) {
            const value = data[key];
            if (Object.prototype.toString.call(value) === '[object Object]') {
                options.data = {
                    ...options.data,
                    ...value
                };
            } else {
                options.data[key] = value
            }
        }
    }

    switch (options.method.toLocaleLowerCase()) {
        case 'get':
            options.params = options.data;
            break;
        case 'post':
            // 转表单提交
            if (options.contentType === 'application/x-www-form-urlencoded' && !(options.data instanceof FormData)) {
                options.data = qs.stringify(options.data);
            }
            break;
    }
    return _ajax(options)
}

/**
 * 数据格式化
 * @param 入参对象
 */
function cleanData(obj) {
    if (obj && typeof obj === "object") {
        if (Array.isArray(obj)) {
            for (const item of obj) {
                cleanData(item);
            }
        } else {
            for (const key in obj) {
                let value = obj[key];
                if (typeof value === "string") obj[key] = value = value.trim();
                if (value === undefined || value === "") {
                    delete obj[key];
                } else {
                    cleanData(value);
                }
            }
        }
    }
}