// Danish DST helper (UTC+1 or UTC+2)
function getDenmarkOffset(date) {
  var year = date.getFullYear();
  var march = new Date(year, 2, 31), marchLastSunday = new Date(year, 2, 31 - march.getDay());
  var october = new Date(year, 9, 31), octoberLastSunday = new Date(year, 9, 31 - october.getDay());
  var dstStart = new Date(year, 2, marchLastSunday.getDate(), 2, 0, 0); // 02:00 local
  var dstEnd = new Date(year, 9, octoberLastSunday.getDate(), 3, 0, 0); // 03:00 local
  return (date >= dstStart && date < dstEnd) ? 2 : 1;
}
function pad(n) { return n < 10 ? "0" + n : n; }
function isoLocalWithSeconds(date, offset) {
  var localDate = new Date(date.getTime() + offset * 60 * 60 * 1000);
  return (
    localDate.getFullYear() +
    "-" + pad(localDate.getMonth() + 1) +
    "-" + pad(localDate.getDate()) +
    "T" + pad(localDate.getHours()) +
    ":" + pad(localDate.getMinutes()) +
    ":" + pad(localDate.getSeconds())
  );
}
function fromLocalInputValue(value, offset) {
  var localDate = new Date(value);
  return new Date(localDate.getTime() - offset * 60 * 60 * 1000);
}
function formatDiff(ms) {
  var absMs = Math.abs(ms), sign = ms >= 0 ? "" : "-";
  var hours = Math.floor(absMs / 3600000),
      minutes = Math.floor((absMs % 3600000) / 60000),
      seconds = Math.floor((absMs % 60000) / 1000);
  return sign + hours + "h " + minutes + "m " + seconds + "s";
}
function formatDisplayDateDDMMYYYY(date, offset) {
  var localDate = new Date(date.getTime() + offset * 60 * 60 * 1000);
  return (
    pad(localDate.getDate()) + "-" +
    pad(localDate.getMonth() + 1) + "-" +
    localDate.getFullYear() + " " +
    pad(localDate.getHours()) + ":" +
    pad(localDate.getMinutes()) + ":" +
    pad(localDate.getSeconds())
  );
}
window.addEventListener('DOMContentLoaded', function () {
  var now = new Date(), defaultOffset = getDenmarkOffset(now);
  var realtidInput = document.getElementById('realtid'),
      systemtidInput = document.getElementById('systemtid'),
      interessepunktInput = document.getElementById('interessepunkt'),
      diffDiv = document.getElementById('diff'),
      interessepunktTimestampDiv = document.getElementById('interessepunkt-timestamp');
  realtidInput.value = isoLocalWithSeconds(now, defaultOffset);
  systemtidInput.value = isoLocalWithSeconds(now, defaultOffset);
  interessepunktInput.value = isoLocalWithSeconds(now, defaultOffset);
  function updateDiffs() {
    var rTime = realtidInput.value, sTime = systemtidInput.value, iTime = interessepunktInput.value;
    var rOffset = getDenmarkOffset(new Date(rTime)),
        sOffset = getDenmarkOffset(new Date(sTime));
    if (!rTime || !sTime) {
      diffDiv.textContent = "Indtast både Realtid og Systemtid.";
      interessepunktTimestampDiv.textContent = "";
      return;
    }
    var rUTC = fromLocalInputValue(rTime, rOffset),
        sUTC = fromLocalInputValue(sTime, sOffset);
    var diffMs = sUTC.getTime() - rUTC.getTime();
    diffDiv.textContent = "Differens (Systemtid - Realtid): " + formatDiff(diffMs);
    // Interessepunkt (systemtid): systemtid - realtid + interessepunkt
    if (!iTime) {
      interessepunktTimestampDiv.textContent = "Indtast Interessepunkt (realtid).";
      return;
    }
    var iOffset = getDenmarkOffset(new Date(iTime)),
        iUTC = fromLocalInputValue(iTime, iOffset);
    var interessepunktUTC = new Date(iUTC.getTime() + diffMs);
    var interessepunktLocal = formatDisplayDateDDMMYYYY(interessepunktUTC, iOffset);
    interessepunktTimestampDiv.textContent =
      "Interessepunkt (systemtid): " + interessepunktLocal;
  }
  realtidInput.addEventListener('input', updateDiffs);
  systemtidInput.addEventListener('input', updateDiffs);
  interessepunktInput.addEventListener('input', updateDiffs);
  updateDiffs();
});