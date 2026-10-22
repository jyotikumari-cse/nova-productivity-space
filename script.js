document.addEventListener("DOMContentLoaded", () => {
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");
const clearCompletedButton = document.getElementById("clear-completed");
let tasks = [];

try {
    const savedTasks = JSON.parse(localStorage.getItem("nova-tasks"));

    if (Array.isArray(savedTasks)) {
        tasks = savedTasks.filter(task =>
            task &&
            typeof task.id === "string" &&
            typeof task.text === "string" &&
            typeof task.completed === "boolean"
        );
    }
} catch {
    tasks = [];
}

function saveTasks() {
    localStorage.setItem("nova-tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.replaceChildren();

    tasks.forEach(task => {
        const item = document.createElement("li");
        item.className = "task-item";

        if (task.completed) {
            item.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task complete");

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const text = document.createElement("span");
        text.className = "task-text";
        text.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-task";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(currentTask => currentTask.id !== task.id);
            saveTasks();
            renderTasks();
        });

        item.append(checkbox, text, deleteButton);
        taskList.appendChild(item);
    });

    const remaining = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${remaining} remaining · ${tasks.length} total`;
    emptyMessage.hidden = tasks.length > 0;
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        taskInput.focus();
        return;
    }

    tasks.push({
        id: crypto.randomUUID(),
        text: text,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
});

clearCompletedButton.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});

renderTasks();

});
// NOVA STUDY PLANNER

const studyForm = document.getElementById("study-form");
const studyInput = document.getElementById("study-input");
const studyList = document.getElementById("study-list");
const studyCount = document.getElementById("study-count");
const studyProgress = document.getElementById("study-progress");
const studyProgressBar = document.getElementById("study-progress-bar");
const studyEmpty = document.getElementById("study-empty");

let studyTasks = JSON.parse(localStorage.getItem("nova-study-tasks")) || [];

function saveStudyTasks() {
    localStorage.setItem("nova-study-tasks", JSON.stringify(studyTasks));
}

function updateStudyProgress() {
    const total = studyTasks.length;
    const completed = studyTasks.filter(task => task.completed).length;

    studyCount.textContent = `${total} study task${total !== 1 ? "s" : ""}`;

    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    studyProgress.textContent = `${percentage}% completed`;
    studyProgressBar.style.width = `${percentage}%`;

    studyEmpty.style.display = total === 0 ? "block" : "none";
}

function renderStudyTasks() {
    studyList.innerHTML = "";

    studyTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "study-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark study task as completed");

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveStudyTasks();
            renderStudyTasks();
        });

        const span = document.createElement("span");
        span.className = "study-text";
        span.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-study";
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            studyTasks = studyTasks.filter(item => item.id !== task.id);
            saveStudyTasks();
            renderStudyTasks();
        });

        li.append(checkbox, span, deleteButton);
        studyList.appendChild(li);
    });

    updateStudyProgress();
}

studyForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const text = studyInput.value.trim();

    if (text === "") {
        return;
    }

    studyTasks.push({
        id: Date.now() + Math.random(),
        text: text,
        completed: false
    });

    saveStudyTasks();
    renderStudyTasks();

    studyInput.value = "";
    studyInput.focus();
});

renderStudyTasks();
// NOVA QUICK NOTES

const notesForm = document.getElementById("notes-form");
const noteTitle = document.getElementById("note-title");
const noteContent = document.getElementById("note-content");
const notesList = document.getElementById("notes-list");
const notesCount = document.getElementById("notes-count");
const notesEmpty = document.getElementById("notes-empty");

let notes = [];

try {
const savedNotes = JSON.parse(localStorage.getItem("nova-notes"));

if (Array.isArray(savedNotes)) {
    notes = savedNotes.filter(note =>
        note &&
        typeof note.id === "string" &&
        typeof note.title === "string" &&
        typeof note.content === "string"
    );
}

} catch {
notes = [];
}

function saveNotes() {
localStorage.setItem("nova-notes", JSON.stringify(notes));
}

function renderNotes() {
notesList.replaceChildren();

notes.forEach(note => {
    const card = document.createElement("article");
    card.className = "note-card";

    const title = document.createElement("h3");
    title.textContent = note.title;

    const content = document.createElement("p");
    content.textContent = note.content;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-note";
    deleteButton.textContent = "Delete Note";

    deleteButton.addEventListener("click", () => {
        notes = notes.filter(item => item.id !== note.id);
        saveNotes();
        renderNotes();
    });

    card.append(title, content, deleteButton);
    notesList.appendChild(card);
});

notesCount.textContent =
    `${notes.length} note${notes.length !== 1 ? "s" : ""} saved`;

notesEmpty.hidden = notes.length > 0;

}

notesForm.addEventListener("submit", function(event) {
event.preventDefault();

const title = noteTitle.value.trim();
const content = noteContent.value.trim();

if (!title || !content) {
    return;
}

notes.unshift({
    id: String(Date.now()) + Math.random().toString(36).slice(2),
    title: title,
    content: content
});

saveNotes();
renderNotes();

notesForm.reset();
noteTitle.focus();

});

renderNotes();
// NOVA CAREER TRACKER

const careerForm = document.getElementById("career-form");
const careerInput = document.getElementById("career-input");
const careerList = document.getElementById("career-list");
const careerTotal = document.getElementById("career-total");
const careerCompleted = document.getElementById("career-completed");
const careerPercentage = document.getElementById("career-percentage");
const careerProgressBar = document.getElementById("career-progress-bar");
const careerEmpty = document.getElementById("career-empty");

let careerGoals = [];

try {
const savedGoals = JSON.parse(localStorage.getItem("nova-career-goals"));

if (Array.isArray(savedGoals)) {
    careerGoals = savedGoals.filter(goal =>
        goal &&
        typeof goal.id === "string" &&
        typeof goal.text === "string" &&
        typeof goal.completed === "boolean"
    );
}

} catch {
careerGoals = [];
}

function saveCareerGoals() {
localStorage.setItem("nova-career-goals", JSON.stringify(careerGoals));
}

function renderCareerGoals() {
careerList.replaceChildren();

careerGoals.forEach(goal => {
    const item = document.createElement("li");
    item.className = "career-item";

    if (goal.completed) {
        item.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = goal.completed;
    checkbox.setAttribute("aria-label", "Mark goal as completed");

    checkbox.addEventListener("change", () => {
        goal.completed = checkbox.checked;
        saveCareerGoals();
        renderCareerGoals();
    });

    const text = document.createElement("span");
    text.textContent = goal.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "career-delete";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
        careerGoals = careerGoals.filter(item => item.id !== goal.id);
        saveCareerGoals();
        renderCareerGoals();
    });

    item.append(checkbox, text, deleteButton);
    careerList.appendChild(item);
});

const total = careerGoals.length;
const completed = careerGoals.filter(goal => goal.completed).length;
const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

careerTotal.textContent = total;
careerCompleted.textContent = completed;
careerPercentage.textContent = percentage + "%";
careerProgressBar.style.width = percentage + "%";

careerEmpty.hidden = total > 0;

}

careerForm.addEventListener("submit", function(event) {
event.preventDefault();

const text = careerInput.value.trim();

if (!text) {
    return;
}

careerGoals.unshift({
    id: String(Date.now()) + Math.random().toString(36).slice(2),
    text: text,
    completed: false
});

saveCareerGoals();
renderCareerGoals();

careerForm.reset();
careerInput.focus();

});

renderCareerGoals();

// NOVA SMART DASHBOARD

function getDashboardData(key) {
try {
const data = JSON.parse(localStorage.getItem(key));
return Array.isArray(data) ? data : [];
} catch {
return [];
}
}

function updateNovaDashboard() {
const taskCard = document.getElementById("dashboard-tasks");
const studyCard = document.getElementById("dashboard-study");
const notesCard = document.getElementById("dashboard-notes");
const careerCard = document.getElementById("dashboard-career");

if (!taskCard || !studyCard || !notesCard || !careerCard) {
    return;
}

const tasks = getDashboardData("nova-tasks");
const studyTasks = getDashboardData("nova-study-tasks");
const notes = getDashboardData("nova-notes");
const careerGoals = getDashboardData("nova-career-goals");

const completedTasks = tasks.filter(task => task.completed).length;

const completedStudyTasks = studyTasks.filter(
    task => task.completed
).length;

const completedCareerGoals = careerGoals.filter(
    goal => goal.completed
).length;

const studyProgress = studyTasks.length
    ? Math.round((completedStudyTasks / studyTasks.length) * 100)
    : 0;

const careerProgress = careerGoals.length
    ? Math.round((completedCareerGoals / careerGoals.length) * 100)
    : 0;

taskCard.textContent = completedTasks;
studyCard.textContent = studyProgress + "%";
notesCard.textContent = notes.length;
careerCard.textContent = careerProgress + "%";

}

document.addEventListener("DOMContentLoaded", updateNovaDashboard);

document.addEventListener("submit", function() {
setTimeout(updateNovaDashboard, 0);
});

document.addEventListener("change", function() {
setTimeout(updateNovaDashboard, 0);
});

document.addEventListener("click", function() {
setTimeout(updateNovaDashboard, 0);
});

window.addEventListener("storage", updateNovaDashboard);

// NOVA REAL PROGRESS CHART

function getChartData(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function updateProgressChart() {
    const tasks = getChartData("nova-tasks");
    const studyTasks = getChartData("nova-study-tasks");
    const notes = getChartData("nova-notes");
    const careerGoals = getChartData("nova-career-goals");

    const taskCompleted = tasks.filter(task => task.completed).length;
    const studyCompleted = studyTasks.filter(task => task.completed).length;
    const careerCompleted = careerGoals.filter(goal => goal.completed).length;

    const taskProgress = tasks.length
        ? Math.round((taskCompleted / tasks.length) * 100)
        : 0;

    const studyProgress = studyTasks.length
        ? Math.round((studyCompleted / studyTasks.length) * 100)
        : 0;

    const careerProgress = careerGoals.length
        ? Math.round((careerCompleted / careerGoals.length) * 100)
        : 0;

    // Each saved note represents 10%, up to 10 notes.
    const notesProgress = Math.min(notes.length * 10, 100);

    const chartBars = [
        ["chart-task-bar", taskProgress],
        ["chart-study-bar", studyProgress],
        ["chart-notes-bar", notesProgress],
        ["chart-career-bar", careerProgress]
    ];

    chartBars.forEach(([id, progress]) => {
        const bar = document.getElementById(id);

        if (bar) {
            bar.style.height = Math.max(progress, 0) + "%";
            bar.title = progress + "%";
        }
    });
}

document.addEventListener("DOMContentLoaded", updateProgressChart);

document.addEventListener("submit", () => {
    setTimeout(updateProgressChart, 100);
});

document.addEventListener("change", () => {
    setTimeout(updateProgressChart, 100);
});

document.addEventListener("click", () => {
    setTimeout(updateProgressChart, 100);
});

window.addEventListener("storage", updateProgressChart);