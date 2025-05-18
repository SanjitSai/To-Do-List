let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

function getCountdown(dateStr) {
  const now = new Date();
  const deadline = new Date(dateStr);
  const diff = deadline - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days <= 0 ? "Overdue" : `Due in ${days} day(s)`;
}

function addTask() {
  const title = document.getElementById("taskTitle").value.trim();
  const priority = document.getElementById("taskPriority").value;
  const deadline = document.getElementById("taskDeadline").value;
  if (!title || !deadline) return alert("Please enter task title and deadline.");
  tasks.push({ id: Date.now(), title, priority, deadline, completed: false });
  saveTasks();
  renderTasks();
  document.getElementById("taskTitle").value = "";
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const statusFilter = document.getElementById("filterStatus").value;
  const priorityFilter = document.getElementById("filterPriority").value;
  const sortOption = document.getElementById("sortOption").value;

  let filtered = tasks.filter(task => {
    const statusMatch = statusFilter === "All" || (statusFilter === "Completed" ? task.completed : !task.completed);
    const priorityMatch = priorityFilter === "All" || task.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  if (sortOption === "deadline") {
    filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  } else {
    const prioMap = { High: 1, Medium: 2, Low: 3 };
    filtered.sort((a, b) => prioMap[a.priority] - prioMap[b.priority]);
  }

  filtered.forEach(task => {
    const li = document.createElement("li");
    li.className = `list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'completed' : ''}`;

    const info = document.createElement("div");
    info.className = "d-flex flex-column";

    const title = document.createElement("span");
    title.className = "task-title fw-bold";
    title.textContent = task.title;

    const meta = document.createElement("small");
    meta.innerHTML = `
      <span class="me-2 priority-${task.priority.toLowerCase()}">${task.priority}</span>
      <span class="me-2 ${new Date(task.deadline) < new Date() ? 'overdue' : ''}">${task.deadline}</span>
      <span class="countdown">${getCountdown(task.deadline)}</span>`;

    info.appendChild(title);
    info.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "btn-group btn-group-sm";

    const completeBtn = document.createElement("button");
    completeBtn.className = `btn btn-${task.completed ? 'success' : 'outline-success'}`;
    completeBtn.innerHTML = '<i class="bi bi-check-lg"></i>';
    completeBtn.onclick = () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    };

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-outline-primary";
    editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
    editBtn.onclick = () => editTask(task);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-outline-danger";
    deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
    deleteBtn.onclick = () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    };

    actions.appendChild(completeBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(info);
    li.appendChild(actions);
    list.appendChild(li);
  });
}

function editTask(task) {
  const newTitle = prompt("Edit Task Title", task.title);
  if (!newTitle) return;
  const newPriority = prompt("Edit Priority (High, Medium, Low)", task.priority);
  const newDeadline = prompt("Edit Deadline (YYYY-MM-DD)", task.deadline);
  if (!newPriority || !newDeadline) return;
  task.title = newTitle;
  task.priority = newPriority;
  task.deadline = newDeadline;
  saveTasks();
  renderTasks();
}

renderTasks();
