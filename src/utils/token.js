// 此文件->封装3个方法->专门用于操作token的
const key = 'geek-itheima'
// 设置token
export function setToken(token) {
    localStorage.setItem(key,token)
}
// 删除touken
export function removeToken() {
    localStorage.removeItem(key)
}

// 获取
export const getToken = () => localStorage.getItem(key)