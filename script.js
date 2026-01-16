// Note: Why in most of the cases in we take const instead of let in case of HTML DOM ?
// The main reason is const in js mean their reference is immutable not value .
// so const x=10 , then x=20 will be wrong but const arr = []; and arr.push(1) is right.
// In the same way HTML DOM are the elements of HTML and the element can not be chnaged by using
// the DOM we modify their content means their value not refrence means original element.
// ❓ Why NOT let ?  You could use let: let questionText = document.querySelector('.que-row h4');
// But ask yourself:  Will this variable EVER point to another element? ❌ No.
// So using let is: Less strict , More error-prone , Less readable
// 🚨 Real danger of let in DOM code
// With let, this bug is possible let ansBox = document.querySelector('.ans-box');
// ansBox = "hello"; 😵 No error, but app breaks later
// With const:  const ansBox = document.querySelector('.ans-box');
// ansBox = "hello"; ❌ Immediate error (GOOD!)  👉 const protects you from accidental reassignment
// ✅ Use const by DEFAULT
// 🔁 Use let only when reassignment is REQUIRED
// 🔥 Summary (MEMORIZE THIS)
// DOM elements → const
// Data arrays/objects → const
// Counters, timers, indexes → let

const timer = document.querySelector(".timer span");
const question = document.querySelector(".que-row h4");
const answerBox = document.querySelector(".ans-box");
const nextQuestion = document.querySelector(".nextBtn");
const questionNumber = document.querySelector(".next h5");
const startOverlay = document.querySelector(".start-overlay");
const startBtn = document.querySelector(".start-btn");
const container = document.querySelector(".container");
const previousQustion = document.querySelector(".prevBtn");
const userAnswers = new Array(quizData.length).fill(null);

let currentQuestion = 0;
let score;
let timeLeft;
let timerInterval;

// loading the question
function loadQuestion() {
  const current = quizData[currentQuestion];
  question.textContent = current.question;
  answerBox.textContent = "";

  // creating the answer box elements dynamically
  current.options.forEach((option, index) => {
    const fieldSet = document.createElement("fieldset");
    fieldSet.classList.add("options");

    const label = document.createElement("label");
    label.classList.add("option");

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.value = index;

    const span = document.createElement("span");
    span.textContent = option;

    fieldSet.appendChild(label);
    label.appendChild(input);
    label.appendChild(span);
    answerBox.appendChild(fieldSet);
  });

  questionNumber.textContent = `Question ${currentQuestion + 1} of ${
    quizData.length
  }`;

  if (userAnswers[currentQuestion] !== null) {
    const previousSelected = document.querySelector(
      `input[name="answer"][value="${userAnswers[currentQuestion]}"]`
    );

    if (previousSelected) {
      previousSelected.checked = true;
    }
  }
}
loadQuestion();

// getting previous question
previousQustion.addEventListener("click", function () {
  const selected = document.querySelector("input[type=radio]:checked");
  if (selected) {
    userAnswers[currentQuestion] = parseInt(selected.value);
  }
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
});

// getting next question
nextQuestion.addEventListener("click", () => {
  const selected = document.querySelector("input[type=radio]:checked");

  if (!selected) {
    alert("Please select the answer");
    return;
  }
  userAnswers[currentQuestion] = parseInt(selected.value);
  if (currentQuestion < quizData.length - 1) {
    currentQuestion++;
    loadQuestion();
  } else if (confirm("Are you sure you want to submit ?")) {
    showResult();
  }
});

// showing the result
function showResult() {
  score = 0;
  userAnswers.forEach((answer, index) => {
    if (answer === parseInt(quizData[index].correct)) {
      score++;
    }
  });
  const box = document.querySelector(".box");
  box.classList.add("result");
  box.innerHTML = `<h2>Quiz Completed 🎉</h2>
    <p>Your score: ${score}/${quizData.length}</p>
    <button>Take Again</button>`;
  const takeAgain = document.querySelector(".result button");

  takeAgain.addEventListener("click", function () {
    window.location.reload();
  });
}

// start quiz feature
startBtn.addEventListener("click", function () {
  startOverlay.style.display = "none";
  container.style.display = "flex";
  currentQuestion = 0;
  score = 0;
  timeLeft = 60;
  timer.textContent = timeLeft;

  loadQuestion();
  startTimer();
});

// handling the timer
function startTimer() {
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft--;
    timer.textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      showResult();
    }
  }, 1000);
}
