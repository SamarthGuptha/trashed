import {state} from "./state.js";
import {typeInto} from "./animation.js";
const FIRST_NAMES = ["Karen", "Brad", "Linda", "Chad", "Beverly", "Doug", "Wardell", "Jake", "LeBron","Amy","Kobe","Balen Jrunson", "Tiffany", "Donna","Mitch", "Lilo", "Donna", "Brian", "Patty", "Hank"]
const LAST_INITIALS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const MONTHS = [
    "Jan", "Feb", "Mar", "Apr","May","Jun","Jul",
    "Aug", "Sep","Oct","Nov", "Dec"
];

const els= {};
export function bindUI(){
    els.streak = document.getElementById("streak");
    els.high= document.getElementById("highscore");
    els.author = document.getElementById("author");
    els.date = document.getElementById("review-date");
    els.source = document.getElementById("source");
    els.title =document.getElementById("review-title");
    els.clues=document.getElementById("clues");
    els.stars = document.querySelectorAll("#stars .star")
    els.dots = document.querySelectorAll("#guess-dots .dot")
    els.banner = document.getElementById("result-banner");
    els.input = document.getElementById("guess-input");
    els.inputWrap = document.getElementById("input-wrap");
    els.submit= document.getElementById("submit-btn");
    els.hint =document.getElementById("hint");
    return els;
}

export function getEls() {return els;}
function pick(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}
export function fakeUsername(){
    return `${pick(FIRST_NAMES)} ${pick(LAST_INITIALS)}.`;
}

export function fakeDate(){ return `${pick(MONTHS)} ${1+Math.floor(Math.random()*28)} ${2019+Math.floor(Math.random()*6)}`; }

export function renderHeaderStats() {
    els.streak.textContent=String(state.streak);
    els.high.textContent=String(state.highScore);
}

export function resetCardChrome(){
    els.author.textContent=fakeUsername();
    els.date.textContent = fakeDate();
    els.source.textContent = state.location?.source||"";
    els.title.textContent = `Review of a ${(state.location?.category||"place").toLowerCase()}`;
    els.clues.innerHTML= "";
    els.banner.hidden = true;
    els.banner.className="result-banner";
    els.banner.innerHTML="";
    els.stars.forEach((s) => s.classList.remove("filled"));
    els.dots.forEach((d) => d.classList.remove("used", "win"));
    els.submit.textContent = "Guess";
    els.submit.classList.remove("next");
    els.input.value="";
    els.input.disabled =false;
    els.hint.textContent = "Type a landmark, then press Enter.";
}

export async function revealClue(text){
    const p=document.createElement("p");
    p.className = "clue";
    els.clues.appendChild(p);
    await typeInto(p,text,{speed:14});
    p.scrollIntoView({behavior:"smooth",block:"nearest"});
}


export function markWrongGuess(index){
    const dot = els.dots[index];
    if (dot) dot.classList.add("used");
    const star= els.stars[index];
    if (star) star.classList.add("filled");
}
export function markAllDotsWin() {
    els.dots.forEach((d)=> {d.classList.remove("used");d.classList.add("win");});
}

export function showBanner({won,answer,source}){
    els.banner.hidden= false;
    els.banner.classList.add(won?"win":"lose");
    els.banner.innerHTML = won?`Nailed it. <strong>${answer}</strong>. <small>Press Enter for the next review.</small>`
        : `It was <strong>${answer}</strong>.<small>Streak reset. Press Enter to try again.</small>`;

    els.submit.textContent = "Next";
    els.submit.classList.add("next");
    els.input.disabled = true;
    els.hint.textContent= "Press Enter for the next review.";
}