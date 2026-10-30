
"use strict";

// ========================================
// 1. Elements
// ========================================

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const message = document.getElementById("message");
const stats = document.getElementById("stats");
const searchInput = document.getElementById("searchInput");
const languageSelect = document.getElementById("languageSelect");

const progressFill = document.getElementById("progressFill");
const progressPercentage = document.getElementById("progressPercentage");
const progressBar = document.getElementById("progressBar");
const emptyState = document.getElementById("emptyState");

const deleteCompletedBtn = document.getElementById("deleteCompletedBtn");
const exportBtn = document.getElementById("exportBtn");
const clearBtn = document.getElementById("clearBtn");


// ========================================
// 2. Translations
// ========================================

const translations = {

    en: {
        title: "My To-Do List",
        add: "Add Task",
        taskPlaceholder: "Enter a task...",
        searchPlaceholder: "Search tasks...",
        notePlaceholder: "Add a note...",
        all: "All",
        active: "Active",
        completed: "Completed",
        deleteCompleted: "Delete Completed",
        export: "Export",
        clearAll: "Clear All",
        totalTasks: "Total tasks:",
        progress: "Progress",
        empty: "No tasks yet. Add your first task!",
        noResults: "No tasks found.",
        total: "Total",
        done: "Completed",
        remaining: "Remaining",
        added: "Task added successfully.",
        invalid: "Please enter a valid task.",
        duplicate: "This task already exists.",
        deleted: "Task deleted.",
        markedDone: "Task marked as completed.",
        markedActive: "Task marked as active.",
        updated: "Task updated successfully.",
        noCompleted: "No completed tasks to delete.",
        completedDeleted: "Completed tasks deleted.",
        cleared: "All tasks cleared.",
        exported: "Tasks exported successfully.",
        confirmDelete: "Are you sure you want to delete this task?",
        confirmCompleted: "Delete all completed tasks?",
        confirmClear: "Are you sure you want to delete all tasks?",
        edit: "Edit",
        delete: "Delete",
        markDone: "Mark as completed",
        markActive: "Mark as active",
        exportName: "my_tasks"
    },

    ar: {
        title: "قائمة مهامي",
        add: "إضافة مهمة",
        taskPlaceholder: "اكتب مهمة جديدة...",
        searchPlaceholder: "ابحث عن المهام...",
        notePlaceholder: "أضف ملاحظة...",
        all: "الكل",
        active: "النشطة",
        completed: "المكتملة",
        deleteCompleted: "حذف المكتملة",
        export: "تصدير",
        clearAll: "حذف الكل",
        totalTasks: "إجمالي المهام:",
        progress: "نسبة الإنجاز",
        empty: "لا توجد مهام بعد. أضف أول مهمة!",
        noResults: "لم يتم العثور على مهام.",
        total: "الإجمالي",
        done: "المكتملة",
        remaining: "المتبقية",
        added: "تمت إضافة المهمة بنجاح.",
        invalid: "من فضلك أدخل مهمة صحيحة.",
        duplicate: "هذه المهمة موجودة بالفعل.",
        deleted: "تم حذف المهمة.",
        markedDone: "تم تحديد المهمة كمكتملة.",
        markedActive: "تم إلغاء اكتمال المهمة.",
        updated: "تم تعديل المهمة بنجاح.",
        noCompleted: "لا توجد مهام مكتملة لحذفها.",
        completedDeleted: "تم حذف المهام المكتملة.",
        cleared: "تم حذف جميع المهام.",
        exported: "تم تصدير المهام بنجاح.",
        confirmDelete: "هل أنت متأكد من حذف هذه المهمة؟",
        confirmCompleted: "هل تريد حذف جميع المهام المكتملة؟",
        confirmClear: "هل أنت متأكد من حذف جميع المهام؟",
        edit: "تعديل",
        delete: "حذف",
        markDone: "تحديد كمكتملة",
        markActive: "إلغاء الاكتمال",
        exportName: "مهامي"
    }

};


// ========================================
// 3. Application State
// ========================================

let tasks = [];
let currentFilter = "all";
let currentLanguage = "en";
let messageTimer;


// ========================================
// 4. Storage
// ========================================

function saveTasks() {

    try {

        localStorage.setItem(
            "todoTasks",
            JSON.stringify(tasks)
        );

        return true;

    } catch (error) {

        console.error("Storage error:", error);

        showMessage(
            "Unable to save tasks. Check browser storage.",
            true
        );

        return false;
    }
}


