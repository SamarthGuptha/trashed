export function typeInto(el, text, {speed=16} = {}) {
    return new Promise((resolve)=> {
        el.textContent="";
        el.classList.add("new");
        let i = 0;
        const tick =() =>{
            const step = Math.min(text.length-i,1+Math.floor(Math.random()*2));
            el.textContent = text.slice(0, i+step);
            i+=step;
            if(i<text.length){
                setTimeout(tick, speed);
            } else {
                el.classList.remove("new");
                resolve();
            }
        };
        tick();
    });
}

export function shake(el){
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
    setTimeout(() => el.classList.remove("shake"),500);
}
