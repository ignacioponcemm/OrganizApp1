/**
 * OrganizApp - Application Logic with User Auth & Moderation
 * School Organization App for High School Students
 */

// LOCAL STORAGE KEYS
const USERS_KEY = 'organizapp_users_v2';
const SESSION_KEY = 'organizapp_session_v2';
const DATA_PREFIX = 'organizapp_data_';

// ==========================================================================
// OFFENSIVE CONTENT & PROFANITY MODERATION SYSTEM
// ==========================================================================
// List of offensive, inappropriate, abusive, explicit or hostile terms (ES/EN + leetspeak)
const FORBIDDEN_WORDS = [
  // Spanish insults & profanities
  'puta', 'puto', 'mierda', 'concha', 'pija', 'pene', 'vagina', 'chota', 'orto',
  'tetas', 'boludo', 'boluda', 'pelotudo', 'pelotuda', 'tarado', 'tarada', 'imbecil',
  'estupido', 'estupida', 'idiota', 'maricon', 'puto', 'hijo de puta', 'malparido',
  'perra', 'bastardo', 'verga', 'cagon', 'cagón', 'mamon', 'cabron', 'cabrón',
  'zorra', 'forro', 'forra', 'culiao', 'culiado', 'troll', 'nazi', 'hitler', 'facista',
  'muerte', 'asesino', 'droga', 'drogas', 'cocaina', 'heroina', 'porno', 'xxx', 'hentai',
  'sexo', 'prostituta', 'violador', 'violacion',

  // English insults & profanities
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'dick', 'cock', 'pussy',
  'whore', 'slut', 'nigger', 'nigga', 'faggot', 'retard', 'porn', 'sex', 'nude'
];

/**
 * Normalizes text to detect hidden or obfuscated offensive words.
 * Handles leetspeak replacement (e.g. p0rn -> porn, p*ta -> puta, b!tch -> bitch).
 */
function normalizeText(text) {
  if (!text) return '';
  let str = text.toLowerCase().trim();

  // Remove accents
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Leetspeak mapping
  const leetMap = {
    '@': 'a', '4': 'a',
    '3': 'e',
    '1': 'i', '!': 'i', '|': 'i',
    '0': 'o',
    '$': 's', '5': 's',
    '7': 't', '+': 't',
    '*': '', '_': '', '-': '', '.': ''
  };

  let normalized = '';
  for (let char of str) {
    normalized += leetMap[char] !== undefined ? leetMap[char] : char;
  }

  return normalized;
}

/**
 * Checks if a given text contains offensive or inappropriate words for school.
 * Returns { isOffensive: true/false, detectedWord: string, reason: string }
 */
function checkOffensiveContent(text) {
  if (!text || text.trim().length === 0) {
    return { isOffensive: false };
  }

  const raw = text.toLowerCase();
  const normalized = normalizeText(text);

  // Clean string without special symbols
  const wordsRaw = raw.split(/[\s,._\-]+/);
  const wordsNorm = normalized.split(/[\s,._\-]+/);

  for (let forbidden of FORBIDDEN_WORDS) {
    const forbiddenNorm = normalizeText(forbidden);

    // Exact word or substring match in normalized text
    if (normalized.includes(forbiddenNorm)) {
      return {
        isOffensive: true,
        detectedWord: forbidden,
        reason: 'El texto contiene palabras o expresiones no permitidas en un ambiente escolar.'
      };
    }

    for (let w of wordsNorm) {
      if (w === forbiddenNorm) {
        return {
          isOffensive: true,
          detectedWord: forbidden,
          reason: 'El nombre contiene lenguaje inapropiado.'
        };
      }
    }
  }

  return { isOffensive: false };
}


// ==========================================================================
// DEFAULT DEMO DATA FOR NEW USERS
// ==========================================================================
function getDefaultDemoData() {
  return {
    subjects: [
      { id: 'subj-1', title: 'Matemática', teacher: 'Prof. Albarracín', room: 'Aula 12', color: '#6366f1', emoji: '📐' },
      { id: 'subj-2', title: 'Historia', teacher: 'Prof. Gómez', room: 'Aula 4', color: '#ec4899', emoji: '📚' },
      { id: 'subj-3', title: 'Biología', teacher: 'Prof. Rossi', room: 'Lab 2', color: '#10b981', emoji: '🔬' },
      { id: 'subj-4', title: 'Lengua y Literatura', teacher: 'Prof. Carrizo', room: 'Aula 8', color: '#f59e0b', emoji: '🎨' },
      { id: 'subj-5', title: 'Inglés', teacher: 'Prof. Smith', room: 'Aula 3', color: '#06b6d4', emoji: '🇬🇧' }
    ],
    tasks: [
      {
        id: 'task-1',
        subjectId: 'subj-1',
        title: 'Resolver ejercicios 58 y 59',
        description: 'Página 112 del libro guía. Aplicar fórmula cuadrática.',
        dueDate: getRelativeDate(2),
        priority: 'alta',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'task-2',
        subjectId: 'subj-4',
        title: 'Análisis sintáctico de cuento de Cortázar',
        description: 'Identificar sujeto, predicado y complementos directos.',
        dueDate: getRelativeDate(3),
        priority: 'alta',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'task-3',
        subjectId: 'subj-2',
        title: 'Resumen de la Revolución Industrial',
        description: 'Mínimo 2 páginas en la carpeta. Resaltar causas socioeconómicas.',
        dueDate: getRelativeDate(5),
        priority: 'media',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'task-4',
        subjectId: 'subj-3',
        title: 'Dibujar célula vegetal y sus organelas',
        description: 'En hoja canson N° 5 a color con referencias.',
        dueDate: getRelativeDate(7),
        priority: 'baja',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'task-5',
        subjectId: 'subj-5',
        title: 'Vocabulary worksheet Unit 4',
        description: 'Completar ejercicios A, B y C del Workbook.',
        dueDate: getRelativeDate(-2),
        priority: 'media',
        completed: true,
        completedAt: getRelativeDate(-1)
      }
    ],
    exams: [
      {
        id: 'exam-1',
        subjectId: 'subj-1',
        title: 'Parcial de Funciones Cuadráticas',
        description: 'Entra vértices, raíces, eje de simetría y gráficos.',
        date: getRelativeDate(4)
      },
      {
        id: 'exam-2',
        subjectId: 'subj-2',
        title: 'Evaluación de Siglo XIX',
        description: 'Capítulos 4 y 5. Llevar mapa político mudo de Europa.',
        date: getRelativeDate(8)
      }
    ]
  };
}