function loadTasks() {

    try {

        const savedTasks = localStorage.getItem("todoTasks");

        if (!savedTasks) {
            tasks = [];
            return;
        }

        const parsedTasks = JSON.parse(savedTasks);

        if (!Array.isArray(parsedTasks)) {
            throw new Error("Invalid saved data");
        }

        tasks = parsedTasks
            .filter(item =>
                item &&
                typeof item.task === "string"
            )
            .map(item => ({

                id: item.id || createId(),

                task: item.task,

                note: typeof item.note === "string"
                    ? item.note
                    : "",

                completed: item.completed === true

            }));

    } catch (error) {

        console.error("Loading error:", error);

        tasks = [];

        showMessage(
            "Saved data could not be loaded.",
            true
        );
    }
}


// ========================================
// 5. Utility Functions
// ========================================

function createId() {

    if (window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
    }

    return Date.now().toString(36) +
        Math.random().toString(36).slice(2);
}


function showMessage(text, isError = false) {

    clearTimeout(messageTimer);

    message.textContent = text;

    message.className = isError ? "error-message" : "success-message";

    messageTimer = setTimeout(() => {

        message.textContent = "";
        message.className = "";

    }, 3000);
}


function getText(key) {

    return translations[currentLanguage][key];
}


// ========================================
// 6. Language System
// ========================================

function changeLanguage(language) {

    currentLanguage = language === "ar" ? "ar" : "en";

    document.documentElement.lang = currentLanguage;

    document.documentElement.dir =
        currentLanguage === "ar" ? "rtl" : "ltr";

    document.title = getText("title");

    document.querySelectorAll("[data-i18n]").forEach(element => {

        const key = element.dataset.i18n;

        element.textContent = getText(key);

    });

    taskInput.placeholder = getText("taskPlaceholder");

    searchInput.placeholder = getText("searchPlaceholder");

    languageSelect.value = currentLanguage;

    try {
        localStorage.setItem("todoLanguage", currentLanguage);
    } catch (error) {
        console.error("Language preference could not be saved.");
    }

    renderTasks();
}


// ========================================
// 7. Statistics
// ========================================

function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const remaining = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    taskCount.textContent = total;

    stats.textContent =
        `${getText("total")}: ${total} | ` +
        `${getText("done")}: ${completed} | ` +
        `${getText("remaining")}: ${remaining}`;

    progressPercentage.textContent = percentage + "%";

    progressFill.style.width = percentage + "%";

    progressBar.setAttribute("aria-valuenow", percentage);

}


// ========================================
// 8. Task Rendering
// ========================================

function renderTasks() {

    taskList.innerHTML = "";

    const searchTerm = searchInput.value
        .trim()
        .toLowerCase();

    const filteredTasks = tasks.filter(task => {

        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "completed" && task.completed) ||
            (currentFilter === "incomplete" && !task.completed);

        const matchesSearch =
            task.task.toLowerCase().includes(searchTerm) ||
            task.note.toLowerCase().includes(searchTerm);

        return matchesFilter && matchesSearch;

    });

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.dataset.id = task.id;

        if (task.completed) {
            li.classList.add("completed");
        }

        const taskTitle = document.createElement("span");

        taskTitle.className = "task-title";
        taskTitle.textContent = task.task;

        const noteInput = document.createElement("input");

        noteInput.type = "text";
        noteInput.className = "note-input";
        noteInput.placeholder = getText("notePlaceholder");
        noteInput.value = task.note;
        noteInput.maxLength = 500;

        noteInput.setAttribute(
            "aria-label",
            getText("notePlaceholder")
        );

        const actions = document.createElement("div");

        actions.className = "task-actions";

        const completeBtn = document.createElement("button");

        completeBtn.type = "button";
        completeBtn.className = "completeBtn";
        completeBtn.dataset.action = "toggle";
        completeBtn.textContent = task.completed ? "↩" : "✓";

        completeBtn.title = task.completed
            ? getText("markActive")
            : getText("markDone");

        const editBtn = document.createElement("button");

        editBtn.type = "button";
        editBtn.className = "editBtn";
        editBtn.dataset.action = "edit";
        editBtn.textContent = getText("edit");

        const deleteBtn = document.createElement("button");

        deleteBtn.type = "button";
        deleteBtn.className = "deleteBtn";
        deleteBtn.dataset.action = "delete";
        deleteBtn.textContent = getText("delete");

        actions.append(
            completeBtn,
            editBtn,
            deleteBtn
        );

        li.append(
            taskTitle,
            noteInput,
            actions
        );

        taskList.appendChild(li);

    });

    emptyState.textContent = searchTerm
        ? getText("noResults")
        : getText("empty");

    emptyState.hidden = filteredTasks.length > 0;

    updateStats();

}


// ========================================
// 9. Add Task
// ========================================

