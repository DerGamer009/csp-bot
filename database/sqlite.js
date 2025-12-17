const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(
  path.join(__dirname, 'bot.db'),
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
);

function initDB() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS werbung (
        id INTEGER PRIMARY KEY,
        enabled INTEGER NOT NULL
      )
    `);

    db.run(`
      INSERT OR IGNORE INTO werbung (id, enabled)
      VALUES (1, 0)
    `);
  });
}

function setState(value) {
  db.run(
    'UPDATE werbung SET enabled = ? WHERE id = 1',
    [value ? 1 : 0]
  );
}

function getState() {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT enabled FROM werbung WHERE id = 1',
      (err, row) => {
        if (err) return reject(err);
        resolve(row.enabled === 1);
      }
    );
  });
}

module.exports = {
  initDB,
  setState,
  getState,
};
