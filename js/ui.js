// ui.js
import { state, setActiveCategory, deleteCategory, addItem, updateItem, deleteItem, toggleItemDone } from "./state.js";
import { initDragDrop } from "./dragdrop.js";
import { saveState } from "./storage.js";

/*
  renderApp() wird in dieser Datei definiert und kann direkt von anderen
  Modulen importiert werden. Kein Selbst-Import nötig.
*/

// ---------------------------------------------------------
//  TABS RENDERN
// ---------------------------------------------------------

export function renderTabs() {
  const tabsEl = document.getElementById("tabs");
  tabsEl.innerHTML = "";

  state.categories.forEach(category => {
    const tab = document.createElement("div");
    tab.className = "tab";

    // Aktiven Tab markieren
    if (category.id === state.activeCategoryId) {
      tab.classList.add("active");
    }

    // Tab-Inhalt: Name + Delete-Button
    const tabContent = document.createElement("div");
    tabContent.className = "tab-content";
    
    const tabName = document.createElement("span");
    tabName.className = "tab-name";
    tabName.textContent = category.name;
    
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "tab-delete";
    deleteBtn.textContent = "×";
    deleteBtn.title = "Kategorie löschen";
    
    // Delete-Button Event (stoppt Propagation zum Tab-Click)
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm(`Kategorie "${category.name}" wirklich löschen?`)) {
        deleteCategory(category.id);
        saveState();
        renderApp();
      }
    });
    
    tabContent.appendChild(tabName);
    tabContent.appendChild(deleteBtn);
    tab.appendChild(tabContent);

    // Klick-Logik: aktiven Tab setzen (aber nicht auf den Delete-Button)
    tab.addEventListener("click", () => {
      setActiveCategory(category.id);
      saveState();
      renderApp(); // UI neu zeichnen
    });

    tabsEl.appendChild(tab);
  });

  // Drag-and-Drop für Tabs initialisieren
  initDragDrop();
}

// ---------------------------------------------------------
//  ITEMS RENDERN
// ---------------------------------------------------------

export function renderItems() {
  const itemsEl = document.getElementById("items");
  itemsEl.innerHTML = "";

  // Aktive Kategorie finden
  const activeCategory = state.categories.find(c => c.id === state.activeCategoryId);
  
  if (!activeCategory) {
    return; // Keine Kategorie aktiv
  }

  // Container für den Einkaufszettel
  const container = document.createElement("div");
  container.className = "items-container";

  // Header für die Kategorie
  const header = document.createElement("div");
  header.className = "items-header";
  const headingEl = document.createElement("h2");
  headingEl.textContent = activeCategory.name;
  header.appendChild(headingEl);

  // Input-Bereich zum Hinzufügen von Items
  const inputContainer = document.createElement("div");
  inputContainer.className = "items-input-container";
  
  const input = document.createElement("input");
  input.type = "text";
  input.className = "input-modern";
  input.placeholder = "Neuer Einkaufszettel-Eintrag...";
  
  const addBtn = document.createElement("button");
  addBtn.className = "btn-primary";
  addBtn.textContent = "+ Item";
  
  // Add-Button Event
  addBtn.addEventListener("click", () => {
    addItem(activeCategory.id, input.value);
    saveState();
    input.value = "";
    renderItems();
    initDragDrop();
  });
  
  // Enter-Taste im Input-Feld
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addItem(activeCategory.id, input.value);
      saveState();
      input.value = "";
      renderItems();
      initDragDrop();
    }
  });
  
  inputContainer.appendChild(input);
  inputContainer.appendChild(addBtn);

  // Items-Liste
  const itemsList = document.createElement("div");
  itemsList.className = "items-list";
  
  if (activeCategory.items.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.className = "empty-list";
    emptyMsg.textContent = "Leerer Einkaufszettel";
    itemsList.appendChild(emptyMsg);
  } else {
    // Items rendern
    activeCategory.items.forEach((item, index) => {
      const itemEl = document.createElement("div");
      itemEl.className = "item";
      itemEl.draggable = true;
      itemEl.dataset.itemId = item.id;
      itemEl.dataset.itemIndex = index;
      itemEl.dataset.categoryId = activeCategory.id;
      
      if (item.done) {
        itemEl.classList.add("done");
      }

      // Checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "item-checkbox";
      checkbox.checked = item.done;
      checkbox.addEventListener("change", () => {
        toggleItemDone(activeCategory.id, item.id);
        saveState();
        renderItems();
      });

      // Label (inline editierbar)
      const labelEl = document.createElement("input");
      labelEl.type = "text";
      labelEl.className = "item-label";
      labelEl.value = item.label;
      labelEl.addEventListener("blur", () => {
        updateItem(activeCategory.id, item.id, { label: labelEl.value });
        saveState();
      });
      labelEl.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          updateItem(activeCategory.id, item.id, { label: labelEl.value });
          saveState();
          labelEl.blur();
        }
      });

      // Qty (inline editierbar)
      const qtyEl = document.createElement("input");
      qtyEl.type = "number";
      qtyEl.className = "item-qty";
      qtyEl.value = item.qty;
      qtyEl.min = "1";
      qtyEl.addEventListener("blur", () => {
        updateItem(activeCategory.id, item.id, { qty: qtyEl.value || "1" });
        saveState();
      });
      qtyEl.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          updateItem(activeCategory.id, item.id, { qty: qtyEl.value || "1" });
          saveState();
          qtyEl.blur();
        }
      });

      // Delete-Button
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "item-delete";
      deleteBtn.textContent = "×";
      deleteBtn.addEventListener("click", () => {
        deleteItem(activeCategory.id, item.id);
        saveState();
        renderItems();
      });

      itemEl.appendChild(checkbox);
      itemEl.appendChild(labelEl);
      itemEl.appendChild(qtyEl);
      itemEl.appendChild(deleteBtn);

      itemsList.appendChild(itemEl);
    });
  }

  container.appendChild(header);
  container.appendChild(inputContainer);
  container.appendChild(itemsList);

  itemsEl.appendChild(container);
  
  // Drag-and-Drop für Items initialisieren
  initDragDrop();
}

// ---------------------------------------------------------
//  FOOTER RENDERN
// ---------------------------------------------------------

// Footer wird jetzt statisch in index.html gerendert

// ---------------------------------------------------------
//  GESAMTE APP RENDERN
// ---------------------------------------------------------

export function renderApp() {
  renderTabs();
  renderItems();
}