function addTask() {

    const taskText = taskInput.value.trim();

    if (!taskText) {

        showMessage(getText("invalid"), true);

        taskInput.focus();

        return;
    }

    const duplicate = tasks.some(task =>
        task.task.toLowerCase() === taskText.toLowerCase()
    );

    if (duplicate) {

        showMessage(getText("duplicate"), true);

        taskInput.focus();

        return;
    }

    tasks.push({

        id: createId(),

        task: taskText,

        note: "",

        completed: false

    });

    saveTasks();

    taskInput.value = "";

    currentFilter = "all";

    searchInput.value = "";

    updateFilterButtons();

    renderTasks();

    showMessage(getText("added"));

    taskInput.focus();

}


addBtn.addEventListener("click", addTask);


taskInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        addTask();
    }

});


// ========================================
// 10. Task Actions
// ========================================

taskList.addEventListener("click", event => {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const li = button.closest("li");

    if (!li) return;

    const task = tasks.find(
        item => item.id === li.dataset.id
    );

    if (!task) return;

    const action = button.dataset.action;


    if (action === "toggle") {

        task.completed = !task.completed;

        saveTasks();

        renderTasks();

        showMessage(
            task.completed
                ? getText("markedDone")
                : getText("markedActive")
        );

    }


    if (action === "edit") {

        const newText = prompt(
            getText("edit"),
            task.task
        );

        if (newText === null) return;

        const cleanText = newText.trim();

        if (!cleanText) {

            showMessage(getText("invalid"), true);

            return;
        }

        const duplicate = tasks.some(item =>
            item.id !== task.id &&
            item.task.toLowerCase() === cleanText.toLowerCase()
        );

        if (duplicate) {

            showMessage(getText("duplicate"), true);

            return;
        }

        task.task = cleanText;

        saveTasks();

        renderTasks();

        showMessage(getText("updated"));

    }


    if (action === "delete") {

        if (!confirm(getText("confirmDelete"))) {
            return;
        }

        tasks = tasks.filter(
            item => item.id !== task.id
        );

        saveTasks();

        renderTasks();

        showMessage(getText("deleted"));

    }

});


// ========================================
// 11. Notes
// ========================================

taskList.addEventListener("input", event => {

    if (!event.target.classList.contains("note-input")) {
        return;
    }

    const li = event.target.closest("li");

    const task = tasks.find(
        item => item.id === li.dataset.id
    );

    if (!task) return;

    task.note = event.target.value;

    saveTasks();

});


// ========================================
// 12. Search
// ========================================

searchInput.addEventListener("input", renderTasks);


// ========================================
// 13. Filters
// ========================================

function updateFilterButtons() {

    document.querySelectorAll("[data-filter]").forEach(button => {

        const isActive =
            button.dataset.filter === currentFilter;

        button.classList.toggle("active", isActive);

        button.setAttribute(
            "aria-pressed",
            String(isActive)
        );

    });

}


document.querySelectorAll("[data-filter]").forEach(button => {

    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter;

        updateFilterButtons();

        renderTasks();

    });

});


// ========================================
// 14. Delete Completed Tasks
// ========================================

deleteCompletedBtn.addEventListener("click", () => {

    const completedCount = tasks.filter(
        task => task.completed
    ).length;

    if (completedCount === 0) {

        showMessage(getText("noCompleted"), true);

        return;
    }

    if (!confirm(getText("confirmCompleted"))) {
        return;
    }

    tasks = tasks.filter(
        task => !task.completed
    );

    saveTasks();

    renderTasks();

    showMessage(getText("completedDeleted"));

});


// ========================================
// 15. Clear All
// ========================================

clearBtn.addEventListener("click", () => {

    if (tasks.length === 0) return;

    if (!confirm(getText("confirmClear"))) {
        return;
    }

    tasks = [];

    saveTasks();

    renderTasks();

    showMessage(getText("cleared"));

});


// ========================================
// 16. Export Tasks
// ========================================

exportBtn.addEventListener("click", () => {

    const data = JSON.stringify(tasks, null, 2);

    const blob = new Blob(
        [data],
        { type: "application/json;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
        getText("exportName") + "_" +
        Date.now() + ".json";

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

    showMessage(getText("exported"));

});


// ========================================
// 17. Language Selection
// ========================================

languageSelect.addEventListener("change", event => {

    changeLanguage(event.target.value);

});


// ========================================
// 18. Initialize App
// ========================================

function initializeApp() {

    loadTasks();

    let savedLanguage = "en";

    try {

        savedLanguage =
            localStorage.getItem("todoLanguage") || "en";

    } catch (error) {

        console.error("Language loading error.");

    }

    currentLanguage =
        savedLanguage === "ar" ? "ar" : "en";

    changeLanguage(currentLanguage);

    updateFilterButtons();

    renderTasks();

}


// Start application

initializeApp();
