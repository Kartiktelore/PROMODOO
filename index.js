let time = 1500; 
let timer;
let isRunning = false;
let sessions = 0;
let Header =  document.querySelector(".Header")

let index = 0;
const header = document.querySelector(".Header");

const colors = ["#00adb5", "#ff9800", "#4caf50", "#e91e63"];
let i = 0;

setInterval(() => {
  header.style.color = colors[i];
  i = (i + 1) % colors.length;
}, 1500);

let audio = new Audio("https://www.soundjay.com/button/beep-07.wav");
audio.play();

function updateDisplay() {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;

  document.getElementById("timer").innerText =
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
  if (isRunning) return;

  isRunning = true;

  timer = setInterval(() => {
    if (time > 0) {
      time--;
      updateDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;
      sessions++;
      document.getElementById("sessions").innerText = sessions;
      alert("Time's up!");
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  time = 1500;
  updateDisplay();
}

function setWork() {
  time = 1500;
  updateDisplay();
}

function setBreak() {
  time = 300;
  updateDisplay();
}


updateDisplay();