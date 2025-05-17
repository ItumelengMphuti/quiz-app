let questions = [];
let filteredQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

let timer;
let timeLeft = 15; // seconds

// Start & Next button listeners
document.getElementById('start-btn').addEventListener('click', startQuiz);
document.getElementById('next-btn').addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < filteredQuestions.length) {
    showQuestion();
  } else {
    showResults();
  }
});

function startQuiz() {
  const username = document.getElementById('username').value.trim();
  const category = document.getElementById('category').value;

  if (!username) {
    alert('Please enter your name');
    return;
  }

  filteredQuestions = category === 'All'
    ? questions.slice()
    : questions.filter(q => q.category === category);

  filteredQuestions = shuffleArray(filteredQuestions);
  currentQuestionIndex = 0;
  score = 0;

  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('quiz-screen').classList.remove('hidden');
  document.getElementById('result-screen').classList.add('hidden');

  showQuestion();
}

function showQuestion() {
  const currentQuestion = filteredQuestions[currentQuestionIndex];
  document.getElementById("question").textContent = currentQuestion.question;
  document.getElementById("progress").textContent = `Question ${currentQuestionIndex + 1} of ${filteredQuestions.length}`;

  const choicesList = document.getElementById("choices");
  choicesList.innerHTML = "";

  currentQuestion.choices.forEach(choice => {
    const li = document.createElement("li");
    li.textContent = choice;
    li.addEventListener("click", () => selectAnswer(choice, li));
    choicesList.appendChild(li);
  });

  document.getElementById('next-btn').style.display = 'none';

  // Start timer
  clearInterval(timer);
  timeLeft = 15;
  document.getElementById('timer').textContent = `Time left: ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = `Time left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      handleTimeout();
    }
  }, 1000);
}

function selectAnswer(choice, selectedLi) {
  clearInterval(timer);

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const choicesList = document.getElementById("choices");

  Array.from(choicesList.children).forEach(li => {
    li.style.pointerEvents = 'none';
    if (li.textContent === currentQuestion.answer) {
      li.style.backgroundColor = '#4caf50';
      li.style.color = 'white';
    }
    if (li === selectedLi && choice !== currentQuestion.answer) {
      li.style.backgroundColor = '#f44336';
      li.style.color = 'white';
    }
  });

  if (choice === currentQuestion.answer) {
    score++;
  }

  document.getElementById('next-btn').style.display = 'inline-block';
}

function handleTimeout() {
  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const choicesList = document.getElementById("choices");

  Array.from(choicesList.children).forEach(li => {
    li.style.pointerEvents = 'none';
    if (li.textContent === currentQuestion.answer) {
      li.style.backgroundColor = '#4caf50';
      li.style.color = 'white';
    }
  });

  document.getElementById('next-btn').style.display = 'inline-block';
}

function showResults() {
  document.getElementById('quiz-screen').classList.add('hidden');
  document.getElementById('result-screen').classList.remove('hidden');
  document.getElementById('score').textContent = `Score: ${score} out of ${filteredQuestions.length}`;
}

function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
  })
  .catch(err => {
    console.error('Error loading questions:', err);
  });