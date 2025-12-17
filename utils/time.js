function parseDuration(input) {
  if (!input) return null;
  const str = String(input).trim().toLowerCase();
  if (!str) return null;

  // Unterstützt: 10m, 2h, 7d, 1w, 30s oder Kombinationen wie 1h30m
  const re = /(\d+)\s*(s|sec|secs|second|seconds|m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days|w|week|weeks)/g;
  let match;
  let totalMs = 0;
  let matched = false;

  while ((match = re.exec(str)) !== null) {
    matched = true;
    const n = Number(match[1]);
    const unit = match[2];
    if (!Number.isFinite(n) || n <= 0) return null;

    if (unit === 's' || unit.startsWith('sec')) totalMs += n * 1000;
    else if (unit === 'm' || unit.startsWith('min')) totalMs += n * 60 * 1000;
    else if (unit === 'h' || unit.startsWith('hr') || unit.startsWith('hour')) totalMs += n * 60 * 60 * 1000;
    else if (unit === 'd' || unit.startsWith('day')) totalMs += n * 24 * 60 * 60 * 1000;
    else if (unit === 'w' || unit.startsWith('week')) totalMs += n * 7 * 24 * 60 * 60 * 1000;
    else return null;
  }

  if (!matched) return null;
  return totalMs;
}

function formatMs(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);

  if (d) return `${d}d`;
  if (h) return `${h}h`;
  if (m) return `${m}m`;
  return `${s}s`;
}

module.exports = { parseDuration, formatMs };

