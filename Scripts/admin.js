document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("question-form");
  const categorySelect = document.getElementById("category");
  const questionList = document.getElementById("question-list");
  const settingsForm = document.getElementById("settings-form");

  const minInput = document.getElementById("min-questions");
  const maxInput = document.getElementById("max-questions");

  const escapeHTML = (str) =>
    str.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const loadQuestions = () => {
    const stored = localStorage.getItem("questions");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        console.warn("Invalid JSON in localStorage, resetting.");
        localStorage.removeItem("questions");
        return [];
      }
    }
    return [];
  };

  const saveQuestions = (questions) => {
    localStorage.setItem("questions", JSON.stringify(questions));
  };

  const renderQuestions = (questions) => {
    questionList.innerHTML = "";

    if (questions.length === 0) {
      questionList.textContent = "No questions available.";
      return;
    }

    questions.forEach((q, idx) => {
      const card = document.createElement("div");
      card.classList.add("question-card");

      card.innerHTML = `
        <h4>${idx + 1}. ${escapeHTML(q.question)}</h4>
        <p class="subtext">Category: ${escapeHTML(q.category)}</p>
        <ul class="options-list">
          ${q.choices
            .map(
              (choice) =>
                `<li class="${choice === q.answer ? "correct" : ""}">${escapeHTML(
                  choice
                )}</li>`
            )
            .join("")}
        </ul>
        <button class="delete-btn" data-index="${idx}">Delete</button>
      `;

      questionList.appendChild(card);
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-index"), 10);
        questions.splice(idx, 1);
        saveQuestions(questions);
        renderQuestions(questions);
        loadCategories(questions);
      });
    });
  };

  const loadCategories = (questions) => {

    categorySelect.innerHTML = '<option value="">Select category</option>';

    const categories = [...new Set(questions.map((q) => q.category))];

    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  };

  const loadSettings = () => {
    const stored = localStorage.getItem("quizSettings");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        localStorage.removeItem("quizSettings");
      }
    }
    return { min: 1, max: 5 };
  };

  const saveSettings = (min, max) => {
    localStorage.setItem("quizSettings", JSON.stringify({ min, max }));
  };

  const settings = loadSettings();
  minInput.value = settings.min;
  maxInput.value = settings.max;

  settingsForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const minVal = parseInt(minInput.value, 10);
    const maxVal = parseInt(maxInput.value, 10);

    if (isNaN(minVal) || isNaN(maxVal) || minVal < 1 || maxVal < 1) {
      alert("Please enter valid positive numbers for min and max.");
      return;
    }

    if (minVal > maxVal) {
      alert("Minimum cannot be greater than maximum.");
      return;
    }

    saveSettings(minVal, maxVal);
    alert("Settings saved!");
  });

  // Handle marking correct answer buttons
  const setupMarkCorrectButtons = () => {
    document.querySelectorAll(".mark-correct").forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remove 'selected' from all siblings in options-container
        btn.parentElement.parentElement
          .querySelectorAll(".mark-correct")
          .forEach((b) => b.classList.remove("selected"));

        btn.classList.add("selected");
      });
    });
  };

  setupMarkCorrectButtons();

  // Handle adding a new question
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const category = categorySelect.value.trim();
    const questionText = document.getElementById("question").value.trim();

    const optionInputs = document.querySelectorAll(".option-input");
    const options = [];
    let answer = "";

    optionInputs.forEach((input) => {
      const val = input.value.trim();
      if (val) {
        options.push(val);
        const btn = input.nextElementSibling;
        if (btn && btn.classList.contains("selected")) {
          answer = val;
        }
      }
    });

    if (!category) {
      alert("Please select a category.");
      return;
    }
    if (!questionText) {
      alert("Please enter the question text.");
      return;
    }
    if (options.length < 2) {
      alert("Please provide at least two options.");
      return;
    }
    if (!answer) {
      alert("Please mark the correct answer.");
      return;
    }

    const newQuestion = {
      category,
      question: questionText,
      choices: options,
      answer,
    };

    const questions = loadQuestions();
    questions.push(newQuestion);
    saveQuestions(questions);

    renderQuestions(questions);
    loadCategories(questions);


    form.reset();
    document.querySelectorAll(".mark-correct").forEach((btn) =>
      btn.classList.remove("selected")
    );
  });

  const questions = loadQuestions();
  renderQuestions(questions);
  loadCategories(questions);
});