function getRelativeDate(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}


// ==========================================================================
// APP STATE & USER SYSTEM
// ==========================================================================
let currentUser = null;
let users = [];

let state = {
  subjects: [],
  tasks: [],
  exams: [],
  activeTab: 'inicio',
  selectedEmoji: '📐',
  selectedColor: '#6366f1',
  regAvatar: '🎒',
  editAvatar: '🎒'
};

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  initUserAccounts();
  setupEventListeners();
  checkSessionState();
});

// AUTHENTICATION MANAGEMENT
function initUserAccounts() {
  const savedUsers = localStorage.getItem(USERS_KEY);
  if (savedUsers) {
    try {
      users = JSON.parse(savedUsers);
    } catch (e) {
      users = [];
    }
  }

  // If no default demo user exists, create one
  if (users.length === 0) {
    const defaultUser = {
      id: 'usr_demo_1',
      username: 'estudiante',
      name: 'Alex Martínez',
      password: '123',
      grade: '4° Año Secundaria',
      avatar: '🎒'
    };
    users.push(defaultUser);
    saveUsers();

    // Save initial data for demo user
    localStorage.setItem(DATA_PREFIX + defaultUser.id, JSON.stringify(getDefaultDemoData()));
  }
}

function saveUsers() {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function checkSessionState() {
  const sessionUserId = localStorage.getItem(SESSION_KEY);
  if (sessionUserId) {
    const foundUser = users.find(u => u.id === sessionUserId);
    if (foundUser) {
      loginUser(foundUser, false);
      return;
    }
  }

  // Show Auth Screen if not logged in
  showAuthScreen();
}

function showAuthScreen() {
  document.getElementById('auth-screen').classList.remove('hidden');
}

function hideAuthScreen() {
  document.getElementById('auth-screen').classList.add('hidden');
}

function loginUser(user, showNotice = true) {
  currentUser = user;
  localStorage.setItem(SESSION_KEY, user.id);

  // Load user specific data
  loadUserData(user.id);

  // Update User UI Elements
  document.getElementById('sidebar-user-name').textContent = user.name;
  document.getElementById('sidebar-user-grade').textContent = user.grade;
  document.getElementById('sidebar-user-avatar').textContent = user.avatar || '🎒';
  document.getElementById('hero-greeting').textContent = `¡Hola, ${user.name.split(' ')[0]}! 📚`;

  hideAuthScreen();
  renderApp();

  if (showNotice) {
    showToast(`✨ ¡Bienvenido de nuevo, ${user.name}!`);
  }
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem(SESSION_KEY);
  showAuthScreen();
  showToast('👋 Sesión cerrada correctamente');
}

function loadUserData(userId) {
  const rawData = localStorage.getItem(DATA_PREFIX + userId);
  if (rawData) {
    try {
      const parsed = JSON.parse(rawData);
      state.subjects = parsed.subjects || [];
      state.tasks = parsed.tasks || [];
      state.exams = parsed.exams || [];
    } catch (e) {
      const demo = getDefaultDemoData();
      state.subjects = demo.subjects;
      state.tasks = demo.tasks;
      state.exams = demo.exams;
    }
  } else {
    const demo = getDefaultDemoData();
    state.subjects = demo.subjects;
    state.tasks = demo.tasks;
    state.exams = demo.exams;
    saveUserData();
  }
}

function saveUserData() {
  if (!currentUser) return;
  const dataToSave = {
    subjects: state.subjects,
    tasks: state.tasks,
    exams: state.exams
  };
  localStorage.setItem(DATA_PREFIX + currentUser.id, JSON.stringify(dataToSave));
}


// ==========================================================================
// EVENT LISTENERS & HANDLERS
// ==========================================================================
function setupEventListeners() {
  // Navigation Tabs
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      if (targetTab) {
        switchTab(targetTab);
      }
    });
  });

  // Mobile drawer toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      document.querySelector('.sidebar').classList.toggle('mobile-open');
    });
  }

  // Quick Add Buttons
  document.getElementById('btn-open-add-modal').addEventListener('click', () => openAddModal('task'));
  document.getElementById('btn-quick-add-sidebar').addEventListener('click', () => openAddModal('task'));
  document.getElementById('btn-hero-add-task').addEventListener('click', () => openAddModal('task'));
  document.getElementById('btn-hero-add-exam').addEventListener('click', () => openAddModal('exam'));
  document.getElementById('btn-add-subject-dash').addEventListener('click', () => openAddModal('subject'));
  document.getElementById('btn-create-subject').addEventListener('click', () => openAddModal('subject'));
  document.getElementById('btn-create-task-page').addEventListener('click', () => openAddModal('task'));
  document.getElementById('btn-create-exam-page').addEventListener('click', () => openAddModal('exam'));

  // Dashboard Navigation
  document.getElementById('btn-see-all-tasks').addEventListener('click', () => switchTab('tareas'));
  document.getElementById('btn-see-all-exams').addEventListener('click', () => switchTab('evaluaciones'));
  document.getElementById('btn-see-all-completed').addEventListener('click', () => switchTab('terminadas'));

  // Reset Demo Data
  document.getElementById('btn-reset-demo').addEventListener('click', resetToDemoData);

  // Install / Download App buttons & modal
  const installHeaderBtn = document.getElementById('btn-install-app-header');
  const installNavBtn = document.getElementById('btn-install-app-nav');
  if (installHeaderBtn) installHeaderBtn.addEventListener('click', openInstallModal);
  if (installNavBtn) installNavBtn.addEventListener('click', openInstallModal);

  const closeInstallBtn = document.getElementById('btn-close-install-modal');
  if (closeInstallBtn) closeInstallBtn.addEventListener('click', closeInstallModal);

  const triggerInstallBtn = document.getElementById('btn-trigger-pwa-install');
  if (triggerInstallBtn) triggerInstallBtn.addEventListener('click', handlePwaInstall);

  const downloadPackBtn = document.getElementById('btn-download-offline-pack');
  if (downloadPackBtn) downloadPackBtn.addEventListener('click', downloadOfflinePackage);

  // Auth Tabs (Login vs Register)
  document.getElementById('auth-tab-login').addEventListener('click', () => switchAuthTab('login'));
  document.getElementById('auth-tab-register').addEventListener('click', () => switchAuthTab('register'));

  // Quick Demo Login
  document.getElementById('btn-quick-demo-login').addEventListener('click', () => {
    const demoUser = users.find(u => u.username === 'estudiante');
    if (demoUser) {
      loginUser(demoUser);
    }
  });

  // Login Form Submit
  document.getElementById('form-login').addEventListener('submit', handleLoginSubmit);

  // Register Form Submit with Realtime Moderation Validation
  document.getElementById('form-register').addEventListener('submit', handleRegisterSubmit);
  document.getElementById('reg-name').addEventListener('input', handleRegisterNameInput);

  // Logout & Profile Edit
  document.getElementById('btn-logout').addEventListener('click', logoutUser);
  document.getElementById('btn-edit-profile-sidebar').addEventListener('click', openEditProfileModal);
  document.getElementById('user-profile-trigger').addEventListener('click', openEditProfileModal);
  document.getElementById('btn-close-profile-modal').addEventListener('click', closeEditProfileModal);
  document.querySelectorAll('.modal-cancel-profile').forEach(btn => btn.addEventListener('click', closeEditProfileModal));
  document.getElementById('form-edit-profile').addEventListener('submit', handleEditProfileSubmit);
  document.getElementById('edit-profile-name').addEventListener('input', handleEditProfileNameInput);

  // Modal Close & Backdrop
  document.getElementById('btn-close-modal').addEventListener('click', closeAddModal);
  document.querySelectorAll('.modal-cancel').forEach(btn => btn.addEventListener('click', closeAddModal));
  document.getElementById('modal-add').addEventListener('click', (e) => {
    if (e.target.id === 'modal-add') closeAddModal();
  });

  // Modal Tabs (Task / Exam / Subject)
  document.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      switchModalTab(tab.getAttribute('data-type'));
    });
  });

  // Form Submissions (Task, Exam, Subject) with Content Moderation on Subject Title
  document.getElementById('form-add-task').addEventListener('submit', handleAddTask);
  document.getElementById('form-add-exam').addEventListener('submit', handleAddExam);
  document.getElementById('form-add-subject').addEventListener('submit', handleAddSubject);

  // Filters & Search
  document.getElementById('filter-task-subject').addEventListener('change', renderTasksView);
  document.getElementById('filter-task-priority').addEventListener('change', renderTasksView);
  document.getElementById('filter-task-status').addEventListener('change', renderTasksView);
  document.getElementById('filter-exam-subject').addEventListener('change', renderExamsView);
  document.getElementById('global-search').addEventListener('input', handleGlobalSearch);

  // Registration & Edit Avatar Selectors
  setupAvatarSelector('reg-avatar-selector', (avatar) => state.regAvatar = avatar);
  setupAvatarSelector('edit-avatar-selector', (avatar) => state.editAvatar = avatar);

  // Subject Emoji & Color Selectors
  setupEmojiSelector();
  setupColorSelector();
}

