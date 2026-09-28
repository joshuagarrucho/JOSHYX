const registerForm = document.getElementById("registerForm");
const registerStatus = document.getElementById("statusMessage");
const memberStorageKey = "joshyxRegisteredMembers";

function readLocalArray(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setRegisterStatus(text, type) {
  if (!registerStatus) return;
  registerStatus.textContent = text;
  registerStatus.className = `form-message ${type}`;
}

function initializeRegisterForm() {
  if (!registerForm) return;

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fullNameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const regionInput = document.getElementById("region");

    const fullName = fullNameInput?.value.trim() || "";
    const email = emailInput?.value.trim().toLowerCase() || "";
    const password = passwordInput?.value || "";
    const confirmPassword = confirmPasswordInput?.value || "";
    const region = regionInput?.value || "Other";
    const fit = "Regular";
    const size = "M";

    if (!fullName) {
      setRegisterStatus("Enter your full name to register.", "error");
      return;
    }

    if (!email || !(emailInput instanceof HTMLInputElement) || !emailInput.validity.valid) {
      setRegisterStatus("Enter a valid email address.", "error");
      return;
    }

    if (!password) {
      setRegisterStatus("Create a password to continue.", "error");
      return;
    }

    if (password !== confirmPassword) {
      setRegisterStatus("Passwords do not match. Please try again.", "error");
      return;
    }

    const members = readLocalArray(memberStorageKey);
    const existingMember = members.find((entry) => entry.email === email);

    if (existingMember) {
      setRegisterStatus("This email is already registered. Please sign in instead.", "error");
      return;
    }

    members.push({
      fullName,
      email,
      password,
      region,
      fit,
      size,
      registeredAt: new Date().toISOString(),
    });

    localStorage.setItem(memberStorageKey, JSON.stringify(members));

    if (passwordInput instanceof HTMLInputElement) {
      passwordInput.value = "";
    }
    if (confirmPasswordInput instanceof HTMLInputElement) {
      confirmPasswordInput.value = "";
    }

    setRegisterStatus("Account created. You can now sign in on the login page.", "success");
  });
}

initializeRegisterForm();
