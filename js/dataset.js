let _locations= [];
let _answers = [];

export async function loadDataset() {
    const res = await fetch("./data/datasets.json", {cache:"no-store"});
    if (!res.ok) throw new Error("Failed to load dataset");
    const data= await res.json();
    _locations = data.locations || [];
    _answers = _locations.map((l) => l.answers);
    return {gameName: data.gameName, version: data.version};
}

export function allAnswers() {return _answers.slice();}
export function allLocations() {return _locations.slice();}

export function shuffled() {
    const arr = _locations.slice();
    for (let i= arr.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    } return arr;
}
export function normalize(str) {
    return String(str || "")
        .toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "").replace(/\s+/g, "")
        .replace(/^the\s+/, "")
        .trim();
}