function setupAvatarSelector(containerId, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const opts = container.querySelectorAll('.avatar-opt');
  opts.forEach(opt => {
    opt.addEventListener('click', () => {
      opts.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const avatarVal = opt.getAttribute('data-avatar');
      if (onSelect) onSelect(avatarVal);
    });
  });
}

function setupEmojiSelector() {
  const opts = document.querySelectorAll('#subject-emoji-selector .emoji-option');
  opts.forEach(opt => {
    opt.addEventListener('click', () => {
      opts.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      state.selectedEmoji = opt.getAttribute('data-emoji');
    });
  });
}

function setupColorSelector() {
  const opts = document.querySelectorAll('#subject-color-selector .color-option');
  opts.forEach(opt => {
    opt.addEventListener('click', () => {
      opts.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      state.selectedColor = opt.getAttribute('data-color');
    });
  });
}

// AUTH MODAL & FORM SWITCHING
function switchAuthTab(tabType) {
  document.getElementById('auth-tab-login').classList.toggle('active', tabType === 'login');
  document.getElementById('auth-tab-register').classList.toggle('active', tabType === 'register');

  document.getElementById('form-login').classList.toggle('active', tabType === 'login');
  document.getElementById('form-register').classList.toggle('active', tabType === 'register');

  // Clear warning banner
  document.getElementById('auth-moderation-warning').classList.add('hidden');
}

// REALTIME MODERATION CHECKERS
function handleRegisterNameInput(e) {
  const val = e.target.value;
  const warning = document.getElementById('auth-moderation-warning');
  const warningText = document.getElementById('auth-warning-text');

  const check = checkOffensiveContent(val);
  if (check.isOffensive) {
    warningText.textContent = `⚠️ El nombre contiene términos no apropiados para un entorno escolar ("${check.detectedWord}"). Por favor elige un apodo respetuoso.`;
    warning.classList.remove('hidden');
  } else {
    warning.classList.add('hidden');
  }
}

function handleEditProfileNameInput(e) {
  const val = e.target.value;
  const warning = document.getElementById('profile-moderation-warning');
  const warningText = document.getElementById('profile-warning-text');

  const check = checkOffensiveContent(val);
  if (check.isOffensive) {
    warningText.textContent = `⚠️ El nombre contiene la palabra no permitida "${check.detectedWord}". Por favor modifícalo.`;
    warning.classList.remove('hidden');
  } else {
    warning.classList.add('hidden');
  }
}

