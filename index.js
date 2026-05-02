let settings = {
  work:        25 * 60,
  shortBreak:  5  * 60,
  longBreak:   15 * 60,
  longBreakAfter: 4
};


 let time        = settings.work;
let timer       = null;
let isRunning   = false;
 let currentMode = "work";
let sessions    = 0;
let totalDuration = settings.work;  


const display    = document.getElementById("timer-display");
const modeLabel  = document.getElementById("mode-label");
const btn        = document.getElementById("start-pause-btn");
 const ringEl     = document.getElementById("progress-ring");
const CIRCUMFERENCE = 678.58; 


function updateDisplay() {
  let min = Math.floor(time / 60);
  let sec = time % 60;
   display.innerText = `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  updateRing();
}

function updateRing() {
  const fraction = totalDuration > 0 ? time / totalDuration : 0;
   const offset   = CIRCUMFERENCE * (1 - fraction);
  ringEl.style.strokeDashoffset = offset;


  const colors = { work: "#E24B4A", shortBreak: "#1D9E75", longBreak: "#185FA5" };
  ringEl.style.stroke = colors[currentMode] || "#E24B4A";
}

function updateDots() {
  const dots = document.querySelectorAll(".dot");
  const cycle = settings.longBreakAfter;
 
   const dotContainer = document.getElementById("dots");
  if (dotContainer.children.length !== cycle) {
     dotContainer.innerHTML = "";
    for (let i = 0; i < cycle; i++) {
      const d = document.createElement("div");
      d.className = "dot";
      dotContainer.appendChild(d);
    }
  }
  const allDots = dotContainer.querySelectorAll(".dot");
  const pos = sessions % cycle;
  allDots.forEach((d, i) => {
    d.classList.toggle("done", i < pos);
  });
}


let toastTimeout;
 function showToast(msg) {
  const t = document.getElementById("toast");
   t.innerText = msg;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { t.innerText = ""; }, 3000);
}


function setMode(mode) {
  clearInterval(timer);
   isRunning = false;
  btn.innerText = "Start";
  currentMode = mode;

  const labels = { work: "Focus Time", shortBreak: "Short Break", longBreak: "Long Break" };
  modeLabel.innerText = labels[mode];

  time = settings[mode];
  totalDuration = settings[mode];


  document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
   const modeMap = { work: "btn-work", shortBreak: "btn-shortBreak", longBreak: "btn-longBreak" };
  const activeBtn = document.getElementById(modeMap[mode]);
  if (activeBtn) activeBtn.classList.add("active");

  updateDisplay();
}


function toggleTimer() {
  if (isRunning) {
    clearInterval(timer);
    btn.innerText = "Start";
    isRunning = false;
    return;
  }

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
        addHistory("Focus session");
        updateDots();

       
        const isLong = (sessions % settings.longBreakAfter === 0);
         const nextMode = isLong ? "longBreak" : "shortBreak";
        const label    = isLong ? "Long Break 🎉" : "Short Break";

        showNotification("Work Complete!", `${label} starting…`);
         showToast(`${label} starting!`);

        setMode(nextMode);
        toggleTimer();           

      } else {
        showNotification("Break Over!", "Back to focus 💪");
         showToast("Break over — let's go!");
        setMode("work");

      }
    }
  }, 1000);

  btn.innerText = "Pause";
   isRunning = true;
}


function resetTimer() {
  clearInterval(timer);
   isRunning = false;
  btn.innerText = "Start";
  time = settings[currentMode];
   totalDuration = settings[currentMode];
  updateDisplay();
}


function addHistory(label) {
  const list  = document.getElementById("historyList");
  const empty = list.querySelector(".history-empty");
  if (empty) empty.remove();

   const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const li = document.createElement("li");
  li.className = "history-item";
  li.innerHTML = `<span class="history-label">${label}</span>
                  <span class="history-time">${timeStr}</span>`;
  list.prepend(li);
}

function addTask() {
  const input = document.getElementById("taskInput");
   const text  = input.value.trim();
  if (!text) return;

  const ul = document.getElementById("taskList");
  const li = document.createElement("li");

  li.innerHTML = `<span class="task-text" onclick="toggleTask(this)">${text}</span>
                  <button class="delete-btn" onclick="deleteTask(this)">✕</button>`;
  ul.appendChild(li);
  input.value = "";
}

function toggleTask(el) {
  el.parentElement.classList.toggle("done");
}

function deleteTask(btn) {
  btn.parentElement.remove();
}

if (Notification.permission === "default") {
  Notification.requestPermission();
}


function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.frequency.value = 880;
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {}
}

function showNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
}
function step(inputId, delta) {
  const el  = document.getElementById(inputId);
  const val = parseInt(el.value) || 0;
  const min = parseInt(el.min) || 1;
  const max = parseInt(el.max) || 999;
  el.value  = Math.min(max, Math.max(min, val + delta));
}

function openModal() {

  document.getElementById("workMin").value       = Math.round(settings.work       / 60);
  document.getElementById("shortBreakMin").value = Math.round(settings.shortBreak / 60);
  document.getElementById("longBreakMin").value  = Math.round(settings.longBreak  / 60);
  document.getElementById("longBreakAfter").value= settings.longBreakAfter;

  document.getElementById("modalOverlay").classList.add("open");
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("open");
}

document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalCancel").addEventListener("click", closeModal);


document.getElementById("modalOverlay").addEventListener("click", function (e) {
  if (e.target === this) closeModal();
});

document.getElementById("modalSave").addEventListener("click", function () {
  const workVal   = parseInt(document.getElementById("workMin").value)       || 25;
  const shortVal  = parseInt(document.getElementById("shortBreakMin").value) || 5;
  const longVal   = parseInt(document.getElementById("longBreakMin").value)  || 15;
  const afterVal  = parseInt(document.getElementById("longBreakAfter").value)|| 4;

  settings.work            = workVal  * 60;
  settings.shortBreak      = shortVal * 60;
  settings.longBreak       = longVal  * 60;
  settings.longBreakAfter  = afterVal;


  this.classList.add("saved");
  this.innerText = "Saved ✓";
  setTimeout(() => {
    this.classList.remove("saved");
    this.innerText = "Save Settings";
    closeModal();
  }, 800);

  
  if (!isRunning) {
    time          = settings[currentMode];
    totalDuration = settings[currentMode];
    updateDisplay();
  }


  updateDots();

  showToast("Timer settings saved!");
});

// ── Init ──
updateDisplay();
updateDots();
