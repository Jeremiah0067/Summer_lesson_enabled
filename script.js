// Supabase client (supabaseClient) comes from config.js, loaded before this file.

const WHATSAPP_LINK = "https://chat.whatsapp.com/DMy1CZvwtcH56FHnppLOqQ";

const form = document.getElementById("regForm");
const formScreen = document.getElementById("formScreen");
const successScreen = document.getElementById("successScreen");
const submitBtn = document.getElementById("submitBtn");
const submitError = document.getElementById("submitError");

function clearErrors() {
  document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
  document.querySelectorAll("input.invalid").forEach((el) => el.classList.remove("invalid"));
  submitError.classList.add("hidden");
  submitError.textContent = "";
}

function setError(name, message) {
  const el = form.querySelector(`[data-error-for="${name}"]`);
  if (el) el.textContent = message;
}

function getCheckedValues(name) {
  return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map((i) => i.value);
}

function getSelectedOptions(selectEl) {
  return Array.from(selectEl.selectedOptions).map((o) => o.value);
}

function validate() {
  clearErrors();
  let valid = true;

  const fullName = form.fullName.value.trim();
  if (!fullName) {
    setError("fullName", "Please enter your name.");
    valid = false;
  }

  const phone = form.phone.value.trim();
  const digitsOnly = phone.replace(/[\s-]/g, "");
  const phonePattern = /^\+?[0-9]{8,15}$/;
  if (!phone) {
    setError("phone", "Please enter a phone number.");
    valid = false;
  } else if (!phonePattern.test(digitsOnly)) {
    setError("phone", "Enter digits only, with country code (e.g. +2348012345678).");
    valid = false;
  }

  const email = form.email.value.trim();
  if (email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("email", "Enter a valid email address.");
      valid = false;
    }
  }

  const country = form.country.value.trim();
  if (!country) {
    setError("country", "Please enter your country of residence.");
    valid = false;
  }

  const numStudents = form.numStudents.value.trim();
  if (!numStudents || Number(numStudents) < 1) {
    setError("numStudents", "Please enter how many students you're enrolling.");
    valid = false;
  }

  const studentNames = form.studentNames.value.trim();
  if (!studentNames) {
    setError("studentNames", "Please enter the name(s) of the student(s).");
    valid = false;
  }

  if (!getSelectedOptions(form.grade).length) {
    setError("grade", "Please select at least one year/grade.");
    valid = false;
  }

  if (!getCheckedValues("subjects").length) {
    setError("subjects", "Please select at least one subject.");
    valid = false;
  }

  if (!getCheckedValues("classTime").length) {
    setError("classTime", "Please select at least one preferred time.");
    valid = false;
  }

  return valid;
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.querySelector(".btn-text").textContent = isLoading
    ? "Registering..."
    : "Register & Get WhatsApp Link";
  submitBtn.querySelector(".btn-spinner").classList.toggle("hidden", !isLoading);
}

function showSuccess() {
  formScreen.classList.add("hidden");
  successScreen.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Best-effort: try to open WhatsApp automatically.
  // Most browsers block this since it's after an async request,
  // so the visible button is the reliable path — this is a bonus.
  const opened = window.open(WHATSAPP_LINK, "_blank");
  if (!opened) {
    // popup blocked — that's fine, the button on screen still works
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validate()) {
    const firstError = form.querySelector(".error:not(:empty)");
    if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const payload = {
    full_name: form.fullName.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim() || null,
    country: form.country.value.trim(),
    num_students: Number(form.numStudents.value.trim()),
    student_names: form.studentNames.value.trim(),
    grade: getSelectedOptions(form.grade).join(", "),
    subjects: getCheckedValues("subjects").join(", "),
    class_time: getCheckedValues("classTime").join(", "),
  };

  setLoading(true);

  try {
    const { error } = await supabaseClient.from("registrations").insert([payload]);

    if (!error) {
      showSuccess();
    } else {
      submitError.textContent =
        "Something went wrong submitting the form (" + error.message + "). Please try again.";
      submitError.classList.remove("hidden");
    }
  } catch (err) {
    submitError.textContent = "Network error — please check your connection and try again.";
    submitError.classList.remove("hidden");
  } finally {
    setLoading(false);
  }
});
