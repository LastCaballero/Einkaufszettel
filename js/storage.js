import { state } from "./state.js";

const STORAGE_KEY = "einkaufszettel_state";

export function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  Object.assign(state, JSON.parse(raw));
}

export function clearAll() {
  localStorage.removeItem(STORAGE_KEY);
}

export function clearAllData() {
  clearAll();
  state.categories = [];
  state.activeCategoryId = null;
  console.log("Data cleared");
}
