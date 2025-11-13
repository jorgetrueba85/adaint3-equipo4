let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;

const quizQuestions = [
    {
        question: "¿Quién es el dueño de la Cabaña del Misterio?",
        answers: ["Stan Pines", "Ford Pines", "Soos", "Wendy"],
        correct: 0
    },
    {
        question: "¿Cómo se llama el hermano gemelo de Mabel?",
        answers: ["Stanley", "Stanford", "Dipper", "Robbie"],
        correct: 2
    },
    {
        question: "¿Qué criatura es Bill Cipher?",
        answers: ["Un gnomo", "Un demonio triangular", "Un fantasma", "Un vampiro"],
        correct: 1
    },
    {
        question: "¿Cuál es el animal favorito de Mabel?",
        answers: ["Gatos", "Perros", "Cerdos", "Dinosaurios"],
        correct: 2
    },
    {
        question: "¿Quién escribió los diarios?",
        answers: ["Stan Pines", "Ford Pines", "McGucket", "Bill Cipher"],
        correct: 1
    }
];

let currentQuestion = 0;
let quizScore = 0;

const cipherMessages = [
    { encoded: "JUDYLWB IDOOV", decoded: "GRAVITY FALLS", shift: 3 },
    { encoded: "ELOO FLSKHU", decoded: "BILL CIPHER", shift: 3 },
    { encoded: "GLSSHU SLQHV", decoded: "DIPPER PINES", shift: 3 }
];

let currentCipher = 0;

function initMemoryGame() {
    const gameBoard = document.getElementById('memory-game');
    memoryCards = Array.from(gameBoard.children);
    
    shuffleCards();
    
    memoryCards.forEach(card => {
        card.addEventListener('click', flipCard);
    });
    
    document.getElementById('reset-memory').addEventListener('click', resetMemoryGame);
}

function shuffleCards() {
    const parent = document.getElementById('memory-game');
    for (let i = memoryCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        parent.appendChild(memoryCards[j]);
    }
}

function flipCard() {
    if (!canFlip || this.classList.contains('flipped') || this.classList.contains('matched')) {
        return;
    }
    
    this.classList.add('flipped');
    flippedCards.push(this);
    
    if (flippedCards.length === 2) {
        canFlip = false;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const symbol1 = card1.getAttribute('data-symbol');
    const symbol2 = card2.getAttribute('data-symbol');
    
    if (symbol1 === symbol2) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        flippedCards = [];
        canFlip = true;
        
        if (matchedPairs === 6) {
            document.getElementById('memory-status').textContent = '¡Felicidades! Encontraste todos los pares';
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}

function resetMemoryGame() {
    memoryCards.forEach(card => {
        card.classList.remove('flipped', 'matched');
    });
    flippedCards = [];
    matchedPairs = 0;
    canFlip = true;
    document.getElementById('memory-status').textContent = '';
    shuffleCards();
}

function initQuizGame() {
    loadQuestion();
    document.getElementById('next-question').addEventListener('click', nextQuestion);
}

function loadQuestion() {
    if (currentQuestion >= quizQuestions.length) {
        document.getElementById('question-text').textContent = `¡Quiz completado! Puntuación final: ${quizScore}/${quizQuestions.length}`;
        document.getElementById('answers-container').innerHTML = '';
        document.getElementById('next-question').style.display = 'none';
        return;
    }
    
    const question = quizQuestions[currentQuestion];
    document.getElementById('question-text').textContent = question.question;
    
    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-button';
        button.textContent = answer;
        button.addEventListener('click', () => checkAnswer(index, button));
        answersContainer.appendChild(button);
    });
    
    document.getElementById('next-question').style.display = 'none';
}

function checkAnswer(selectedIndex, button) {
    const question = quizQuestions[currentQuestion];
    const buttons = document.querySelectorAll('.answer-button');
    
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === question.correct) {
            btn.classList.add('correct');
        } else if (btn === button && index !== question.correct) {
            btn.classList.add('incorrect');
        }
    });
    
    if (selectedIndex === question.correct) {
        quizScore++;
    }
    
    updateQuizScore();
    document.getElementById('next-question').style.display = 'block';
}

function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}

function updateQuizScore() {
    document.getElementById('quiz-score').textContent = `Puntuación: ${quizScore}/${currentQuestion + 1}`;
}

function initCipherGame() {
    loadCipher();
    document.getElementById('check-cipher').addEventListener('click', checkCipher);
    document.getElementById('cipher-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkCipher();
        }
    });
}

function loadCipher() {
    const cipher = cipherMessages[currentCipher];
    document.getElementById('cipher-text').textContent = cipher.encoded;
    document.getElementById('cipher-input').value = '';
    document.getElementById('cipher-result').textContent = '';
}

function checkCipher() {
    const userAnswer = document.getElementById('cipher-input').value.trim().toUpperCase();
    const correctAnswer = cipherMessages[currentCipher].decoded;
    const resultElement = document.getElementById('cipher-result');
    
    if (userAnswer === correctAnswer) {
        resultElement.textContent = '¡Correcto! Has descifrado el mensaje.';
        resultElement.style.color = '#4caf50';
        
        currentCipher = (currentCipher + 1) % cipherMessages.length;
        setTimeout(() => {
            loadCipher();
        }, 2000);
    } else {
        resultElement.textContent = 'Incorrecto. Pista: Desplazamiento César +3';
        resultElement.style.color = '#f44336';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initMemoryGame();
    initQuizGame();
    initCipherGame();
});
