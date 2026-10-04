import * as SQLite from 'expo-sqlite';

const databasePromise = SQLite.openDatabaseAsync('student_tasks.db');

// Create the database table.
export async function initDatabase() {
  const db = await databasePromise;

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subject TEXT NOT NULL,
      deadline TEXT NOT NULL,
      description TEXT DEFAULT '',
      completed INTEGER NOT NULL DEFAULT 0
    );
  `);
}

// Get all tasks.
export async function getTasks() {
  const db = await databasePromise;

  return db.getAllAsync(`
    SELECT *
    FROM tasks
    ORDER BY completed ASC, deadline ASC, id DESC
  `);
}

// Add a new task.
export async function addTask(task) {
  const db = await databasePromise;

  await db.runAsync(
    `INSERT INTO tasks (title, subject, deadline, description)
     VALUES (?, ?, ?, ?)`,
    [task.title, task.subject, task.deadline, task.description || '']
  );
}

// Change task status.
export async function updateTaskStatus(id, completed) {
  const db = await databasePromise;

  await db.runAsync(
    'UPDATE tasks SET completed = ? WHERE id = ?',
    [completed ? 1 : 0, id]
  );
}

// Delete a task.
export async function deleteTask(id) {
  const db = await databasePromise;

  await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
}