// AUTH HANDLERS
function handleLoginSubmit(e) {
  e.preventDefault();
  const usernameInput = document.getElementById('login-username').value.trim().toLowerCase();
  const passwordInput = document.getElementById('login-password').value;

  const found = users.find(u => (u.username.toLowerCase() === usernameInput || u.name.toLowerCase() === usernameInput) && u.password === passwordInput);

  if (found) {
    loginUser(found);
    e.target.reset();
  } else {
    alert('Usuario o contraseña incorrectos. Si no tienes cuenta, puedes hacer clic en "Crear Cuenta".');
  }
}

function handleRegisterSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const username = document.getElementById('reg-username').value.trim().toLowerCase();
  const year = document.getElementById('reg-year').value;
  const password = document.getElementById('reg-password').value;

  // Moderation Check
  const modCheck = checkOffensiveContent(name);
  if (modCheck.isOffensive) {
    const warning = document.getElementById('auth-moderation-warning');
    const warningText = document.getElementById('auth-warning-text');
    warningText.textContent = `⚠️ No es posible registrar el nombre por contener lenguaje inapropiado ("${modCheck.detectedWord}"). Por favor usa un nombre escolar adecuado.`;
    warning.classList.remove('hidden');
    return;
  }

  const usernameCheck = checkOffensiveContent(username);
  if (usernameCheck.isOffensive) {
    alert('El nombre de usuario contiene términos no permitidos.');
    return;
  }

  // Check if username already exists
  if (users.some(u => u.username === username)) {
    alert('El nombre de usuario ya está registrado. Elige otro apodo o inicia sesión.');
    return;
  }

  const newUser = {
    id: 'usr_' + Date.now(),
    username,
    name,
    password,
    grade: year,
    avatar: state.regAvatar || '🎒'
  };

  users.push(newUser);
  saveUsers();

  // Create initial demo subjects/tasks for the new user
  localStorage.setItem(DATA_PREFIX + newUser.id, JSON.stringify(getDefaultDemoData()));

  e.target.reset();
  loginUser(newUser);
  showToast('🎉 ¡Cuenta creada con éxito! Bienvenido a OrganizApp');
}

// PROFILE EDIT MODAL HANDLERS
function openEditProfileModal() {
  if (!currentUser) return;
  document.getElementById('edit-profile-name').value = currentUser.name;
  document.getElementById('edit-profile-grade').value = currentUser.grade;
  state.editAvatar = currentUser.avatar || '🎒';

  // Highlight active avatar
  const opts = document.querySelectorAll('#edit-avatar-selector .avatar-opt');
  opts.forEach(opt => {
    opt.classList.toggle('active', opt.getAttribute('data-avatar') === state.editAvatar);
  });

  document.getElementById('profile-moderation-warning').classList.add('hidden');
  document.getElementById('modal-edit-profile').classList.add('active');
}

function closeEditProfileModal() {
  document.getElementById('modal-edit-profile').classList.remove('active');
}

function handleEditProfileSubmit(e) {
  e.preventDefault();
  const newName = document.getElementById('edit-profile-name').value.trim();
  const newGrade = document.getElementById('edit-profile-grade').value;

  const modCheck = checkOffensiveContent(newName);
  if (modCheck.isOffensive) {
    const warning = document.getElementById('profile-moderation-warning');
    const warningText = document.getElementById('profile-warning-text');
    warningText.textContent = `⚠️ No se pueden guardar los cambios porque el nombre contiene lenguaje no permitido ("${modCheck.detectedWord}").`;
    warning.classList.remove('hidden');
    return;
  }

  currentUser.name = newName;
  currentUser.grade = newGrade;
  currentUser.avatar = state.editAvatar || '🎒';

  saveUsers();
  closeEditProfileModal();
  loginUser(currentUser, false);
  showToast('✨ Perfil actualizado correctamente');
}


// ROUTING & APP RENDERING
function switchTab(tabId) {
  state.activeTab = tabId;

  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-tab') === tabId);
  });

  document.querySelectorAll('.view-panel').forEach(panel => panel.classList.remove('active'));

  const targetView = document.getElementById(`view-${tabId}`);
  if (targetView) targetView.classList.add('active');

  const titles = {
    inicio: { title: 'Bienvenido a OrganizApp', sub: 'Revisa tus pendientes y mantén al día tus materias' },
    materias: { title: 'Mis Materias', sub: 'Administra tus asignaturas y consulta sus actividades' },
    tareas: { title: 'Tareas Pendientes', sub: 'Organizadas por fecha de entrega de la más próxima a la última' },
    evaluaciones: { title: 'Próximas Evaluaciones', sub: 'Fechas de exámenes para estudiar con tiempo' },
    terminadas: { title: 'Tareas Terminadas', sub: 'Tu historial de trabajos y entregas completadas' }
  };

  const pageTitle = document.getElementById('page-title');
  const pageSub = document.getElementById('page-subtitle');
  if (titles[tabId]) {
    pageTitle.textContent = titles[tabId].title;
    pageSub.textContent = titles[tabId].sub;
  }

  document.querySelector('.sidebar').classList.remove('mobile-open');
  renderApp();
}

function renderApp() {
  if (!currentUser) return;
  updateBadgesAndStats();
  populateSubjectDropdowns();

  if (state.activeTab === 'inicio') {
    renderDashboard();
  } else if (state.activeTab === 'materias') {
    renderSubjectsView();
  } else if (state.activeTab === 'tareas') {
    renderTasksView();
  } else if (state.activeTab === 'evaluaciones') {
    renderExamsView();
  } else if (state.activeTab === 'terminadas') {
    renderCompletedView();
  }
}

