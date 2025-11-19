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

let wheelSegments = [
    'Stan te estafa',
    'Encuentras a Bill',
    'Mabel te da un cerdo',
    'Dipper te muestra el diario',
    'Los gnomos te persiguen',
    'Wendy te saluda',
    'Soos cuenta un chiste',
    'McGucket te inventa algo'
];
let isSpinning = false;

function initWheelGame() {
    const canvas = document.getElementById('wheel-canvas');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 180;
    
    drawWheel(ctx, centerX, centerY, radius);
    
    document.getElementById('spin-wheel').addEventListener('click', () => {
        if (!isSpinning) {
            spinWheel(ctx, centerX, centerY, radius);
        }
    });
}

function drawWheel(ctx, centerX, centerY, radius, rotation = 0) {
    const numSegments = wheelSegments.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    for (let i = 0; i < numSegments; i++) {
        const startAngle = rotation + i * anglePerSegment;
        const endAngle = startAngle + anglePerSegment;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        ctx.fillStyle = i % 2 === 0 ? '#c1744e' : '#2a3322';
        ctx.fill();
        
        ctx.strokeStyle = '#bbd5ba';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#bbd5ba';
        ctx.font = '14px Arial';
        ctx.fillText(wheelSegments[i], radius * 0.65, 5);
        ctx.restore();
    }
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 20);
    ctx.lineTo(centerX - 10, centerY - radius);
    ctx.lineTo(centerX + 10, centerY - radius);
    ctx.closePath();
    ctx.fillStyle = '#c14e4e';
    ctx.fill();
}

function spinWheel(ctx, centerX, centerY, radius) {
    isSpinning = true;
    const spinTime = 3000;
    const spinRotations = 5 + Math.random() * 3;
    const totalRotation = spinRotations * 2 * Math.PI;
    let currentRotation = 0;
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinTime, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        currentRotation = easeOut * totalRotation;
        drawWheel(ctx, centerX, centerY, radius, currentRotation);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            showWheelResult(currentRotation);
        }
    }
    
    animate();
}

function showWheelResult(rotation) {
    const numSegments = wheelSegments.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;
    const normalizedRotation = rotation % (2 * Math.PI);
    const segmentIndex = Math.floor(((2 * Math.PI - normalizedRotation) % (2 * Math.PI)) / anglePerSegment);
    
    const resultElement = document.getElementById('wheel-result');
    resultElement.textContent = `¡${wheelSegments[segmentIndex]}!`;
    resultElement.style.color = '#c1744e';
}

let gnomeTimer;
let gnomesFound = 0;
let timeLeft = 30;
let gnomeGameActive = false;

function initGnomeGame() {
    document.getElementById('start-gnome').addEventListener('click', startGnomeGame);
}

function startGnomeGame() {
    if (gnomeGameActive) return;
    
    gnomeGameActive = true;
    gnomesFound = 0;
    timeLeft = 30;
    updateGnomeStats();
    
    const field = document.getElementById('gnome-field');
    field.innerHTML = '';
    
    for (let i = 0; i < 10; i++) {
        createGnome(field);
    }
    
    gnomeTimer = setInterval(() => {
        timeLeft--;
        updateGnomeStats();
        
        if (timeLeft <= 0 || gnomesFound >= 10) {
            endGnomeGame();
        }
    }, 1000);
    
    document.getElementById('start-gnome').disabled = true;
}

function createGnome(field) {
    const gnome = document.createElement('div');
    gnome.className = 'gnome';
    gnome.textContent = '🧙';
    
    const maxX = field.clientWidth - 40;
    const maxY = field.clientHeight - 40;
    gnome.style.left = Math.random() * maxX + 'px';
    gnome.style.top = Math.random() * maxY + 'px';
    
    gnome.addEventListener('click', function() {
        if (!this.classList.contains('found')) {
            this.classList.add('found');
            gnomesFound++;
            updateGnomeStats();
            
            if (gnomesFound >= 10) {
                endGnomeGame();
            }
        }
    });
    
    field.appendChild(gnome);
}

function updateGnomeStats() {
    document.getElementById('gnomes-found').textContent = gnomesFound;
    document.getElementById('gnome-timer').textContent = timeLeft;
}

function endGnomeGame() {
    clearInterval(gnomeTimer);
    gnomeGameActive = false;
    document.getElementById('start-gnome').disabled = false;
    
    const resultText = gnomesFound >= 10 ? 
        '¡Increíble! ¡Encontraste todos los gnomos!' : 
        `Juego terminado. Encontraste ${gnomesFound}/10 gnomos.`;
    
    alert(resultText);
}

document.addEventListener('DOMContentLoaded', () => {
    initMemoryGame();
    initQuizGame();
    initCipherGame();
    initWheelGame();
    initGnomeGame();
});

