const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(
  path.join(__dirname, 'bot.db'),
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
);

function initDB() {
  db.serialize(() => {
    db.run(
      `
        CREATE TABLE IF NOT EXISTS werbung (
          id INTEGER PRIMARY KEY,
          enabled INTEGER NOT NULL
        )
      `,
      (err) => {
        if (err) console.error('❌ DB: Konnte Tabelle nicht erstellen:', err);
      }
    );

    db.run(
      `
        INSERT OR IGNORE INTO werbung (id, enabled)
        VALUES (1, 0)
      `,
      (err) => {
        if (err) console.error('❌ DB: Konnte Default-State nicht setzen:', err);
      }
    );

    db.run(
      `
        CREATE TABLE IF NOT EXISTS log_channels (
          guild_id TEXT PRIMARY KEY,
          modlog_channel_id TEXT,
          userlog_channel_id TEXT,
          joinleave_channel_id TEXT,
          messagelog_channel_id TEXT
        )
      `,
      (err) => {
        if (err) console.error('❌ DB: Konnte Tabelle log_channels nicht erstellen:', err);
      }
    );

    db.run(
      `
        CREATE TABLE IF NOT EXISTS warnings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          guild_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          mod_id TEXT NOT NULL,
          reason TEXT NOT NULL,
          created_at INTEGER NOT NULL
        )
      `,
      (err) => {
        if (err) console.error('❌ DB: Konnte Tabelle warnings nicht erstellen:', err);
      }
    );
  });
}

function setState(value) {
  db.run(
    'UPDATE werbung SET enabled = ? WHERE id = 1',
    [value ? 1 : 0],
    (err) => {
      if (err) console.error('❌ DB: Konnte State nicht speichern:', err);
    }
  );
}

function getState() {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT enabled FROM werbung WHERE id = 1',
      (err, row) => {
        if (err) return reject(err);
        resolve(row?.enabled === 1);
      }
    );
  });
}

function ensureLogRow(guildId) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT OR IGNORE INTO log_channels (guild_id) VALUES (?)',
      [guildId],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

function setLogChannel(guildId, type, channelId) {
  const map = {
    mod: 'modlog_channel_id',
    user: 'userlog_channel_id',
    joinleave: 'joinleave_channel_id',
    message: 'messagelog_channel_id',
  };

  const col = map[type];
  if (!col) return Promise.reject(new Error(`Unbekannter Log-Typ: ${type}`));

  return ensureLogRow(guildId).then(
    () =>
      new Promise((resolve, reject) => {
        db.run(
          `UPDATE log_channels SET ${col} = ? WHERE guild_id = ?`,
          [channelId, guildId],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      })
  );
}

function clearLogChannel(guildId, type) {
  return setLogChannel(guildId, type, null);
}

function getLogChannels(guildId) {
  return ensureLogRow(guildId).then(
    () =>
      new Promise((resolve, reject) => {
        db.get(
          'SELECT modlog_channel_id, userlog_channel_id, joinleave_channel_id, messagelog_channel_id FROM log_channels WHERE guild_id = ?',
          [guildId],
          (err, row) => {
            if (err) return reject(err);
            resolve(
              row || {
                modlog_channel_id: null,
                userlog_channel_id: null,
                joinleave_channel_id: null,
                messagelog_channel_id: null,
              }
            );
          }
        );
      })
  );
}

function addWarning({ guildId, userId, modId, reason }) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO warnings (guild_id, user_id, mod_id, reason, created_at) VALUES (?, ?, ?, ?, ?)',
      [guildId, userId, modId, reason, Date.now()],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

function getWarnings({ guildId, userId }) {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT id, user_id, mod_id, reason, created_at FROM warnings WHERE guild_id = ? AND user_id = ? ORDER BY created_at DESC',
      [guildId, userId],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      }
    );
  });
}

function removeWarning({ guildId, warningId }) {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM warnings WHERE guild_id = ? AND id = ?',
      [guildId, warningId],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes || 0);
      }
    );
  });
}

module.exports = {
  initDB,
  setState,
  getState,
  setLogChannel,
  clearLogChannel,
  getLogChannels,
  addWarning,
  getWarnings,
  removeWarning,
};
