// multiple formats (e.g. yyyy/mm/dd (ymd) or mm-dd-yyyy (mdy) etc.)
export function tryParseDateFromString(
  dateStringCandidateValue,
  format = "ymd"
) {
  const candidate = (dateStringCandidateValue || ``)
    .split(/[ :\-\/]/g)
    .map(Number)
    .filter((v) => !isNaN(v));
  const toDate = () => {
    format = [...format].reduce((acc, val, i) => ({ ...acc, [val]: i }), {});
    const parts = [
      candidate[format.y],
      candidate[format.m] - 1,
      candidate[format.d],
    ].concat(candidate.length > 3 ? candidate.slice(3) : []);
    const checkDate = (d) =>
      (d.getDate &&
        ![d.getFullYear(), d.getMonth(), d.getDate()].find(
          (v, i) => v !== parts[i]
        ) &&
        d) ||
      undefined;

    return checkDate(new Date(Date.UTC(...parts)));
  };

  return candidate.length < 3 ? undefined : toDate();
}

export function convertSecondsToDate(ts) {
  const dt = new Date(ts * 1000);
  return dt.toLocaleDateString();
}

export function convertSecondsToYear(ts) {
  const dt = new Date(ts * 1000);
  return dt.getYear() + 1900;
}

export function convertSecondsToDayMonth(ts) {
  const dt = new Date(ts * 1000);
  return pad(dt.getDate(), 2) + "/" + pad(dt.getMonth() + 1, 2);
}

export function convertSecondsFrom01011970ToDate(ts) {
  const dt1970 = tryParseDateFromString("01/01/1970", "d/m/y");
  const secs1970 = dt1970.getTime();
  const dt = new Date(ts * 1000 + secs1970);
  return dt.toLocaleDateString();
}

export function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

export function interpolate(a, b, frac) {
  // points A and B, frac between 0 and 1
  var nx = a.x + (b.x - a.x) * frac;
  var ny = a.y + (b.y - a.y) * frac;
  return { x: nx, y: ny };
}

export function stringToPoint(ballPos) {
  var pos = ballPos !== null ? ballPos.split(",") : [0, 0];
  var x = pos[0];
  var y = pos[1];
  return { x: x, y: y };
}
