const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("statusMessage");
const sessionPreview = document.getElementById("sessionPreview");
const loginSavedMembers = document.getElementById("savedMembers");
const loginToggleMembers = document.getElementById("toggleMembers");

const memberStorageKey = "joshyxRegisteredMembers";
const activeSessionKey = "joshyxActiveMember";
const rememberedEmailKey = "joshyxRememberedEmail";

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

function readSessionObject(key) {
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setLoginStatus(text, type) {
  if (!loginStatus) return;
  loginStatus.textContent = text;
  loginStatus.className = `form-message ${type}`;
}

function formatDate(dateText) {
  const date = new Date(dateText);
  return Number.isNaN(date.getTime()) ? "Unknown time" : date.toLocaleString();
}

function renderSessionCard(title, lines) {
  if (!sessionPreview) return;
  sessionPreview.innerHTML = "";

  const card = document.createElement("article");
  const heading = document.createElement("strong");
  card.className = "saved-card";
  heading.textContent = title;
  card.appendChild(heading);

  lines.forEach((line) => {
    const text = document.createElement("span");
    text.textContent = line;
    card.appendChild(text);
  });

  sessionPreview.appendChild(card);
}

function renderSessionState() {
  const activeSession = readSessionObject(activeSessionKey);
  const rememberedEmail = localStorage.getItem(rememberedEmailKey);

  if (activeSession) {
    renderSessionCard("Signed in on this tab", [
      activeSession.fullName,
      activeSession.email,
      `Fit: ${activeSession.fit} | Size: ${activeSession.size}`,
      `Last login: ${formatDate(activeSession.loggedInAt)}`,
    ]);
    return;
  }

  if (rememberedEmail) {
    renderSessionCard("Remembered browser member", [
      rememberedEmail,
      "Password still required for sign-in.",
    ]);
    return;
  }

  if (!sessionPreview) return;
  sessionPreview.innerHTML = "";
  const empty = document.createElement("div");
  empty.className = "saved-empty";
  empty.textContent = "No active JOSHYX session yet. Sign in to preview the current member state.";
  sessionPreview.appendChild(empty);
}

function renderSavedMembers() {
  const members = readLocalArray(memberStorageKey);
  if (!loginSavedMembers) return;
  loginSavedMembers.innerHTML = "";

  if (!members.length) {
    const empty = document.createElement("div");
    empty.className = "saved-empty";
    empty.textContent = "No registered JOSHYX members found in this browser yet.";
    loginSavedMembers.appendChild(empty);
    return;
  }

  members.forEach((member, index) => {
    const card = document.createElement("article");
    const name = document.createElement("strong");
    const email = document.createElement("span");
    const fit = document.createElement("span");
    const region = document.createElement("span");

    card.className = "saved-card";
    name.textContent = `${member.fullName} | JX-${String(index + 1).padStart(4, "0")}`;
    email.textContent = member.email;
    fit.textContent = `Fit: ${member.fit} | Size: ${member.size}`;
    region.textContent = `Region: ${member.region}`;

    card.append(name, email, fit, region);
    loginSavedMembers.appendChild(card);
  });
}

function hydrateRememberedEmail() {
  const rememberedEmail = localStorage.getItem(rememberedEmailKey);
  if (!rememberedEmail) return;
  const emailInput = document.getElementById("email");
  const rememberMeInput = document.getElementById("rememberMe");

  if (emailInput instanceof HTMLInputElement) {
    emailInput.value = rememberedEmail;
  }

  if (rememberMeInput instanceof HTMLInputElement) {
    rememberMeInput.checked = true;
  }
}

function initializeLoginForm() {
  if (!loginForm) return;

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const rememberMeInput = document.getElementById("rememberMe");

    const email = emailInput?.value.trim().toLowerCase() || "";
    const password = passwordInput?.value || "";
    const rememberMe = rememberMeInput?.checked || false;

    if (!email || !(emailInput instanceof HTMLInputElement) || !emailInput.validity.valid) {
      setLoginStatus("Please enter a valid member email address.", "error");
      return;
    }

    if (!password) {
      setLoginStatus("Please enter your password.", "error");
      return;
    }

    const members = readLocalArray(memberStorageKey);
    const member = members.find((entry) => entry.email === email && entry.password === password);

    if (!member) {
      setLoginStatus("We could not match that email and password in this browser. Register first or try again.", "error");
      return;
    }

    const activeSession = {
      fullName: member.fullName,
      email: member.email,
      fit: member.fit,
      size: member.size,
      region: member.region,
      loggedInAt: new Date().toISOString(),
    };

    sessionStorage.setItem(activeSessionKey, JSON.stringify(activeSession));

    if (rememberMe) {
      localStorage.setItem(rememberedEmailKey, member.email);
    } else {
      localStorage.removeItem(rememberedEmailKey);
    }

    if (passwordInput instanceof HTMLInputElement) {
      passwordInput.value = "";
    }

    setLoginStatus(`Welcome back, ${member.fullName}. Your JOSHYX session is ready on this tab.`, "success");
    renderSessionState();
  });
}

function initializeSavedMembersToggle() {
  if (!loginToggleMembers) return;

  loginToggleMembers.addEventListener("click", () => {
    const willShow = loginSavedMembers?.hidden;
    if (!loginSavedMembers) return;

    loginSavedMembers.hidden = !willShow;
    loginToggleMembers.textContent = willShow ? "Hide members" : "Show members";

    if (willShow) {
      renderSavedMembers();
    }
  });
}

hydrateRememberedEmail();
renderSessionState();
initializeLoginForm();
initializeSavedMembersToggle();
