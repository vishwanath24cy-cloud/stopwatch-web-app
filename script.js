"use strict";

(function () {
  var timeDisplay = document.getElementById("timeDisplay");
  var startBtn = document.getElementById("startBtn");
  var pauseBtn = document.getElementById("pauseBtn");
  var resetBtn = document.getElementById("resetBtn");
  var lapBtn = document.getElementById("lapBtn");
  var lapList = document.getElementById("lapList");
  var lapCount = document.getElementById("lapCount");
  var emptyState = document.getElementById("emptyState");

  var startTime = 0;
  var elapsedMs = 0;
  var timerId = null;
  var lapTimes = [];

  function pad(number, digits) {
    return String(number).padStart(digits, "0");
  }

  function formatTime(totalMs) {
    var hours = Math.floor(totalMs / 3600000);
    var minutes = Math.floor((totalMs % 3600000) / 60000);
    var seconds = Math.floor((totalMs % 60000) / 1000);
    var milliseconds = totalMs % 1000;
    return (
      pad(hours, 2) +
      ":" +
      pad(minutes, 2) +
      ":" +
      pad(seconds, 2) +
      "." +
      pad(milliseconds, 3)
    );
  }

  function setControlState(isRunning) {
    startBtn.disabled = isRunning;
    pauseBtn.disabled = !isRunning;
    lapBtn.disabled = !isRunning;
    resetBtn.disabled = isRunning && elapsedMs === 0 ? true : elapsedMs === 0;
  }

  function renderTime() {
    timeDisplay.textContent = formatTime(elapsedMs);
  }

  function update() {
    elapsedMs = Date.now() - startTime;
    renderTime();
  }

  function startStopwatch() {
    if (timerId !== null) return;
    startTime = Date.now() - elapsedMs;
    timerId = window.setInterval(update, 10);
    setControlState(true);
  }

  function pauseStopwatch() {
    if (timerId === null) return;
    window.clearInterval(timerId);
    timerId = null;
    update();
    setControlState(false);
  }

  function resetStopwatch() {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
    elapsedMs = 0;
    lapTimes = [];
    renderTime();
    renderLaps();
    setControlState(false);
  }

  function renderLaps() {
    lapList.innerHTML = "";
    if (lapTimes.length === 0) {
      emptyState.hidden = false;
      lapCount.textContent = "0 laps";
      return;
    }

    emptyState.hidden = true;
    lapCount.textContent = lapTimes.length + (lapTimes.length === 1 ? " lap" : " laps");

    var fragment = document.createDocumentFragment();
    for (var i = lapTimes.length - 1; i >= 0; i -= 1) {
      var li = document.createElement("li");
      li.className = "lap-item";
      li.innerHTML =
        "<strong>Lap " +
        (i + 1) +
        "</strong><span>" +
        formatTime(lapTimes[i]) +
        "</span>";
      fragment.appendChild(li);
    }
    lapList.appendChild(fragment);
  }

  function recordLap() {
    if (timerId === null) return;
    lapTimes.push(elapsedMs);
    renderLaps();
  }

  startBtn.addEventListener("click", startStopwatch);
  pauseBtn.addEventListener("click", pauseStopwatch);
  resetBtn.addEventListener("click", resetStopwatch);
  lapBtn.addEventListener("click", recordLap);

  renderTime();
  renderLaps();
  setControlState(false);
})();
