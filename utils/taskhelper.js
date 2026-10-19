// Sort tasks by completion and deadline.
export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    // Pending tasks come first.
    if (a.completed !== b.completed) {
      return a.completed - b.completed;
    }

    // Earlier deadline comes first.
    return a.deadline.localeCompare(b.deadline);
  });
}

// Check if a task is overdue.
export function isOverdue(task) {
  // Completed tasks are not overdue.
  if (task.completed === 1) {
    return true;
  }

  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const todayDate = `${year}-${month}-${day}`;

  return task.deadline < todayDate;
}

// Filter tasks.
export function filterTasks(tasks, filter, subject) {
  return tasks.filter((task) => {
    // Show pending tasks only.
    if (filter === 'Pending' && task.completed === 1) {
      return false;
    }

    // Show completed tasks only.
    if (filter === 'Completed' && task.completed === 0) {
      return false;
    }

    // Filter by subject.
    if (subject !== 'All' && task.subject !== subject) {
      return false;
    }

    return true;
  });
}

// Check if the date is valid.
export function isValidDeadline(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsedDate = new Date(`${date}T00:00:00Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  return parsedDate.toISOString().slice(0, 10) === date;
}