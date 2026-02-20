//Data & Storage
const defaultQuizzes = [
    {
        title: "Geografi",
        questions: [
            { q: "Vad heter Sveriges huvudstad?", options: ["Oslo", "Helsingfors", "Stockholm", "Köpenhamn"], correct: 2 },
            { q: "Vilken är världens största ocean?", options: ["Atlanten", "Indiska", "Stilla Havet", "Arktiska"], correct: 2 }
        ]
    },
    {
        title: "Teknik",
        questions: [
            { q: "Vad står HTML för?", options: ["Hyperlinks", "Hyper Text Markup Language", "Home Tool", "Hyper Main"], correct: 1 },
            { q: "Vad kallas datorns hjärna?", options: ["RAM", "GPU", "CPU", "HDD"], correct: 2 }
        ]
    }
];

//Startar lagringen, lägger in standardquizen
function initStorage() {
    if (!localStorage.getItem('myQuizzes')) {
        localStorage.setItem('myQuizzes', JSON.stringify(defaultQuizzes));
    }
}

//Global state (Appens korttidsminne)
let currentQuiz = null;
let currentQuestionIndex = 0;
let score = 0;

//DOM element(kopplingar till index.html)
const quizListContainer = document.getElementById('quiz-list');
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const questionText = document.getElementById('question-text');
const answerButtons = document.getElementById('answer-buttons');

//Flödet för användaren

//Ritar upp startsidan genom att hämta data från localstorage
function loadStartPage() {
    initStorage();
    const quizzes = JSON.parse(localStorage.getItem('myQuizzes'));
    quizListContainer.innerHTML = '';

    for (let i = 0; i < quizzes.length; i++) {
        const quiz = quizzes[i];
        
        // Skapar en enkel rubrik för varje quiz
        const div = document.createElement('div');
        div.innerHTML = `
            <button onclick="startQuizByIndex(${i})">${quiz.title}</button>
            <button onclick="deleteQuiz(${i})" style="color:red">Ta bort</button>
            <br><br>
        `;
        quizListContainer.appendChild(div);
    }
}

//sköter själva scenbytet när ett quiz startar
function startQuiz(quiz) {
    currentQuiz = quiz; //sparar det valda quizen i globala minnet
    currentQuestionIndex = 0;
    score = 0;
    //Gömmer med hide
    startScreen.classList.add('hide');
    quizScreen.classList.remove('hide');
    showQuestion();
}

function showQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];
    questionText.innerText = question.q;
    answerButtons.innerHTML = '';
    
    document.getElementById('current-question-num').innerText = currentQuestionIndex + 1;
    document.getElementById('total-questions').innerText = currentQuiz.questions.length;

    question.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => handleAnswer(index);
        answerButtons.appendChild(btn);
    });
}

function handleAnswer(selectedIndex) {
    if (selectedIndex === currentQuiz.questions[currentQuestionIndex].correct) {
        score++;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuiz.questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    quizScreen.classList.add('hide');
    resultScreen.classList.remove('hide');
    document.getElementById('score-text').innerText = `Du fick ${score} av ${currentQuiz.questions.length} rätt!`;
}

//Funktioner för att skapa quiz
function toggleCreateScreen() {
    startScreen.classList.toggle('hide');
    document.getElementById('create-quiz-screen').classList.toggle('hide');
}

// Skapar nya HTML-fält för ytterligare en fråga
function addQuestionField() {
    const container = document.getElementById('questions-to-add');
    const newBlock = document.createElement('div');
    newBlock.classList.add('question-block');
    newBlock.innerHTML = `
        <hr>
        <input type="text" class="q-text" placeholder="Fråga">
        <input type="text" class="opt" placeholder="Alternativ 1">
        <input type="text" class="opt" placeholder="Alternativ 2">
        <input type="text" class="opt" placeholder="Alternativ 3">
        <input type="text" class="opt" placeholder="Alternativ 4">
        <p>Rätt svar (1-4):</p>
        <input type="number" class="correct-num" min="1" max="4" value="1">
    `;
    container.appendChild(newBlock);
}

function saveNewQuiz() {
    const title = document.getElementById('new-quiz-title').value;
    const blocks = document.querySelectorAll('.question-block');
    const questionsArray = [];

    // Loopa igenom varje block i formuläret
    blocks.forEach(block => {
        const qText = block.querySelector('.q-text').value;
        
        const options = Array.from(block.querySelectorAll('.opt')).map(input => input.value);
        const correct = parseInt(block.querySelector('.correct-num').value) - 1;

        questionsArray.push({ q: qText, options: options, correct: correct });
    });

    const quizzes = JSON.parse(localStorage.getItem('myQuizzes')) || [];
    quizzes.push({ title: title, questions: questionsArray });
    
    localStorage.setItem('myQuizzes', JSON.stringify(quizzes));

    alert("Ditt nya quiz har sparats i LocalStorage!");
    location.reload();
}

function deleteQuiz(index) {
    // En enkel kontrollfråga
    let text = "Vill du verkligen radera detta?";
    if (confirm(text) == true) {
        let quizzes = JSON.parse(localStorage.getItem('myQuizzes'));
        
        // Ta bort 1 sak på plats 'index'
        quizzes.splice(index, 1);
        
        // Spara igen
        localStorage.setItem('myQuizzes', JSON.stringify(quizzes));
        
        // Ladda om sidan så quizen försvinner från listan
        location.reload();
    }
}

function startQuizByIndex(index) {
    const quizzes = JSON.parse(localStorage.getItem('myQuizzes'));
    const selectedQuiz = quizzes[index];
    startQuiz(selectedQuiz); // Anropar den befintliga startQuiz-funktionen
}

loadStartPage();