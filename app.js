
// Firebase Config (replace with your own)
const firebaseConfig = {
  apiKey: "AIzaSyB8b33edlM77dGeukt56dj3ArOTqRrajOM",
    authDomain: "school-3df26.firebaseapp.com",
    projectId: "school-3df26",
    storageBucket: "school-3df26.firebasestorage.app",
    messagingSenderId: "385586725492",
    appId: "1:385586725492:web:c912e739d4e8b9b670c721"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const loginForm = document.getElementById('loginForm');
const loginPage = document.getElementById('loginPage');
const dashboardContainer = document.getElementById('dashboardContainer');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const themeToggle = document.getElementById('themeToggle');
const pageTitle = document.getElementById('pageTitle');

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  try {
    await auth.signInWithEmailAndPassword(email, password);
    showDashboard();
  } catch (error) {
    alert("Login Failed: " + error.message);
  }
});

function showDashboard() {
  loginPage.classList.add('hidden');
  dashboardContainer.classList.remove('hidden');
  loadPage('dashboard');
}

function logout() {
  auth.signOut().then(() => {
    loginPage.classList.remove('hidden');
    dashboardContainer.classList.add('hidden');
  });
}

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  mainContent.classList.toggle('sidebar-open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function () {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    const page = this.getAttribute('data-page');
    loadPage(page);
  });
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function loadPage(pageId) {
  document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
  const targetPage = document.getElementById(`${pageId}Page`);
  if (targetPage) {
    targetPage.classList.remove('hidden');
    pageTitle.textContent = capitalize(pageId.replace('-', ' '));
  }
  if (pageId === 'students') loadStudents();
  if (pageId === 'teachers') loadTeachers();
}

// ----------------- Student CRUD ------------------
document.getElementById('studentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('studentId').value;
  const student = {
    firstName: document.getElementById('studentFirstName').value,
    lastName: document.getElementById('studentLastName').value,
    grade: document.getElementById('studentGrade').value,
    class: document.getElementById('studentClass').value,
    email: document.getElementById('studentEmail').value,
    phone: document.getElementById('studentPhone').value,
  };

  try {
    if (id) {
      await db.collection('students').doc(id).update(student);
    } else {
      await db.collection('students').add(student);
    }
    loadStudents();
    bootstrap.Modal.getInstance(document.getElementById('studentModal')).hide();
  } catch (err) {
    alert('Failed to save student: ' + err.message);
  }
});

async function loadStudents() {
  const tbody = document.getElementById('studentsTableBody');
  tbody.innerHTML = '<tr><td colspan="6" class="text-center">Loading...</td></tr>';

  try {
    const snapshot = await db.collection('students').get();
    tbody.innerHTML = '';
    snapshot.forEach(doc => {
      const student = doc.data();
      const row = `
        <tr>
          <td>${doc.id}</td>
          <td>${student.firstName} ${student.lastName}</td>
          <td>${student.grade}</td>
          <td>${student.class}</td>
          <td>${student.email}</td>
          <td>
            <button class="btn btn-edit btn-action" onclick="editStudent('${doc.id}')"><i class="fas fa-edit"></i></button>
            <button class="btn btn-delete btn-action" onclick="deleteStudent('${doc.id}')"><i class="fas fa-trash"></i></button>
          </td>
        </tr>`;
      tbody.innerHTML += row;
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-danger text-center">${err.message}</td></tr>`;
  }
}

async function editStudent(id) {
  const doc = await db.collection('students').doc(id).get();
  if (!doc.exists) return;

  const s = doc.data();
  document.getElementById('studentId').value = id;
  document.getElementById('studentFirstName').value = s.firstName;
  document.getElementById('studentLastName').value = s.lastName;
  document.getElementById('studentGrade').value = s.grade;
  document.getElementById('studentClass').value = s.class;
  document.getElementById('studentEmail').value = s.email;
  document.getElementById('studentPhone').value = s.phone;

  new bootstrap.Modal(document.getElementById('studentModal')).show();
}

async function deleteStudent(id) {
  if (confirm("Are you sure you want to delete this student?")) {
    await db.collection('students').doc(id).delete();
    loadStudents();
  }
}

// ----------------- Teacher CRUD ------------------
document.getElementById('teacherForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('teacherId').value;
  const teacher = {
    name: document.getElementById('teacherName').value,
    subject: document.getElementById('teacherSubject').value,
    email: document.getElementById('teacherEmail').value,
    phone: document.getElementById('teacherPhone').value,
  };

  try {
    if (id) {
      await db.collection('teachers').doc(id).update(teacher);
    } else {
      await db.collection('teachers').add(teacher);
    }
    loadTeachers();
    bootstrap.Modal.getInstance(document.getElementById('teacherModal')).hide();
  } catch (err) {
    alert('Failed to save teacher: ' + err.message);
  }
});

async function loadTeachers() {
  const tbody = document.getElementById('teachersTableBody');
  tbody.innerHTML = '<tr><td colspan="6" class="text-center">Loading...</td></tr>';

  try {
    const snapshot = await db.collection('teachers').get();
    tbody.innerHTML = '';
    snapshot.forEach(doc => {
      const teacher = doc.data();
      const row = `
        <tr>
          <td>${doc.id}</td>
          <td>${teacher.name}</td>
          <td>${teacher.subject}</td>
          <td>${teacher.email}</td>
          <td>${teacher.phone}</td>
          <td>
            <button class="btn btn-edit btn-action" onclick="editTeacher('${doc.id}')"><i class="fas fa-edit"></i></button>
            <button class="btn btn-delete btn-action" onclick="deleteTeacher('${doc.id}')"><i class="fas fa-trash"></i></button>
          </td>
        </tr>`;
      tbody.innerHTML += row;
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-danger text-center">${err.message}</td></tr>`;
  }
}

async function editTeacher(id) {
  const doc = await db.collection('teachers').doc(id).get();
  if (!doc.exists) return;

  const t = doc.data();
  document.getElementById('teacherId').value = id;
  document.getElementById('teacherName').value = t.name;
  document.getElementById('teacherSubject').value = t.subject;
  document.getElementById('teacherEmail').value = t.email;
  document.getElementById('teacherPhone').value = t.phone;

  new bootstrap.Modal(document.getElementById('teacherModal')).show();
}

async function deleteTeacher(id) {
  if (confirm("Are you sure you want to delete this teacher?")) {
    await db.collection('teachers').doc(id).delete();
    loadTeachers();
  }
}

// Check auth state on load
auth.onAuthStateChanged(user => {
  if (user) {
    showDashboard();
  } else {
    loginPage.classList.remove('hidden');
    dashboardContainer.classList.add('hidden');
  }
});
