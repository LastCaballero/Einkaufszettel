export const state = {
  categories: [
    { id: "1", name: "Getränke", items: [] },
    { id: "2", name: "Essen", items: [] }
  ],
  activeCategoryId: null
};


export function setActiveCategory(id) {
  state.activeCategoryId = id;
}

export function addCategory(name) {
  if (!name || name.trim() === "") return;
  
  const newId = String(Math.max(...state.categories.map(c => parseInt(c.id)), 0) + 1);
  const newCategory = { id: newId, name: name.trim(), items: [] };
  state.categories.push(newCategory);
  state.activeCategoryId = newId;
}

export function deleteCategory(id) {
  state.categories = state.categories.filter(c => c.id !== id);
  
  // Wenn gelöschte Kategorie aktiv war, nächste Kategorie auswählen
  if (state.activeCategoryId === id) {
    state.activeCategoryId = state.categories.length > 0 ? state.categories[0].id : null;
  }
}

export function moveCategory(fromIndex, toIndex) {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= state.categories.length || toIndex >= state.categories.length) {
    return;
  }
  
  const [movedCategory] = state.categories.splice(fromIndex, 1);
  state.categories.splice(toIndex, 0, movedCategory);
}

// ----- ITEM FUNKTIONEN -----

export function addItem(categoryId, label) {
  if (!label || label.trim() === "") return;
  
  const category = state.categories.find(c => c.id === categoryId);
  if (!category) return;
  
  const itemId = String(Math.max(...category.items.map(i => parseInt(i.id) || 0), 0) + 1);
  const newItem = {
    id: itemId,
    label: label.trim(),
    qty: "1",
    done: false
  };
  category.items.push(newItem);
}

export function updateItem(categoryId, itemId, updates) {
  const category = state.categories.find(c => c.id === categoryId);
  if (!category) return;
  
  const item = category.items.find(i => i.id === itemId);
  if (!item) return;
  
  Object.assign(item, updates);
}

export function deleteItem(categoryId, itemId) {
  const category = state.categories.find(c => c.id === categoryId);
  if (!category) return;
  
  category.items = category.items.filter(i => i.id !== itemId);
}

export function moveItem(categoryId, fromIndex, toIndex) {
  const category = state.categories.find(c => c.id === categoryId);
  if (!category) return;
  
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= category.items.length || toIndex >= category.items.length) {
    return;
  }
  
  const [movedItem] = category.items.splice(fromIndex, 1);
  category.items.splice(toIndex, 0, movedItem);
}

export function toggleItemDone(categoryId, itemId) {
  const category = state.categories.find(c => c.id === categoryId);
  if (!category) return;
  
  const item = category.items.find(i => i.id === itemId);
  if (!item) return;
  
  item.done = !item.done;
}
