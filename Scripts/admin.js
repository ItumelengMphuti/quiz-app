document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const form = document.getElementById("question-form");
  const categorySelect = document.getElementById("category");
  const questionList = document.getElementById("question-list");

  // Load questions from localStorage or JSON file
  const loadQuestions = async () => {
    const stored = localStorage.getItem("questions");
    if (stored) return JSON.parse(stored);

    const res = await fetch("questions.json");
    const data = await res.json();
    localStorage.setItem("questions", JSON.stringify(data));
    return data;
  };

  // Save to localStorage
  const saveQuestions = (questions) => {
    localStorage.setItem("questions", JSON.stringify(questions));
  };

  // Render all questions
  const renderQuestions = (questions) => {
    questionList.innerHTML = "";

    questions.forEach((q, index) => {
      const card = document.createElement("div");
      card.classList.add("question-card");

      card.innerHTML = `
        <h4>${index + 1}. ${q.question}</h4>
        <p class="subtext">Category: ${q.category}</p>
        <ul class="options-list">
          ${q.choices.map(choice =>
            `<li class="${choice === q.answer ? 'correct' : ''}">${choice}</li>`
          ).join("")}
        </ul>
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;

      questionList.appendChild(card);
    });

    // Attach delete listeners
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = btn.getAttribute("data-index");
        questions.splice(idx, 1);
        saveQuestions(questions);
        renderQuestions(questions);
      });
    });
  };

  // Load categories into <select>
  const loadCategories = (questions) => {
    const categories = [...new Set(questions.map(q => q.category))];
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  };

  // Initialize
  loadQuestions().then(data => {
    renderQuestions(data);
    loadCategories(data);
  });

  // Mark correct button logic
  document.querySelectorAll(".mark-correct").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mark-correct").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const category = categorySelect.value;
    const questionText = document.getElementById("question").value.trim();

    const optionInputs = document.querySelectorAll(".option-input");
    const options = [];
    let answer = "";

    optionInputs.forEach((input) => {
      const val = input.value.trim();
      if (val) {
        options.push(val);
        const btn = input.nextElementSibling;
        if (btn.classList.contains("selected")) answer = val;
      }
    });

    if (!category || !questionText || options.length < 2 || !answer) {
      alert("Please fill in all fields and select the correct answer.");
      return;
    }

    const newQuestion = {
      category,
      question: questionText,
      choices: options,
      answer
    };

    const current = JSON.parse(localStorage.getItem("questions")) || [];
    current.push(newQuestion);
    saveQuestions(current);
    renderQuestions(current);

    form.reset();
    document.querySelectorAll(".mark-correct").forEach(btn => btn.classList.remove("selected"));
  });
});