function updateBadgesAndStats() {
  const pendingTasks = state.tasks.filter(t => !t.completed);
  const completedTasks = state.tasks.filter(t => t.completed);

  document.getElementById('badge-materias-count').textContent = state.subjects.length;
  document.getElementById('badge-tareas-count').textContent = pendingTasks.length;
  document.getElementById('badge-evaluaciones-count').textContent = state.exams.length;
  document.getElementById('badge-terminadas-count').textContent = completedTasks.length;

  document.getElementById('stat-pending').textContent = pendingTasks.length;
  document.getElementById('stat-completed').textContent = completedTasks.length;
  document.getElementById('stat-exams').textContent = state.exams.length;
  document.getElementById('hero-urgent-count').textContent = pendingTasks.length;

  document.getElementById('pending-tasks-count').textContent = pendingTasks.length;
  document.getElementById('subjects-count').textContent = state.subjects.length;
  document.getElementById('upcoming-exams-count').textContent = state.exams.length;
  document.getElementById('done-tasks-count').textContent = completedTasks.length;
}

// RENDER DASHBOARD
function renderDashboard() {
  const pendingTasks = getSortedTasks().filter(t => !t.completed);
  const tasksContainer = document.getElementById('dashboard-tasks-container');

  if (pendingTasks.length === 0) {
    tasksContainer.innerHTML = createEmptyStateHTML('🎉', '¡Sin tareas pendientes!', 'Estás totalmente al día. Aprovecha para descansar o repasar materias.');
  } else {
    tasksContainer.innerHTML = pendingTasks.slice(0, 4).map(task => createTaskCardHTML(task)).join('');
  }

  const subjectsContainer = document.getElementById('dashboard-subjects-container');
  if (state.subjects.length === 0) {
    subjectsContainer.innerHTML = createEmptyStateHTML('📚', 'Aún no agregaste materias', 'Crea tus materias para poder asignarle tareas y exámenes.');
  } else {
    subjectsContainer.innerHTML = state.subjects.slice(0, 6).map(sub => createSubjectCardHTML(sub)).join('');
  }

  const sortedExams = [...state.exams].sort((a, b) => new Date(a.date) - new Date(b.date));
  const examsContainer = document.getElementById('dashboard-exams-container');
  if (sortedExams.length === 0) {
    examsContainer.innerHTML = createEmptyStateHTML('🎯', 'Sin evaluaciones próximas', 'No tienes ninguna prueba o examen registrado por el momento.');
  } else {
    examsContainer.innerHTML = sortedExams.slice(0, 3).map(exam => createExamCardHTML(exam)).join('');
  }

  const completedTasks = state.tasks.filter(t => t.completed);
  const completedContainer = document.getElementById('dashboard-completed-container');
  if (completedTasks.length === 0) {
    completedContainer.innerHTML = `<p class="text-muted" style="font-size: 13px; font-style: italic;">No has completado ninguna tarea todavía. ¡Ánimo con tus entregas!</p>`;
  } else {
    completedContainer.innerHTML = completedTasks.slice(0, 3).map(t => {
      const subject = getSubject(t.subjectId);
      return `
        <div class="completed-item">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 16px;">✅</span>
            <span class="completed-item-title">${escapeHTML(t.title)}</span>
            <span style="font-size: 11px; background: #e2e8f0; padding: 2px 8px; border-radius: 99px; font-weight:600;">${subject ? escapeHTML(subject.title) : ''}</span>
          </div>
          <button class="btn-text-sm" onclick="toggleTaskComplete('${t.id}')">Desmarcar</button>
        </div>
      `;
    }).join('');
  }
}

function renderSubjectsView() {
  const container = document.getElementById('full-subjects-grid');
  if (state.subjects.length === 0) {
    container.innerHTML = createEmptyStateHTML('📚', 'No tienes materias registradas', 'Haz clic en el botón "+ Nueva Materia" para comenzar a organizar tu ciclo lectivo.');
  } else {
    container.innerHTML = state.subjects.map(sub => createSubjectCardHTML(sub, true)).join('');
  }
}

function renderTasksView() {
  const subjectFilter = document.getElementById('filter-task-subject').value;
  const priorityFilter = document.getElementById('filter-task-priority').value;
  const statusFilter = document.getElementById('filter-task-status').value;

  let filtered = getSortedTasks();

  if (subjectFilter !== 'ALL') {
    filtered = filtered.filter(t => t.subjectId === subjectFilter);
  }
  if (priorityFilter !== 'ALL') {
    filtered = filtered.filter(t => t.priority === priorityFilter);
  }
  if (statusFilter === 'pending') {
    filtered = filtered.filter(t => !t.completed);
  } else if (statusFilter === 'completed') {
    filtered = filtered.filter(t => t.completed);
  }

  const container = document.getElementById('full-tasks-list');
  if (filtered.length === 0) {
    container.innerHTML = createEmptyStateHTML('📌', 'No hay tareas que coincidan', 'Prueba cambiando los filtros de búsqueda o agrega una nueva tarea.');
  } else {
    container.innerHTML = filtered.map(t => createTaskCardHTML(t)).join('');
  }
}

function renderExamsView() {
  const subjectFilter = document.getElementById('filter-exam-subject').value;
  let sortedExams = [...state.exams].sort((a, b) => new Date(a.date) - new Date(b.date));

  if (subjectFilter !== 'ALL') {
    sortedExams = sortedExams.filter(e => e.subjectId === subjectFilter);
  }

  const container = document.getElementById('full-exams-list');
  if (sortedExams.length === 0) {
    container.innerHTML = createEmptyStateHTML('🎯', 'No hay evaluaciones registradas', 'Mantén tus fechas de examen al día agregando una nueva evaluación.');
  } else {
    container.innerHTML = sortedExams.map(exam => createExamCardHTML(exam, true)).join('');
  }
}

function renderCompletedView() {
  const completed = state.tasks.filter(t => t.completed);
  const container = document.getElementById('full-completed-list');

  if (completed.length === 0) {
    container.innerHTML = createEmptyStateHTML('🏆', 'Aún no hay tareas terminadas', 'Cuando completes tareas pendientes aparecerán en este espacio.');
  } else {
    container.innerHTML = completed.map(t => createTaskCardHTML(t)).join('');
  }
}

