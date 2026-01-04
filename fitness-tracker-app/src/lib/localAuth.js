// Lightweight local auth using bcryptjs for hashing.
// Demo-only: credentials persist in localStorage; not for production.

import bcrypt from "bcryptjs";

const USERS_KEY = "fitverse_users";
const SESSION_KEY = "fitverse_session";

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

export function signOutUser() {
  localStorage.removeItem(SESSION_KEY);
}

export async function registerUser({ email, password, displayName }) {
  const users = loadUsers();
  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) throw new Error("An account with this email already exists");

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  function safeUUID() {
    try {
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
      }
    } catch {}
    // Fallback: pseudo-random ID
    return "uid-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  const newUser = {
    id: safeUUID(),
    email,
    displayName: (displayName || "").trim() || email.split("@")[0],
    passwordHash: hash,
    createdAt: Date.now(),
  };
  users.push(newUser);
  saveUsers(users);

  const sessionUser = { uid: newUser.id, email: newUser.email, displayName: newUser.displayName };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}

export async function loginUser(email, password) {
  const users = loadUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error("Account not found");

  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) throw new Error("Invalid credentials");

  const sessionUser = { uid: user.id, email: user.email, displayName: user.displayName };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}
