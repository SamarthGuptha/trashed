const STORAGE_KEY= "trashed:v1";
const listeners = new Set();

export const state= {
    highScore: 0,
    streak:0,
    location:null,
    cluesRevealed:1,
    guessesUsed:0,
    status: "playing",
    lastGuess: "",
    deck: [],
    deckIndex: 0
};
export function subscribe(fn) {
    listeners.add(fn);
    return ()=> listeners.delete(fn);
}
export function emit(event={}){
    for (const fn of listeners) fn(event);
}

export function loadPersisted(){
    try{
        const raw= localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const data= JSON.parse(raw);
        state.highScore = data.highScore || 0;
        state.streak= data.streak ||0;
    }catch{}
}

export function persist(){
    try{
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({highScore: state.highScore, streak: state.streak})
        );
    } catch{}
}