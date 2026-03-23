import { loadState, saveState, clearAllData } from "./storage.js";
import { state, addCategory } from "./state.js";
import { renderApp } from "./ui.js";

// Funktion zum Kopieren der Daten
function copyData(data, title = "Einkaufszettel") {
  const text = data.map(category => {
    const itemsText = category.items.map(item => `  - ${item.label} (${item.qty})`).join('\n');
    return `${category.name}:\n${itemsText}`;
  }).join('\n\n');

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      // Erfolgreich kopiert, keine Meldung
    }).catch(() => {
      fallbackCopyTextToClipboard(text, title);
    });
  } else {
    fallbackCopyTextToClipboard(text, title);
  }
}

function fallbackCopyTextToClipboard(text, title) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      // Erfolgreich kopiert, keine Meldung
    } else {
      alert("Kopieren fehlgeschlagen. Daten:\n" + text);
    }
  } catch (err) {
    alert("Kopieren fehlgeschlagen. Daten:\n" + text);
  }
  document.body.removeChild(textArea);
}

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

  // Share All Button -> Copy All Button
  const shareAllBtn = document.getElementById("share-all-btn");
  shareAllBtn.addEventListener("click", () => {
    copyData(state.categories, "Einkaufszettel - Alle Kategorien");
  });
});
