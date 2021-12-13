export default{
    install(Vue){
        Vue.prototype.Msg = (msg, type, duration) => {
            let timer;
            if(timer) clearTimeout(timer);
            timer = setTimeout(() => {
                if(document.querySelector("#l-msg-wrap-2021-12")) document.querySelector("#app").removeChild(document.querySelector("#l-msg-wrap-2021-12"));

                let removeTimer;
                if(removeTimer) clearTimeout(removeTimer);
        
                let div = document.createElement("div");
                div.id = "l-msg-wrap-2021-12";
                div.className = `msg-wrap ${type}`;
                div.innerHTML = `
                        <i class="iconfont icon-${type}" style="margin-right: 10px;"></i>
                        ${msg}
                    `;
        
                document.querySelector("#app").appendChild(div);
                document.querySelector("#app").style.position = 'relative'
        
                let cssText = "display: flex; align-items: center;position: absolute; top: 50px; left: 50%; transform: translateX(-50%); padding-left: 30px; width: 300px; height: 40px; line-height: 40px; border-radius: 4px; overflow: hidden; animation: all 2s linear;";
                
                if (type === "msg") {
                    cssText += "color: #909399; background-color: #edf2fc;";
                } else if (type === "success") {
                    cssText += "color: #67c23a; background-color: #f0f9eb;";
                } else if (type === "warning") {
                    cssText += "color: #e6a23c; background-color: #fdf6ec;";
                } else if (type === "error") {
                    cssText += "color: #f56c6c; background-color: #fef0f0;";
                };
        
                document.querySelector(".msg-wrap").style.cssText = cssText;
                
                removeTimer = setTimeout(() => {
                    document.querySelector(".msg-wrap").style.opacity = 0;
                    document.querySelector("#app").removeChild(div);
                }, duration);
            },100)
        };
     }    
 }　　