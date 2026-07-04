import {loadDataset,allAnswers,shuffled,normalize} from "./dataset.js";
import {state,loadPersisted,persist} from "./state.js";
import{
    bindUI,getEls,renderHeaderStats,resetCardChrome,revealClue,markWrongGuess,markAllDotsWin, showBanner
} from "./ui.js";
import {shake} from "./animation.js";
import {createAutocomplete}from "./autocomplete.js";

const MAX_GUESSES = 6;
function nextLocation(){
    if (state.deckIndex>=state.deck.length){
        state.deck=shuffled();
        state.deckIndex = 0;
    }
    return state.deck[state.deckIndex++];
}

async function startRound() {
    state.location=nextLocation();
    state.cluesRevealed=1;
    state.guessesUsed=0;
    state.status = "playing";
    resetCardChrome();
    renderHeaderStats();
    await revealClue(state.location.clues[0]);
    const {input}=getEls();
    input.focus();
}

function endRound(won){
    state.status=won?"won":"lost";
    if (won){
        state.streak+=1;
        if(state.streak>state.highScore) state.highScore=state.streak;
        markAllDotsWin();
    }else{state.streak=0;}
    persist();
    renderHeaderStats();
    showBanner({
        won, answer:state.location.answer,
        source:state.location.source
    });
}

async function submitGuess(raw){
    if(state.status !== "playing") return;
    const guess = raw.trim();
    if (!guess) return;
    const {input,inputWrap}=getEls();

    const correct = normalize(guess) === normalize(state.location.answer);
    if (correct) {
        endRound(true);
        return;
    }

    const idx = state.guessesUsed;
    state.guessesUsed+=1;
    markWrongGuess(idx);
    shake(inputWrap);
    input.value = "";
    if (state.guessesUsed>=MAX_GUESSES){endRound(false); return;}
    state.cluesRevealed+=1;
    const nextIdx = Math.min(state.cluesRevealed-1, state.location.clues.length-1);
    await revealClue(state.location.clues[nextIdx]);
    input.focus();
}

async function boot(){
    bindUI();
    loadPersisted();
    renderHeaderStats();

    try{
        await loadDataset();
    } catch (e) {
        const {clues}=getEls();
        clues.textContent = "Could not load reviews. Refresh to try again.";
        return;
    }
    state.deck=shuffled();
    state.deckIndex = 0;
    const {input,inputWrap}= getEls();
    const ac = createAutocomplete({
        input,
        list: document.getElementById("autocomplete"),
        getOptions: ()=> allAnswers(),
        onPick:()=> input.focus()
    });
    const form = document.getElementById("guess-form");
    form.addEventListener("submit",(e)=>{
       e.preventDefault();
       if (state.status !=="playing") {startRound(); return;}
       ac.close();
       submitGuess(input.value);
    });
    document.addEventListener("keydown", (e)=> {
       if (e.key !== "Enter") return;
       if (state.status === "playing") return;
       e.preventDefault();
       startRound();
    });
    await startRound();
}

boot();