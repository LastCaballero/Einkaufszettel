import { state, moveCategory, moveItem } from "./state.js";
import { renderApp } from "./ui.js";
import { saveState } from "./storage.js";

let draggedTabIndex = null;
let draggedItemInfo = null;

export function initDragDrop() {
  // Tabs draggable machen
  const tabsEl = document.getElementById("tabs");
  if (tabsEl) {
    setupTabDragListeners(tabsEl);
  }

  // Items draggable machen
  setupItemDragListeners();
}

function setupTabDragListeners(tabsEl) {
  const tabs = tabsEl.querySelectorAll(".tab");
  
  tabs.forEach((tab, index) => {
    tab.draggable = true;

    tab.addEventListener("dragstart", (e) => {
      draggedTabIndex = index;
      tab.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
    });

    tab.addEventListener("dragend", () => {
      tab.classList.remove("dragging");
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("drag-over"));
    });

    tab.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      
      if (draggedTabIndex !== null && draggedTabIndex !== index) {
        tab.classList.add("drag-over");
      }
    });

    tab.addEventListener("dragleave", () => {
      tab.classList.remove("drag-over");
    });

    tab.addEventListener("drop", (e) => {
      e.preventDefault();
      
      if (draggedTabIndex !== null && draggedTabIndex !== index) {
        moveCategory(draggedTabIndex, index);
        saveState();
        renderApp();
      }
      
      tab.classList.remove("drag-over");
    });
  });
}

function setupItemDragListeners() {
  const items = document.querySelectorAll(".item");

  items.forEach((item, index) => {
    item.addEventListener("dragstart", (e) => {
      draggedItemInfo = {
        categoryId: item.dataset.categoryId,
        fromIndex: parseInt(item.dataset.itemIndex)
      };
      item.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
    });

    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      document.querySelectorAll(".item").forEach(i => i.classList.remove("drag-over"));
    });

    item.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      
      if (draggedItemInfo && draggedItemInfo.categoryId === item.dataset.categoryId) {
        const fromIndex = draggedItemInfo.fromIndex;
        const toIndex = parseInt(item.dataset.itemIndex);
        
        if (fromIndex !== toIndex) {
          item.classList.add("drag-over");
        }
      }
    });

    item.addEventListener("dragleave", () => {
      item.classList.remove("drag-over");
    });

    item.addEventListener("drop", (e) => {
      e.preventDefault();
      
      if (draggedItemInfo) {
        const toIndex = parseInt(item.dataset.itemIndex);
        moveItem(draggedItemInfo.categoryId, draggedItemInfo.fromIndex, toIndex);
        saveState();
        renderApp();
      }
      
      item.classList.remove("drag-over");
      draggedItemInfo = null;
    });
  });
}
