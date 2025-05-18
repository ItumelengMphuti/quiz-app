document.addEventListener('DOMContentLoaded', function() {
  // Get username and category from URL
  const params = new URLSearchParams(window.location.search);
  const username = params.get('username');
  const category = params.get('category');

  let questions = [];
  let filteredQuestions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let timer;
  let timeLeft = 15;

  function showQuestion() {
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    document.getElementById('question').textContent = currentQuestion.question;
    document.getElementById('choices').innerHTML = '';
    document.getElementById('progress-bar').style.width = `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%`;
    document.getElementById('quiz-timer').textContent = `${timeLeft}s`;

    currentQuestion.choices.forEach(choice => {
      const li = document.createElement('li');
      li.textContent = choice;
      li.addEventListener('click', () => selectAnswer(choice, li));
      document.getElementById('choices').appendChild(li);
    });

    startTimer();
  }

  function selectAnswer(choice, selectedLi) {
    clearInterval(timer);
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    const choicesEl = document.getElementById('choices');

    Array.from(choicesEl.children).forEach(li => {
      li.style.pointerEvents = 'none';
      if (li.textContent === currentQuestion.answer) {
        li.style.backgroundColor = '#4caf50';
        li.style.color = 'white';
      } else if (li === selectedLi && li.textContent !== currentQuestion.answer) {
        li.style.backgroundColor = '#f44336';
        li.style.color = 'white';
      }
    });

    if (choice === currentQuestion.answer) {
      score++;
    }

    setTimeout(() => {
      if (currentQuestionIndex < filteredQuestions.length - 1) {
        currentQuestionIndex++;
        timeLeft = 15;
        showQuestion();
      } else {
        showResults();
      }
    }, 800);
  }

  function showResults() {
    document.querySelector('.quiz-question').innerHTML = `<h2>Quiz Complete!</h2><p>Score: ${score} out of ${filteredQuestions.length}</p>`;
  }

  function startTimer() {
    timeLeft = 15;
    document.getElementById('quiz-timer').textContent = `${timeLeft}s`;
    timer = setInterval(() => {
      timeLeft--;
      document.getElementById('quiz-timer').textContent = `${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        selectAnswer(null, null);
      }
    }, 1000);
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
      filteredQuestions = questions.filter(q => q.category === category);
      filteredQuestions = shuffleArray(filteredQuestions);
      showQuestion();
    })
    .catch(err => {
      document.querySelector('.quiz-question').innerHTML = '<p>Error loading questions.</p>';
      console.error('Error loading questions:', err);
    });
}); 