function getSortedTasks() {
  const priorityWeights = { alta: 3, media: 2, baja: 1 };
  return [...state.tasks].sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    if (dateA - dateB !== 0) return dateA - dateB;
    return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
  });
}

function createTaskCardHTML(task) {
  const subject = getSubject(task.subjectId);
  const subjectColor = subject ? subject.color : '#6366f1';
  const subjectEmoji = subject ? subject.emoji : '📌';
  const subjectTitle = subject ? subject.title : 'Sin Materia';

  const formattedDate = formatFriendlyDate(task.dueDate);
  const isUrgent = !task.completed && isDateUrgent(task.dueDate);

  return `
    <div class="task-card ${task.completed ? 'task-completed' : ''}">
      <div class="task-card-header">
        <span class="task-subject-pill" style="background-color: ${subjectColor}">
          <span>${subjectEmoji}</span>
          <span>${escapeHTML(subjectTitle)}</span>
        </span>
        <span class="priority-tag priority-${task.priority}">
          ${task.priority === 'alta' ? '🔴 Alta' : task.priority === 'media' ? '🟠 Media' : '🟢 Baja'}
        </span>
      </div>

      <h4 class="task-title">${escapeHTML(task.title)}</h4>
      ${task.description ? `<p class="task-desc">${escapeHTML(task.description)}</p>` : ''}

      <div class="task-footer">
        <div class="task-due-date ${isUrgent ? 'urgent' : ''}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>Entrega: ${formattedDate}</span>
        </div>

        <div class="task-actions">
          <button class="btn-complete-task ${task.completed ? 'completed' : ''}" onclick="toggleTaskComplete('${task.id}')" title="${task.completed ? 'Marcar como pendiente' : 'Marcar como terminada'}">
            ${task.completed ? '✓ Terminada' : '✓ Marcar'}
          </button>
          <button class="btn-icon-danger" onclick="deleteTask('${task.id}')" title="Eliminar tarea">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

function createSubjectCardHTML(subject) {
  const pendingCount = state.tasks.filter(t => t.subjectId === subject.id && !t.completed).length;
  const examCount = state.exams.filter(e => e.subjectId === subject.id).length;

  return `
    <div class="subject-card" onclick="viewSubjectDetail('${subject.id}')">
      <div class="subject-card-top">
        <div class="subject-icon-box" style="background-color: ${subject.color}">
          ${subject.emoji}
        </div>
        <button class="btn-icon-danger" onclick="event.stopPropagation(); deleteSubject('${subject.id}')" title="Eliminar materia">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>

      <div>
        <h4 class="subject-title">${escapeHTML(subject.title)}</h4>
        <div class="subject-meta">
          ${subject.teacher ? `<span>👨‍🏫 ${escapeHTML(subject.teacher)}</span>` : ''}
          ${subject.room ? `<span style="margin-left: 8px;">📍 ${escapeHTML(subject.room)}</span>` : ''}
        </div>
      </div>

      <div class="subject-card-footer">
        <span class="subject-task-count">📌 ${pendingCount} pendiente${pendingCount !== 1 ? 's' : ''}</span>
        <span class="subject-exam-count">🎯 ${examCount} examen${examCount !== 1 ? 'es' : ''}</span>
      </div>
    </div>
  `;
}

function createExamCardHTML(exam) {
  const subject = getSubject(exam.subjectId);
  const dateObj = new Date(exam.date + 'T00:00:00');
  const dayNum = dateObj.getDate();
  const monthName = dateObj.toLocaleDateString('es-ES', { month: 'short' });

  const countdownText = getExamCountdownText(exam.date);
  const isSoon = isExamSoon(exam.date);

  return `
    <div class="exam-card">
      <div class="exam-date-box" style="background-color: ${subject ? subject.color + '18' : '#eef2ff'}; color: ${subject ? subject.color : '#6366f1'}">
        <div class="exam-date-day">${dayNum}</div>
        <div class="exam-date-month">${monthName}</div>
      </div>

      <div class="exam-info">
        <span class="exam-materia-tag" style="color: ${subject ? subject.color : '#6366f1'}">
          ${subject ? subject.emoji + ' ' + escapeHTML(subject.title) : 'Materia'}
        </span>
        <h4 class="exam-title">${escapeHTML(exam.title)}</h4>
        ${exam.description ? `<p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">${escapeHTML(exam.description)}</p>` : ''}
      </div>

      <div style="display: flex; align-items: center; gap: 12px;">
        <span class="exam-countdown ${isSoon ? 'soon' : ''}">${countdownText}</span>
        <button class="btn-icon-danger" onclick="deleteExam('${exam.id}')" title="Eliminar examen">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  `;
}

function createEmptyStateHTML(icon, title, desc) {
  return `
    <div class="empty-state">
      <div class="empty-icon">${icon}</div>
      <h4>${title}</h4>
      <p>${desc}</p>
    </div>
  `;
}

// SINGLE SUBJECT DETAIL MODAL/VIEW
function viewSubjectDetail(subjectId) {
  const subject = getSubject(subjectId);
  if (!subject) return;

  const subjectTasks = state.tasks.filter(t => t.subjectId === subjectId);
  const pendingTasks = subjectTasks.filter(t => !t.completed);
  const subjectExams = state.exams.filter(e => e.subjectId === subjectId);

  const detailContainer = document.getElementById('subject-detail-modal');
  detailContainer.classList.remove('hidden');

  detailContainer.innerHTML = `
    <div style="background: var(--bg-card); padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); margin-top: 24px; box-shadow: var(--shadow-md);">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 52px; height: 52px; border-radius: var(--radius-md); background: ${subject.color}; display: flex; align-items: center; justify-content: center; font-size: 26px;">
            ${subject.emoji}
          </div>
          <div>
            <h3 style="font-family: var(--font-heading); font-size: 22px; font-weight: 700;">${escapeHTML(subject.title)}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">
              ${subject.teacher ? 'Docente: ' + escapeHTML(subject.teacher) : ''}
              ${subject.room ? ' | ' + escapeHTML(subject.room) : ''}
            </p>
          </div>
        </div>

        <button class="btn btn-secondary" onclick="closeSubjectDetail()">✕ Cerrar detalle</button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        <div>
          <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 12px;">
            📌 Tareas Pendientes (${pendingTasks.length})
          </h4>
          ${pendingTasks.length === 0 ? '<p class="text-muted" style="font-size: 13px;">No hay tareas pendientes para esta materia.</p>' :
            `<div class="tasks-grid" style="grid-template-columns: 1fr;">${pendingTasks.map(t => createTaskCardHTML(t)).join('')}</div>`}
        </div>

        <div>
          <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 12px;">
            🎯 Evaluaciones (${subjectExams.length})
          </h4>
          ${subjectExams.length === 0 ? '<p class="text-muted" style="font-size: 13px;">No hay exámenes agendados para esta materia.</p>' :
            `<div class="exams-list">${subjectExams.map(e => createExamCardHTML(e)).join('')}</div>`}
        </div>
      </div>
    </div>
  `;
}

function closeSubjectDetail() {
  const detailContainer = document.getElementById('subject-detail-modal');
  detailContainer.classList.add('hidden');
  detailContainer.innerHTML = '';
}

// TOGGLE & DELETE
function toggleTaskComplete(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    if (task.completed) {
      task.completedAt = new Date().toISOString();
      showToast(`🎉 ¡Genial! Tarea "${task.title}" marcada como terminada`);
    } else {
      delete task.completedAt;
      showToast(`📌 Tarea "${task.title}" reabierta a pendientes`);
    }
    saveUserData();
    renderApp();
  }
}

function deleteTask(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (task && confirm(`¿Eliminar la tarea "${task.title}"?`)) {
    state.tasks = state.tasks.filter(t => t.id !== taskId);
    saveUserData();
    renderApp();
    showToast('🗑️ Tarea eliminada');
  }
}

function deleteExam(examId) {
  const exam = state.exams.find(e => e.id === examId);
  if (exam && confirm(`¿Eliminar la evaluación "${exam.title}"?`)) {
    state.exams = state.exams.filter(e => e.id !== examId);
    saveUserData();
    renderApp();
    showToast('🗑️ Evaluación eliminada');
  }
}

function deleteSubject(subjectId) {
  const subject = getSubject(subjectId);
  if (!subject) return;

  if (confirm(`¿Eliminar la materia "${subject.title}"? Se eliminarán también sus tareas asociadas.`)) {
    state.subjects = state.subjects.filter(s => s.id !== subjectId);
    state.tasks = state.tasks.filter(t => t.subjectId !== subjectId);
    state.exams = state.exams.filter(e => e.subjectId !== subjectId);
    saveUserData();
    closeSubjectDetail();
    renderApp();
    showToast(`🗑️ Materia "${subject.title}" eliminada`);
  }
}

function resetToDemoData() {
  if (confirm('¿Restablecer datos de prueba iniciales para tu usuario?')) {
    const demo = getDefaultDemoData();
    state.subjects = demo.subjects;
    state.tasks = demo.tasks;
    state.exams = demo.exams;
    saveUserData();
    renderApp();
    showToast('✨ Datos de prueba restablecidos');
  }
}

// MODAL ADD CONTROLLERS
function openAddModal(defaultType = 'task') {
  const modal = document.getElementById('modal-add');
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');

  document.getElementById('task-date').value = getRelativeDate(0);
  document.getElementById('exam-date').value = getRelativeDate(3);

  switchModalTab(defaultType);
}

function closeAddModal() {
  const modal = document.getElementById('modal-add');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
}

function switchModalTab(type) {
  document.querySelectorAll('.modal-tab').forEach(t => {
    t.classList.toggle('active', t.getAttribute('data-type') === type);
  });

  document.querySelectorAll('.modal-form').forEach(f => f.classList.remove('active'));

  const formMap = {
    task: 'form-add-task',
    exam: 'form-add-exam',
    subject: 'form-add-subject'
  };

  const activeForm = document.getElementById(formMap[type]);
  if (activeForm) activeForm.classList.add('active');
}

function populateSubjectDropdowns() {
  const taskSelect = document.getElementById('task-materia');
  const examSelect = document.getElementById('exam-materia');
  const taskFilterSelect = document.getElementById('filter-task-subject');
  const examFilterSelect = document.getElementById('filter-exam-subject');

  const optionsHTML = state.subjects.map(s => `
    <option value="${s.id}">${s.emoji} ${escapeHTML(s.title)}</option>
  `).join('');

  if (taskSelect) taskSelect.innerHTML = optionsHTML || '<option value="">Crea una materia primero</option>';
  if (examSelect) examSelect.innerHTML = optionsHTML || '<option value="">Crea una materia primero</option>';

  const filterOptionsHTML = `<option value="ALL">Todas las materias</option>` + optionsHTML;
  if (taskFilterSelect) {
    const currentVal = taskFilterSelect.value;
    taskFilterSelect.innerHTML = filterOptionsHTML;
    taskFilterSelect.value = currentVal || 'ALL';
  }
  if (examFilterSelect) {
    const currentVal = examFilterSelect.value;
    examFilterSelect.innerHTML = filterOptionsHTML;
    examFilterSelect.value = currentVal || 'ALL';
  }
}

function handleAddTask(e) {
  e.preventDefault();
  const subjectId = document.getElementById('task-materia').value;
  const title = document.getElementById('task-title').value.trim();
  const dueDate = document.getElementById('task-date').value;
  const priority = document.getElementById('task-priority').value;
  const description = document.getElementById('task-desc').value.trim();

  if (!subjectId) {
    alert('Por favor selecciona una materia primero.');
    return;
  }
  if (!title || !dueDate) {
    alert('Por favor completa el nombre de la tarea y la fecha.');
    return;
  }

  // Moderation check on task title / desc
  const modCheck = checkOffensiveContent(title + ' ' + description);
  if (modCheck.isOffensive) {
    alert(`⚠️ El texto contiene términos inapropiados ("${modCheck.detectedWord}"). Por favor redacta la tarea de forma respetuosa.`);
    return;
  }

  const newTask = {
    id: 'task-' + Date.now(),
    subjectId,
    title,
    dueDate,
    priority,
    description,
    completed: false,
    createdAt: new Date().toISOString()
  };

  state.tasks.unshift(newTask);
  saveUserData();
  closeAddModal();
  e.target.reset();

  renderApp();
  showToast('✨ Tarea agregada con éxito');
}

function handleAddExam(e) {
  e.preventDefault();
  const subjectId = document.getElementById('exam-materia').value;
  const title = document.getElementById('exam-title').value.trim();
  const date = document.getElementById('exam-date').value;
  const description = document.getElementById('exam-desc').value.trim();

  if (!subjectId) {
    alert('Por favor selecciona una materia primero.');
    return;
  }
  if (!title || !date) {
    alert('Por favor completa el nombre del examen y la fecha.');
    return;
  }

  const modCheck = checkOffensiveContent(title + ' ' + description);
  if (modCheck.isOffensive) {
    alert(`⚠️ El título o tema contiene palabras inapropiadas ("${modCheck.detectedWord}").`);
    return;
  }

  const newExam = {
    id: 'exam-' + Date.now(),
    subjectId,
    title,
    date,
    description
  };

  state.exams.push(newExam);
  saveUserData();
  closeAddModal();
  e.target.reset();

  renderApp();
  showToast('🎯 Evaluación agendada con éxito');
}

function handleAddSubject(e) {
  e.preventDefault();
  const title = document.getElementById('subject-title').value.trim();
  const teacher = document.getElementById('subject-teacher').value.trim();
  const room = document.getElementById('subject-room').value.trim();

  if (!title) {
    alert('Ingresa el nombre de la materia.');
    return;
  }

  const modCheck = checkOffensiveContent(title);
  if (modCheck.isOffensive) {
    alert(`⚠️ El nombre de la materia contiene términos no permitidos ("${modCheck.detectedWord}").`);
    return;
  }

  const newSubject = {
    id: 'subj-' + Date.now(),
    title,
    teacher,
    room,
    emoji: state.selectedEmoji || '📚',
    color: state.selectedColor || '#6366f1'
  };

  state.subjects.push(newSubject);
  saveUserData();
  closeAddModal();
  e.target.reset();

  renderApp();
  showToast(`📚 Materia "${title}" creada con éxito`);
}

function handleGlobalSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  if (!query) {
    renderApp();
    return;
  }

  if (state.activeTab === 'inicio') switchTab('tareas');

  const filteredTasks = getSortedTasks().filter(t => {
    const subject = getSubject(t.subjectId);
    return t.title.toLowerCase().includes(query) ||
           (t.description && t.description.toLowerCase().includes(query)) ||
           (subject && subject.title.toLowerCase().includes(query));
  });

  const tasksContainer = document.getElementById('full-tasks-list');
  if (tasksContainer) {
    if (filteredTasks.length === 0) {
      tasksContainer.innerHTML = createEmptyStateHTML('🔍', 'Sin resultados', `No encontramos coincidencias para "${escapeHTML(query)}".`);
    } else {
      tasksContainer.innerHTML = filteredTasks.map(t => createTaskCardHTML(t)).join('');
    }
  }
}

// HELPERS
function getSubject(id) {
  return state.subjects.find(s => s.id === id);
}

function formatFriendlyDate(dateStr) {
  if (!dateStr) return '';
  const target = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = target - today;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '¡Hoy!';
  if (diffDays === 1) return 'Mañana';
  if (diffDays === -1) return 'Ayer (Atrasada)';
  if (diffDays < -1) return `Hace ${Math.abs(diffDays)} días (Atrasada)`;
  if (diffDays > 1 && diffDays <= 6) {
    const daysName = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return daysName[target.getDay()] + ` (en ${diffDays} días)`;
  }

  return target.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function isDateUrgent(dateStr) {
  const target = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0,0,0,0);
  const diffTime = target - today;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 2;
}

function getExamCountdownText(dateStr) {
  const target = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0,0,0,0);
  const diffTime = target - today;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '⚡ ¡HOY!';
  if (diffDays === 1) return '⏰ Mañana';
  if (diffDays > 1) return `En ${diffDays} días`;
  return 'Concluido';
}

function isExamSoon(dateStr) {
  const target = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0,0,0,0);
  const diffTime = target - today;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 5;
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// ==========================================================================
// PWA SERVICE WORKER & DOWNLOAD / INSTALL MANAGEMENT
// ==========================================================================
let deferredPwaPrompt = null;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('[OrganizApp] ServiceWorker registrado con éxito:', reg.scope))
      .catch(err => console.error('[OrganizApp] Error registrando ServiceWorker:', err));
  });
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPwaPrompt = e;
  console.log('[OrganizApp] PWA install prompt disponible');
});

function openInstallModal() {
  const modal = document.getElementById('modal-install-app');
  if (!modal) return;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

function closeInstallModal() {
  const modal = document.getElementById('modal-install-app');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
}

function handlePwaInstall() {
  if (deferredPwaPrompt) {
    deferredPwaPrompt.prompt();
    deferredPwaPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        showToast('🎉 ¡OrganizApp se instaló correctamente en tu dispositivo!');
      } else {
        showToast('Instalación cancelada.');
      }
      deferredPwaPrompt = null;
      closeInstallModal();
    });
  } else {
    showToast('Sigue las instrucciones en pantalla para instalar según tu navegador 📱');
  }
}

function downloadOfflinePackage() {
  // Generate downloadable single HTML package with all styles and content embedded
  const htmlContent = document.documentElement.outerHTML;
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'OrganizApp_Offline.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('💾 Se descargó la versión offline de OrganizApp.');
}

