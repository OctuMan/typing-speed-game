
// Set game levels 
const levels = {
    Easy : 7,
    Normal : 4,
    Hard : 3
}

// List of random words 
const initialwords = [
    "keyboard", "script", "memory","dashboard", "processor", "screen", "delay", "programming", "game", "scallable","scope", "data", "science", "request","node"
];
let words = [...initialwords];

// catch elements from document 
let selectLvel = document.querySelector(".select-level");
let wordToshow = document.querySelector('.word-area');
let userInput = document.querySelector('#word-input');
let nextWord = document.querySelector('.next-word');
let controles = document.querySelector('.controles');
let scoreSpan = document.querySelector('.controles .score');
let globalScoreSpan = document.querySelector('.controles .global-words');
let timeLeftSpan = document.querySelector('.time-left');
let higherScore = document.querySelector('.controles .higher-score');
let startBtn = document.querySelector("#start-button");
let resultMsg = document.querySelector('.result-message span');
let restartBtn = document.querySelector("#restart-button");
let instructionsSection = document.querySelector('.instructions-content')

// set global variables
let score = 0;
let globalScore = words.length;
let  gameLevel = selectLvel.value;
let timeLeft = levels[gameLevel];
let randomWord ;
let result;

// Get user selected level 
selectLvel.addEventListener('change', (e)=>{
    gameLevel = e.target.value;
    timeLeft = levels[gameLevel];
    loadDefaultControles();
    gameInstructions();
})

// Start button 
startBtn.addEventListener('click', startGame);
restartBtn.disabled = true;
restartBtn.addEventListener('click', startGame);

// StartGame function 
function startGame(){
    resultMsg.textContent = '';
    resultMsg.classList.remove('good', 'wrong');

    startBtn.disabled =true;
    userInput.disabled = false;

    words = [...initialwords];
    timeLeft = levels[gameLevel];

    timeLeftSpan.textContent = timeLeft;
    score = 0;
    scoreSpan.textContent = score;
    generatWord();
    startTimer();
}
let timerInterval;

function startTimer() {
  clearInterval(timerInterval); // clear any old interval if restarting
  timerInterval = setInterval(() => {
    timeLeft--;
    timeLeftSpan.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameOver();
      
    }
  }, 1000);
}
function generatWord(){
    userInput.focus();
    wordToshow.innerHTML ='';
    if(words.length === 0){
        gameOver();
        return;
       
    }
     const randomWord = words[Math.floor(Math.random() * words.length)];
     words.splice(words.indexOf(randomWord), 1);
        // Append random word to word area 
    wordToshow.innerHTML = randomWord;
    userInput.value ='';
    showNextWords();
    // Remove random word from list  
    
}

function loadDefaultControles(){
   
    timeLeftSpan.innerHTML = timeLeft;
    scoreSpan.innerHTML = score;
    higherScore.innerHTML = getMaxScoreFromLocalStorage();
    
}

function showNextWords() {
    nextWord.innerHTML = '';
    if(words.length === 0 ){
    nextWord.innerHTML = 'Task completed';
    return;
    }
        
        words.forEach(word =>{
        const wordSpan = document.createElement('span');
        wordSpan.textContent = word;
        nextWord.appendChild(wordSpan);
        });
        
    
    
}


userInput.addEventListener('input', compareWords);

function compareWords(){
    const userWord = userInput.value.trim().toLowerCase();
    const currentWord = wordToshow.textContent.trim().toLocaleLowerCase();
    if(currentWord === userWord){
        
        updateScore();
        

        if(words.length > 0){
            generatWord();
            timeLeft = levels[gameLevel];
            timeLeftSpan.textContent = timeLeft;
        }else{
            gameOver();
            
        }
    } 
}


function getScore(){
    return score
}

function updateScore(){
    score++;
    scoreSpan.textContent = score;
    
    
}
function clearFields({ disableStart = false } = {}) {
    wordToshow.innerHTML = '';
    userInput.value = '';
    userInput.blur();
    nextWord.innerHTML ='';
    
}

function gameOver() {
    clearInterval(timerInterval);
    clearFields({ disableStart: false });
    userInput.disabled = true;

    startBtn.disabled = false;

    const finalScore = getScore();
    const globalScore =initialwords.length;
    resultMsg.classList.remove('good', 'wrong');
    if(finalScore === globalScore){
        resultMsg.innerHTML = `🎉 Congratulations! score : ${finalScore} / ${globalScore}`;
        resultMsg.classList.add('good');
        addScoreToLocalStorage(finalScore);
    }else{
        resultMsg.innerHTML = `💀 Game Over! score : ${finalScore} / ${globalScore}`;
        resultMsg.classList.add('wrong');       
    }
    
}

// localStorage Handling 
let SCORE_KEY = 'score';
let scoreArray = JSON.parse(localStorage.getItem(SCORE_KEY)) || [];

function addScoreToLocalStorage(userScore){
    let today = new Date();
    scoreArray.push({date : today, score : userScore});
    localStorage.setItem('score', JSON.stringify(scoreArray));

}

function getMaxScoreFromLocalStorage(){
    let maxScore = 0;
    let scoreFromLS = JSON.parse(localStorage.getItem(SCORE_KEY)) || [];
    for(let s = 0; s < scoreFromLS.length; s++){
        if(scoreFromLS[s].score > maxScore){
            maxScore = scoreFromLS[s].score;
        }
    }
    return maxScore;
}

// Game Instructions 
function gameInstructions(){
    instructionsSection.innerHTML ='';
    let items = document.createElement('ul');
    let item1 = document.createElement('li');
    let item2 = document.createElement('li');
    let item3 = document.createElement('li');
    item1.innerHTML = `Now you play on ${gameLevel} mode`;
    item2.innerHTML = `You have ${timeLeft} seconds per word`;
    item3.innerHTML = `Get ready and click start to play`;
    
    items.append(item1, item2, item3);
    instructionsSection.appendChild(items);
}
document.addEventListener('DOMContentLoaded', gameInstructions);
document.addEventListener('DOMContentLoaded', loadDefaultControles);

