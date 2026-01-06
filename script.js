// ---------------- State ----------------

// Main array to store student records
let students = [];

// Track which student is being edited (index in array), null = add mode
let editIndex = null;

// ---------------- DOM Elements ----------------

// Form inputs
const studentForm = document.getElementById("student-form");
const rollInput = document.getElementById("roll");
const nameInput = document.getElementById("name");
const deptInput = document.getElementById("department");
const semInput = document.getElementById("semester");
const cgpaInput = document.getElementById("cgpa");

// Buttons
const saveBtn = document.getElementById("save-btn");
const resetBtn = document.getElementById("reset-btn");
const clearStorageBtn = document.getElementById("clear-storage-btn");

// Search / Filter inputs
const searchRollInput = document.getElementById("search-roll");
const searchNameInput = document.getElementById("search-name");
const filterDeptSelect = document.getElementById("filter-dept");
const filterSemSelect = document.getElementById("filter-sem");

// Sort buttons
const sortRollBtn = document.getElementById("sort-roll-btn");
const sortCgpaBtn = document.getElementById("sort-cgpa-btn");

// Table body
const tableBody = document.querySelector("#students-table tbody");

// ---------------- Local Storage Helpers ----------------

// Load data from localStorage into students array
function loadFromStorage() {
  const data = localStorage.getItem("students");
  if (data) {
    students = JSON.parse(data);
  } else {
    students = [];
  }
}

// Save current students array to localStorage
function saveToStorage() {
  localStorage.setItem("students", JSON.stringify(students));
}

// ---------------- Rendering ----------------

// Render table based on students + current search/filter values
function renderTable() {
  // Clear old rows
  tableBody.innerHTML = "";

  // Get filter values
  const searchRoll = searchRollInput.value.trim();
  const searchName = searchNameInput.value.trim().toLowerCase();
  const filterDept = filterDeptSelect.value;
  const filterSem = filterSemSelect.value;

  // Loop through students and add rows that match filters
  students.forEach((student, index) => {
    // Apply search / filter logic
    if (searchRoll !== "" && String(student.roll) !== searchRoll) {
      return;
    }

    if (searchName !== "" && !student.name.toLowerCase().includes(searchName)) {
      return;
    }

    if (filterDept !== "" && student.department !== filterDept) {
      return;
    }

    if (filterSem !== "" && String(student.semester) !== filterSem) {
      return;
    }

    // Create table row
    const tr = document.createElement("tr");

    // Simple cells
    const rollTd = document.createElement("td");
    rollTd.textContent = student.roll;

    const nameTd = document.createElement("td");
    nameTd.textContent = student.name;

    const deptTd = document.createElement("td");
    deptTd.textContent = student.department;

    const semTd = document.createElement("td");
    semTd.textContent = student.semester;

    const cgpaTd = document.createElement("td");
    cgpaTd.textContent = student.cgpa;

    // Actions cell
    const actionsTd = document.createElement("td");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "action-btn edit-btn";
    editBtn.addEventListener("click", function () {
      startEditStudent(index);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "action-btn delete-btn";
    deleteBtn.addEventListener("click", function () {
      deleteStudent(index);
    });

    actionsTd.appendChild(editBtn);
    actionsTd.appendChild(deleteBtn);

    // Add cells to row
    tr.appendChild(rollTd);
    tr.appendChild(nameTd);
    tr.appendChild(deptTd);
    tr.appendChild(semTd);
    tr.appendChild(cgpaTd);
    tr.appendChild(actionsTd);

    // Add row to table body
    tableBody.appendChild(tr);
  });
}

// ---------------- CRUD Functions ----------------

// Add new student object to array
function addStudent(student) {
  // Check unique roll number
  const exists = students.some((s) => String(s.roll) === String(student.roll));
  if (exists) {
    alert("Roll number already exists.");
    return false;
  }

  students.push(student);
  saveToStorage();
  renderTable();
  return true;
}

// Update existing student at editIndex
function updateStudent(student) {
  if (editIndex === null) return;

  // If roll is changed, make sure it is still unique
  const exists = students.some((s, idx) => {
    return idx !== editIndex && String(s.roll) === String(student.roll);
  });
  if (exists) {
    alert("Roll number already exists.");
    return false;
  }

  students[editIndex] = student;
  saveToStorage();
  renderTable();
  return true;
}

// Delete student at index
function deleteStudent(index) {
  const confirmDelete = confirm("Are you sure you want to delete this record?");
  if (!confirmDelete) return;

  students.splice(index, 1);
  saveToStorage();
  renderTable();
}

// Start editing: fill form with selected student data
function startEditStudent(index) {
  const student = students[index];
  editIndex = index;

  rollInput.value = student.roll;
  nameInput.value = student.name;
  deptInput.value = student.department;
  semInput.value = student.semester;
  cgpaInput.value = student.cgpa;

  saveBtn.textContent = "Update Student";
}

// Reset form back to "add" mode
function resetFormState() {
  editIndex = null;
  studentForm.reset();
  saveBtn.textContent = "Save Student";
}

// ---------------- Sort Functions ----------------

// Sort by roll number (ascending)
function sortByRoll() {
  students.sort(function (a, b) {
    return Number(a.roll) - Number(b.roll);
  });
  saveToStorage();
  renderTable();
}

// Sort by CGPA (descending)
function sortByCgpa() {
  students.sort(function (a, b) {
    return Number(b.cgpa) - Number(a.cgpa);
  });
  saveToStorage();
  renderTable();
}

// ---------------- Event Listeners ----------------

// Handle form submit (add / update)
studentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const roll = rollInput.value.trim();
  const name = nameInput.value.trim();
  const department = deptInput.value;
  const semester = semInput.value;
  const cgpa = cgpaInput.value.trim();

  if (roll === "" || name === "") {
    alert("Roll number and name are required.");
    return;
  }

  const student = {
    roll: roll,
    name: name,
    department: department,
    semester: semester,
    cgpa: cgpa === "" ? "" : Number(cgpa)
  };

  let success;
  if (editIndex === null) {
    success = addStudent(student);
  } else {
    success = updateStudent(student);
  }

  if (success) {
    resetFormState();
  }
});

// Handle form reset button
resetBtn.addEventListener("click", function () {
  resetFormState();
});

// Search / filter events: re-render when user types or changes select
searchRollInput.addEventListener("input", renderTable);
searchNameInput.addEventListener("input", renderTable);
filterDeptSelect.addEventListener("change", renderTable);
filterSemSelect.addEventListener("change", renderTable);

// Sort buttons
sortRollBtn.addEventListener("click", sortByRoll);
sortCgpaBtn.addEventListener("click", sortByCgpa);

// Clear all records and localStorage
clearStorageBtn.addEventListener("click", function () {
  const yes = confirm("Clear all records and localStorage?");
  if (!yes) return;

  students = [];
  saveToStorage();
  renderTable();
  resetFormState();
});

// ---------------- Initial Load ----------------

// 1. Load data from localStorage
loadFromStorage();

// 2. Render table first time
renderTable();
