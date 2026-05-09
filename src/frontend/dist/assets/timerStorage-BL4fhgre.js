const TIMER_PREFIX = "timer:";
function timerKey(sessionId) {
  return `${TIMER_PREFIX}${sessionId}`;
}
function getElapsedSeconds(sessionId) {
  try {
    const raw = localStorage.getItem(timerKey(sessionId));
    if (raw === null) return 0;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  } catch {
    return 0;
  }
}
function setElapsedSeconds(sessionId, seconds) {
  try {
    const value = Math.max(0, Math.floor(seconds));
    localStorage.setItem(timerKey(sessionId), String(value));
  } catch {
  }
}
function clearTimer(sessionId) {
  try {
    localStorage.removeItem(timerKey(sessionId));
  } catch {
  }
}
const clearElapsedSeconds = clearTimer;
function formatElapsed(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor(s % 3600 / 60);
  const secs = s % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${mins}:${String(secs).padStart(2, "0")}`;
}
export {
  clearElapsedSeconds as c,
  formatElapsed as f,
  getElapsedSeconds as g,
  setElapsedSeconds as s
};
