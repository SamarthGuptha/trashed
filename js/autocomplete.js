import {normalize} from "./dataset.js";
export function createAutocomplete({input, list, getOptions, onPick}){
    let filtered = [];
    let activeIndex= -1;
    let open=false;

    function render(){
        if (!open || filtered.length ===0) {
            list.hidden = true;
            list.innerHTML= "";
            return;
        }
        list.hidden=false;
        list.innerHTML = filtered.map((opt,i) =>

             `<li role="option" data-i="${i}" class="${i===activeIndex? "active":""}">${escapeHtml(opt)}</li>`
        ).join("");
    }
    function escapeHtml(s){
        return s.replace(/[&<>"']/g, (c) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
    }

    function update() {
        const q = normalize(input.value);
        if (!q) {
            filtered=[];
            activeIndex = -1;
            open= false;
            render();
            return;
        }
        const options = getOptions();
        filtered= options.filter((opt) => normalize(opt).includes(q)).slice(0,7);
        activeIndex = filtered.length?0:-1;
        open = filtered.length>0;
        render();
    }
    function close(){open =false; render();}

    function pickActive(){
        if (activeIndex >=0 && filtered[activeIndex]){
            input.value =filtered[activeIndex];
            close();
            onPick && onPick(filtered[activeIndex]);
            return true;
        }
        return false;
    }
    input.addEventListener("input", update);
    input.addEventListener("focus", update);
    input.addEventListener("blur", ()=> setTimeout(close,120));

    input.addEventListener("keydown", (e)=> {
       if (!open) return;
       if (e.key === "ArrowDown"){e.preventDefault(); activeIndex= (activeIndex+1)%filtered.length; render();}
       else if(e.key === "ArrowUp"){
           e.preventDefault();
           activeIndex= (activeIndex-1+filtered.length)%filtered.length; render();
       }
       else if (e.key === "Escape"){ close(); }
       else if (e.key === "Tab"){
           if (pickActive())
               e.preventDefault()
       }

    });

    list.addEventListener("mousedown", (e) => {
        const li=e.target.closest("li");
        if (!li) return;
        e.preventDefault();
        activeIndex = Number(li.dataset.i);
        pickActive();
    });
    return {close,update};
}