document.addEventListener("DOMContentLoaded", () => {
  console.log("Quiz Portal loaded.");

  // Example: Greet user if name is stored in localStorage
  const name = localStorage.getItem("username");
  if (name) {
    const greetingEl = document.createElement("p");
    greetingEl.textContent = `Welcome back, ${name}!`;
    greetingEl.style.textAlign = "center";
    greetingEl.style.fontWeight = "bold";
    document.querySelector(".landing-container")?.appendChild(greetingEl);
  }
});
