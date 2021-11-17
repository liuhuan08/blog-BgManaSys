const Msg = (msg, type, duration) => {
    let timer;
    if(timer) clearTimeout(timer);
    timer = setTimeout(() => {
        let removeTimer;
        if(removeTimer) clearTimeout(removeTimer);

        let div = document.createElement("div");
        div.className = `wrap ${type}`;
        div.innerHTML = `
                <i class="iconfont icon-success" style="margin-right: 10px;"></i>
                ${msg}
            `;

        document.querySelector("#app").appendChild(div);

        let cssText = "display: flex; align-items: center;position: fixed; top: 50px; left: 50%; transform: translateX(-50%); padding-left: 30px; width: 300px; height: 40px; line-height: 40px; border-radius: 4px; overflow: hidden;";
        
        if (type === "msg") {
            cssText += "color: #909399; background-color: #edf2fc;";
        } else if (type === "success") {
            cssText += "color: #67c23a; background-color: #f0f9eb;";
        } else if (type === "warning") {
            cssText += "color: #e6a23c; background-color: #fdf6ec;";
        } else if (type === "error") {
            cssText += "color: #f56c6c; background-color: #fef0f0;";
        };

        document.querySelector(".wrap").style.cssText = cssText;
        
        removeTimer = setTimeout(() => {
            document.querySelector(".wrap").style.animation = `all 2s linear`;
            document.querySelector(".wrap").style.opacity = 0;
            // document.querySelector("#app").removeChild(div);
        }, duration);
    },100)
};

export default Msg;
