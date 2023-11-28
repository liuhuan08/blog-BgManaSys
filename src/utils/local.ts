interface LocalType {
	get(key: string): any;
	set(key: string, val: any): void;
	remove(key: string): void;
	clear(): void;
}
/* 
		操作本地存储
*/
const local: LocalType = {
	get(key: string): any {
		const val: any = localStorage.getItem(key);
		return JSON.parse(val);
	},
	set(key: string, val: any): void {
		localStorage.setItem(key, JSON.stringify(val))
	},
	remove(key: string): void {
		localStorage.removeItem(key)
	},
	clear(): void {
		localStorage.clear()
	}
};

export default local;