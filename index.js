
if (Notification.permission === "default") {
  Notification.requestPermission();
}


function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const times = [0, 0.35, 0.7];
    times.forEach(offset => {
      const osc = ctx.createOscillator();
       const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime + offset);
       gain.gain.setValueAtTime(0.5, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.25);
       osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.25);
    });
  } catch (e) {}
}

function showNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f345.png" });
  }
}


let sessionHistory = [];

function addHistory(label) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  sessionHistory.unshift({ label, time: timeStr });
  renderHistory();
}

function renderHistory() {
   const list = document.getElementById("historyList");
  if (sessionHistory.length === 0) {
    list.innerHTML = '<li class="history-empty">No sessions yet</li>';
    return;
  }
  list.innerHTML = sessionHistory.map((s, i) =>
    `<li class="history-item">
      <span class="history-label">${s.label}</span>
      <span class="history-time">${s.time}</span>
    </li>`
  ).join("");
}

renderHistory();

let time = 1500; 
let timer = null;
 let isRunning = false;
let currentMode = "work";
let sessions = 0;

const display = document.getElementById("timer-display");
const modeLabel = document.getElementById("mode-label");
const btn = document.getElementById("start-pause-btn");


function updateDisplay() {
  let min = Math.floor(time / 60);
  let sec = time % 60;

  display.innerText =
    `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}


function toggleTimer() {
  if (isRunning) {
    clearInterval(timer);
    btn.innerText = "Start";
    isRunning = false;
  } else {
    timer = setInterval(() => {
      if (time > 0) {
        time--;
        updateDisplay();
      } else {
        clearInterval(timer);
        isRunning = false;
        btn.innerText = "Start";

        playBeep();
        if (currentMode === "work") {
          sessions++;
          document.getElementById("session-count").innerText = sessions;
          addHistory(`🍅 Work Session #${sessions}`);
          showNotification("Pomodoro Complete!", "Great focus! Time for a break.");
        } else {
          const breakLabel = currentMode === "short" ? "☕ Short Break" : "🛋️ Long Break";
          addHistory(breakLabel);
          showNotification("Break Over!", "Ready to focus again?");
        }
      }
    }, 1000);

    btn.innerText = "Pause";
    isRunning = true;
  }
}


function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  btn.innerText = "Start";

  setMode(currentMode);
}


function setMode(mode) {
  clearInterval(timer);
  isRunning = false;
  btn.innerText = "Start";

  currentMode = mode;

  if (mode === "work") {
    time = 1500;
    modeLabel.innerText = "Focus Time";
  } else if (mode === "short") {
    time = 300;
    modeLabel.innerText = "Short Break";
  } else {
    time = 900;
    modeLabel.innerText = "Long Break";
  }

  updateDisplay();
}


updateDisplay();

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (!text) return;

  const li = document.createElement("li");
  li.innerHTML = `
    <span class="task-text">${text}</span>
    <button class="delete-btn" onclick="deleteTask(this)">✕</button>
  `;
  li.querySelector(".task-text").onclick = () => li.classList.toggle("done");
  document.getElementById("taskList").appendChild(li);
  input.value = "";
}

function deleteTask(btn) {
  btn.parentElement.remove();
}