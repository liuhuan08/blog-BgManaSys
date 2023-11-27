/* 
    工具函数
*/

/* 补零 */
export const padZero = (n) => {
    return n < 10 ? '0' + n : n
}


/* 日期处理 */
export const normalizeDate = (time, split) => {
    let date = new Date(time)

    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()

    return [year, month, day].map(function (v) {
        return padZero(v)
    }).join(split)
}


// 时间处理
export const normalizeTime = (time) => {
    let date = new Date(time)

    let h = date.getHours()
    let m = date.getMinutes()
    let s = date.getSeconds()

    return [h, m, s].map(function (v) {
        return padZero(v)
    }).join(':')
}

// 获取当前日期
export const getCurDate = () => {
    const date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()

    return [year, month, day].map(function (v) {
        return padZero(v)
    }).join('/')
}