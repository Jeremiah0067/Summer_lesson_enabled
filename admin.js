// Supabase client (supabaseClient) comes from config.js, loaded before this file.

const loginScreen = document.getElementById("loginScreen");
const dashScreen = document.getElementById("dashScreen");
const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");

const resultsBody = document.getElementById("resultsBody");
const resultCount = document.getElementById("resultCount");
const exportCsvBtn = document.getElementById("exportCsvBtn");

const searchInput = document.getElementById("searchInput");
const gradeFilter = document.getElementById("gradeFilter");
const curriculumFilter = document.getElementById("curriculumFilter");
const classTimeFilter = document.getElementById("classTimeFilter");
const applyFiltersBtn = document.getElementById("applyFiltersBtn");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");

let currentRows = [];

const COLUMNS = [
  { key: "created_at", label: "Date", fmt: (v) => new Date(v).toLocaleDateString() },
  { key: "full_name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "country", label: "Country" },
  { key: "state", label: "State" },
  { key: "num_students", label: "# Students" },
  { key: "student_names", label: "Student Name(s)" },
  { key: "grade", label: "Grade" },
  { key: "subjects", label: "Subjects" },
  { key: "curriculum", label: "Curriculum" },
  { key: "class_time", label: "Class Time" },
  { key: "source", label: "Source" },
];

// ---------- AUTH ----------

async function checkSession() {
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    showDashboard();
  } else {
    showLogin();
  }
}

function showLogin() {
  loginScreen.classList.remove("hidden");
  dashScreen.classList.add("hidden");
}

function showDashboard() {
  loginScreen.classList.add("hidden");
  dashScreen.classList.remove("hidden");
  loadData();
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.classList.add("hidden");
  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in...";

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

  loginBtn.disabled = false;
  loginBtn.textContent = "Log in";

  if (error) {
    loginError.textContent = "Login failed: " + error.message;
    loginError.classList.remove("hidden");
    return;
  }

  showDashboard();
});

logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  showLogin();
});

// ---------- DATA ----------

async function loadData() {
  resultCount.textContent = "Loading...";
  exportCsvBtn.disabled = true;

  let query = supabaseClient.from("registrations").select("*").order("created_at", { ascending: false });

  const grade = gradeFilter.value;
  const curriculum = curriculumFilter.value;
  const classTime = classTimeFilter.value;
  const search = searchInput.value.trim();

  if (grade) query = query.ilike("grade", `%${grade}%`);
  if (curriculum) query = query.eq("curriculum", curriculum);
  if (classTime) query = query.ilike("class_time", `%${classTime}%`);
  if (search) query = query.or(`full_name.ilike.%${search}%,student_names.ilike.%${search}%`);

  const { data, error } = await query;

  if (error) {
    resultCount.textContent = "Error loading data: " + error.message;
    resultsBody.innerHTML = "";
    return;
  }

  currentRows = data || [];
  renderTable(currentRows);
}

function renderTable(rows) {
  resultCount.textContent = `${rows.length} registration${rows.length === 1 ? "" : "s"}`;
  exportCsvBtn.disabled = rows.length === 0;

  if (!rows.length) {
    resultsBody.innerHTML = `<tr class="empty-row"><td colspan="${COLUMNS.length}">No registrations match these filters.</td></tr>`;
    return;
  }

  resultsBody.innerHTML = rows
    .map((row) => {
      const cells = COLUMNS.map((col) => {
        const raw = row[col.key];
        const display = raw === null || raw === undefined || raw === "" ? "—" : col.fmt ? col.fmt(raw) : raw;
        return `<td>${escapeHtml(String(display))}</td>`;
      }).join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- FILTERS ----------

applyFiltersBtn.addEventListener("click", loadData);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") loadData();
});

clearFiltersBtn.addEventListener("click", () => {
  searchInput.value = "";
  gradeFilter.value = "";
  curriculumFilter.value = "";
  classTimeFilter.value = "";
  loadData();
});

// ---------- CSV EXPORT ----------

function toCsv(rows) {
  const header = COLUMNS.map((c) => c.label).join(",");
  const lines = rows.map((row) =>
    COLUMNS.map((col) => {
      const raw = row[col.key];
      const display = raw === null || raw === undefined ? "" : col.fmt ? col.fmt(raw) : raw;
      const str = String(display).replace(/"/g, '""');
      return `"${str}"`;
    }).join(",")
  );
  return [header, ...lines].join("\r\n");
}

exportCsvBtn.addEventListener("click", () => {
  const csv = toCsv(currentRows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateStamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `registrations-${dateStamp}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// ---------- INIT ----------

checkSession();
