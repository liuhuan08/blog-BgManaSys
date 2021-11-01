/* 
    操作本地存储
*/

const local = {
    get(key) {
        return JSON.parse(localStorage.getItem(key))
    },
    set(key, val) {
        localStorage.setItem(key, JSON.stringify(val))
    },
    remove(key) {
        localStorage.removeItem(key)
    },
    clear() {
        localStorage.clear()
    }
};

export default local;