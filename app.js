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
  var realtidInput = document.getElementById('realtid-dt'),
      systemtidInput = document.getElementById('systemtid-dt'),
      interessepunktInput = document.getElementById('interessepunkt-dt'),
      diffDiv = document.getElementById('diff'),
      interessepunktTimestampDiv = document.getElementById('interessepunkt-timestamp');

  // Set initial values (seconds included)
  function setInitialDateTime(input) {
    input.value = isoLocalWithSeconds(now, defaultOffset);
  }
  setInitialDateTime(realtidInput);
  setInitialDateTime(systemtidInput);
  setInitialDateTime(interessepunktInput);

  function updateDiffs() {
    var rTime = realtidInput.value,
        sTime = systemtidInput.value,
        iTime = interessepunktInput.value;

    var rOffset = getDenmarkOffset(new Date(rTime)),
        sOffset = getDenmarkOffset(new Date(sTime));

    var rDate = fromLocalInputValue(rTime, rOffset),
        sDate = fromLocalInputValue(sTime, sOffset),
        iDate = fromLocalInputValue(iTime, rOffset);

    var diff = sDate - rDate;
    diffDiv.textContent = "Systemtid - Realtid: " + formatDiff(diff);

    interessepunktTimestampDiv.textContent =
      "Interessepunkt (DD-MM-YYYY HH:mm:ss): " +
      formatDisplayDateDDMMYYYY(iDate, rOffset);
  }

  realtidInput.addEventListener('input', updateDiffs);
  systemtidInput.addEventListener('input', updateDiffs);
  interessepunktInput.addEventListener('input', updateDiffs);

  updateDiffs();
});

// You still need to define getDenmarkOffset as before
