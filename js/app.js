import { loadState, saveState, clearAllData } from "./storage.js";
import { state, addCategory } from "./state.js";
import { renderApp } from "./ui.js";

window.addEventListener("DOMContentLoaded", () => {
  loadState();
  if (!state.activeCategoryId && state.categories.length > 0) {
    state.activeCategoryId = state.categories[0].id;
  }

  renderApp();

  // Button Event-Listener
  const addBtn = document.getElementById("add-category-btn");
  const categoryInput = document.getElementById("category-input");

  addBtn.addEventListener("click", () => {
    addCategory(categoryInput.value);
    saveState();
    categoryInput.value = "";
    renderApp();
  });

  // Enter-Taste im Input-Feld
  categoryInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addCategory(categoryInput.value);
      saveState();
      categoryInput.value = "";
      renderApp();
    }
  });

  // Clear All Button
  const clearBtn = document.getElementById("clear-all-btn");
  clearBtn.addEventListener("click", () => {
    if (confirm("Wirklich alles löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
      clearAllData();
      console.log("State after clear:", state);
      renderApp();
    }
  });
});
