<script setup lang="ts">
import TodoView from './views/TodoView'
</script>

<template>
  <TodoView />
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  color: #172026;
  background: #eef2f3;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

button,
input {
  font: inherit;
}
</style>

<style>
.todo-view {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 32px 16px;
}

.todo-panel {
  width: min(100%, 720px);
  padding: 28px;
  border: 1px solid #d9e1e4;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 18px 50px rgb(23 32 38 / 12%);
}

.todo-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 4px;
  color: #60717a;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 6vw, 3.5rem);
  line-height: 1;
}

.todo-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  color: #44545d;
}

.todo-stats span {
  padding: 7px 10px;
  border: 1px solid #d9e1e4;
  border-radius: 999px;
  background: #f7f9fa;
  font-size: 0.9rem;
  white-space: nowrap;
}

.todo-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
}

.todo-form input {
  min-width: 0;
  height: 46px;
  padding: 0 14px;
  border: 1px solid #c8d3d7;
  border-radius: 8px;
  color: #172026;
  background: #ffffff;
}

.todo-form input:focus {
  border-color: #16746b;
  outline: 3px solid rgb(22 116 107 / 16%);
}

.todo-form button,
.delete-button {
  min-height: 40px;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
}

.todo-form button {
  height: 46px;
  padding: 0 20px;
  color: #ffffff;
  background: #16746b;
}

.todo-form button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.todo-error {
  margin: 16px 0 0;
  padding: 12px 14px;
  border: 1px solid #efb0a5;
  border-radius: 8px;
  color: #8f2319;
  background: #fff4f1;
}

.todo-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin: 14px 0 0;
}

.todo-remaining,
.todo-completed {
  margin: 0;
  color: #44545d;
  font-size: 0.95rem;
  font-weight: 700;
}

.todo-completed {
  color: #60717a;
}

.todo-empty {
  margin: 24px 0 0;
  color: #60717a;
  text-align: center;
}

.todo-list {
  display: grid;
  gap: 10px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
}

.todo-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 10px 10px 10px 14px;
  border: 1px solid #d9e1e4;
  border-radius: 8px;
  background: #fbfcfc;
}

.todo-check {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  cursor: pointer;
}

.todo-check input {
  width: 18px;
  height: 18px;
  accent-color: #16746b;
}

.todo-filters {
  display: flex;
  gap: 10px;
  margin: 16px 0;
}

.todo-filters button {
  padding: 6px 12px;
  cursor: pointer;
}

.todo-filters button.active {
  font-weight: bold;
  border: 2px solid #42b883;
}

.todo-item.is-done .todo-title {
  color: #7a888f;
  text-decoration: line-through;
}

.delete-button {
  padding: 0 12px;
  color: #9e2f23;
  background: #fee9e4;
}

@media (max-width: 560px) {
  .todo-panel {
    padding: 20px;
  }

  .todo-header,
  .todo-form,
  .todo-item {
    grid-template-columns: 1fr;
  }

  .todo-header {
    align-items: start;
  }

  .todo-stats {
    justify-content: flex-start;
  }

  .delete-button {
    width: 100%;
  }
}
</style>
