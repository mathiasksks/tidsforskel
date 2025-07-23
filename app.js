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
    ":" + pad(localDate.getMinutes())
  );
}
// Helper to combine date and seconds input
function combineDateAndSeconds(dtString, sec) {
  if (!dtString) return "";
  // dtString format: "YYYY-MM-DDTHH:MM"
  // Add seconds
  var secVal = pad(Math.max(0, Math.min(59, parseInt(sec) || 0)));
  return dtString + ":" + secVal;
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
  var realtidInput = document.getElementById('realtid-dt'),
      realtidSecInput = document.getElementById('realtid-sec'),
      systemtidInput = document.getElementById('systemtid-dt'),
      systemtidSecInput = document.getElementById('systemtid-sec'),
      interessepunktInput = document.getElementById('interessepunkt-dt'),
      interessepunktSecInput = document.getElementById('interessepunkt-sec'),
      diffDiv = document.getElementById('diff'),
      interessepunktTimestampDiv = document.getElementById('interessepunkt-timestamp');

  // Set initial values (seconds default to now's seconds)
  function setInitialDateTimeAndSeconds(input, secInput) {
    input.value = isoLocalWithSeconds(now, defaultOffset);
    secInput.value = pad(now.getSeconds());
  }
  setInitialDateTimeAndSeconds(realtidInput, realtidSecInput);
  setInitialDateTimeAndSeconds(systemtidInput, systemtidSecInput);
  setInitialDateTimeAndSeconds(interessepunktInput, interessepunktSecInput);

  function updateDiffs() {
    var rTime = combineDateAndSeconds(realtidInput.value, realtidSecInput.value),
        sTime = combineDateAndSeconds(systemtidInput.value, systemtidSecInput.value),
        iTime = combineDateAndSeconds(interessepunktInput.value, interessepunktSecInput.value);

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

  // Listen to changes
  [realtidInput, realtidSecInput, systemtidInput, systemtidSecInput, interessepunktInput, interessepunktSecInput].forEach(function (el) {
    el.addEventListener('input', updateDiffs);
  });

  updateDiffs();
});
