Adaptive Pomodoro is a smart productivity timer that adjusts session duration based on the user’s actual focus performance.

Unlike traditional timers such as Pomofocus or Forest, this app tracks focus quality, distractions, and task completion after every session and uses this data to adapt future sessions.

Built for the ACM Hackathon.

🚀 Problem

Standard Pomodoro apps assume:

25 minutes works for everyone
Completing a timer means productive work
Distractions and burnout don’t matter

In reality:

Focus span changes during the day
Distractions reduce work quality
Low focus over time leads to burnout
Timer completion ≠ task completion
💡 Solution

Adaptive Pomodoro introduces:

✅ Focus rating after every session (1–5)
✅ Distraction tracking (phone, noise, thoughts, social media)
✅ Task completion tracking
✅ Automatic session duration adjustment
✅ Burnout detection after consecutive low-focus sessions
✅ Session history panel
✅ To-Do list integration

This turns Pomodoro from time tracking into attention tracking.

🧠 How It Works

After each focus session, the user provides:

Focus rating
Distractions faced
Whether the task was completed

The system stores this data in local storage and:

Calculates average focus score
Adjusts next session duration (20–35 minutes)
Detects burnout if last 3 sessions had low focus
Displays session history for self-analysis
🖥 Features
Pomodoro / Short Break / Long Break modes
Circular progress timer UI
To-Do list
Session history log
Feedback modal after each session
Adaptive timer logic
Burnout alert system
🛠 Tech Stack
HTML
CSS
Vanilla JavaScript
LocalStorage (for session data)

No frameworks. No backend. Fully client-side.

▶️ How to Run
Download the project
Open index.html in browser

That’s it.
