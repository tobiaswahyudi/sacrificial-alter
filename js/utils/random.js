const randomChoice = (choices) => {
    return choices[Math.floor(Math.random() * choices.length)];
}

const randomRange = (min, max) => {
    return min + Math.random() * (max - min);
}

const maybeFlip = (n) => {
    return Math.random() < 0.5 ? n : -n;
}