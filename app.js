function pad(n) { return n < 10 ? "0" + n : n; }

// Parse dd-mm-yyyy hh:mm:ss string to Date object (local time)
function parseCustomTimestamp(str) {
  // Match dd-mm-yyyy hh:mm:ss
  const match = str.match(/^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/);
  if (!match) return null;
  // JS months are 0-based
  const [_, dd, mm, yyyy, hh, min, ss] = match;
  return new Date(
    Number(yyyy),
    Number(mm) - 1,
    Number(dd),
    Number(hh),
    Number(min),
    Number(ss)
  );
}

function formatDiff(dateA, dateB) {
  if (!dateA || !dateB) return "Ugyldigt input";
  var ms = dateA - dateB;
  var absMs = Math.abs(ms), sign = ms >= 0 ? "" : "-";
  var hours = Math.floor(absMs / 3600000),
      minutes = Math.floor((absMs % 3600000) / 60000),
      seconds = Math.floor((absMs % 60000) / 1000);
  return sign + hours + "h " + minutes + "m " + seconds + "s";
}

function formatDisplayDateDDMMYYYY(date) {
  if (!date) return "Ugyldigt input";
  return (
    pad(date.getDate()) + "-" +
    pad(date.getMonth() + 1) + "-" +
    date.getFullYear() + " " +
    pad(date.getHours()) + ":" +
    pad(date.getMinutes()) + ":" +
    pad(date.getSeconds())
  );
}

window.addEventListener('DOMContentLoaded', function () {
  var now = new Date();
  function getNowString() {
    return pad(now.getDate()) + "-" + pad(now.getMonth() + 1) + "-" + now.getFullYear() +
      " " + pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
  }

  var realtidInput = document.getElementById('realtid-txt'),
      systemtidInput = document.getElementById('systemtid-txt'),
      interessepunktInput = document.getElementById('interessepunkt-txt'),
      diffDiv = document.getElementById('diff'),
      interessepunktTimestampDiv = document.getElementById('interessepunkt-timestamp');

  // Set initial values to now
  realtidInput.value = getNowString();
  systemtidInput.value = getNowString();
  interessepunktInput.value = getNowString();

  function updateDiffs() {
    var rDate = parseCustomTimestamp(realtidInput.value),
        sDate = parseCustomTimestamp(systemtidInput.value),
        iDate = parseCustomTimestamp(interessepunktInput.value);

    diffDiv.textContent = "Systemtid - Realtid: " + formatDiff(sDate, rDate);

    interessepunktTimestampDiv.textContent =
      "Interessepunkt (DD-MM-YYYY HH:mm:ss): " +
      formatDisplayDateDDMMYYYY(iDate);
  }

  realtidInput.addEventListener('input', updateDiffs);
  systemtidInput.addEventListener('input', updateDiffs);
  interessepunktInput.addEventListener('input', updateDiffs);

  updateDiffs();
});
