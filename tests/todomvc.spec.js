// @ts-check
import { test, expect } from '@playwright/test';
import { TodoMvcPage } from '../pages/TodoMvcPage';

test('agrega una tarea pendiente y actualiza el contador', async ({ page }) => {
  // La fixture page crea un contexto nuevo sin tareas almacenadas para cada test.
  const todoPage = new TodoMvcPage(page);
  const title = 'Preparar curso Sensei Tech';

  await todoPage.goto();
  await expect(todoPage.newTodo).toBeVisible();
  await expect(todoPage.todoItems).toHaveCount(0);

  await todoPage.addTodo(title);

  await expect(todoPage.todoItems).toHaveCount(1);
  await expect(todoPage.todoItem(title)).toBeVisible();
  await expect(todoPage.todoCheckbox(title)).not.toBeChecked();
  await expect(todoPage.todoCount).toHaveText('1 item left');
});

test('completa una tarea y la conserva visible en All', async ({ page }) => {
  const todoPage = new TodoMvcPage(page);
  const title = 'Preparar curso Sensei Tech';

  await todoPage.goto();
  await expect(todoPage.newTodo).toBeVisible();
  await expect(todoPage.todoItems).toHaveCount(0);
  await todoPage.addTodo(title);
  await todoPage.showAll();

  await expect(todoPage.todoItems).toHaveCount(1);
  await expect(todoPage.todoCheckbox(title)).not.toBeChecked();
  await expect(todoPage.todoCount).toHaveText('1 item left');
  await expect(todoPage.clearCompletedButton).not.toBeVisible();

  await todoPage.completeTodo(title);

  await expect(page).toHaveURL('https://demo.playwright.dev/todomvc/#/');
  await expect(todoPage.allFilter).toHaveClass(/\bselected\b/);
  await expect(todoPage.todoItem(title)).toBeVisible();
  await expect(todoPage.todoCheckbox(title)).toBeChecked();
  await expect(todoPage.todoCount).toHaveText('0 items left');
  await expect(todoPage.clearCompletedButton).toBeVisible();
});

test('elimina la tarea pendiente y conserva la tarea completada', async ({ page }) => {
  const todoPage = new TodoMvcPage(page);
  const completedTitle = 'Preparar curso Sensei Tech';
  const pendingTitle = 'Revisar material del curso';

  await todoPage.goto();
  await expect(todoPage.newTodo).toBeVisible();
  await expect(todoPage.todoItems).toHaveCount(0);
  await todoPage.addTodo(completedTitle);
  await todoPage.completeTodo(completedTitle);
  await todoPage.addTodo(pendingTitle);
  await todoPage.showAll();

  await expect(todoPage.allFilter).toHaveClass(/\bselected\b/);
  await expect(todoPage.todoItems).toHaveCount(2);
  await expect(todoPage.todoItem(completedTitle)).toBeVisible();
  await expect(todoPage.todoItem(pendingTitle)).toBeVisible();
  await expect(todoPage.todoCheckbox(completedTitle)).toBeChecked();
  await expect(todoPage.todoCheckbox(pendingTitle)).not.toBeChecked();
  await expect(todoPage.todoCount).toHaveText('1 item left');

  await todoPage.deleteTodo(pendingTitle);

  await expect(todoPage.todoItem(pendingTitle)).toHaveCount(0);
  await expect(todoPage.todoItems).toHaveCount(1);
  await expect(todoPage.todoItem(completedTitle)).toBeVisible();
  await expect(todoPage.todoCheckbox(completedTitle)).toBeChecked();
  await expect(todoPage.todoCount).toHaveText('0 items left');
});

test('filtra tareas activas y completadas conservando sus estados', async ({ page }) => {
  const todoPage = new TodoMvcPage(page);
  const completedTitle = 'Preparar curso Sensei Tech';
  const pendingTitle = 'Revisar material del curso';

  await todoPage.goto();
  await expect(todoPage.newTodo).toBeVisible();
  await expect(todoPage.todoItems).toHaveCount(0);
  await todoPage.addTodo(completedTitle);
  await todoPage.completeTodo(completedTitle);
  await todoPage.addTodo(pendingTitle);
  await todoPage.showAll();
  await expect(todoPage.todoItems).toHaveCount(2);

  await todoPage.showActive();
  await expect(page).toHaveURL('https://demo.playwright.dev/todomvc/#/active');
  await expect(todoPage.activeFilter).toHaveClass(/\bselected\b/);
  await expect(todoPage.todoItems).toHaveCount(1);
  await expect(todoPage.todoItem(pendingTitle)).toBeVisible();
  await expect(todoPage.todoItem(completedTitle)).toHaveCount(0);
  await expect(todoPage.todoCheckbox(pendingTitle)).not.toBeChecked();
  await expect(todoPage.todoCount).toHaveText('1 item left');

  await todoPage.showCompleted();
  await expect(page).toHaveURL('https://demo.playwright.dev/todomvc/#/completed');
  await expect(todoPage.completedFilter).toHaveClass(/\bselected\b/);
  await expect(todoPage.todoItems).toHaveCount(1);
  await expect(todoPage.todoItem(completedTitle)).toBeVisible();
  await expect(todoPage.todoItem(pendingTitle)).toHaveCount(0);
  await expect(todoPage.todoCheckbox(completedTitle)).toBeChecked();
  await expect(todoPage.todoCount).toHaveText('1 item left');

  await todoPage.showAll();
  await expect(page).toHaveURL('https://demo.playwright.dev/todomvc/#/');
  await expect(todoPage.allFilter).toHaveClass(/\bselected\b/);
  await expect(todoPage.todoItems).toHaveCount(2);
  await expect(todoPage.todoItem(completedTitle)).toBeVisible();
  await expect(todoPage.todoItem(pendingTitle)).toBeVisible();
  await expect(todoPage.todoCheckbox(completedTitle)).toBeChecked();
  await expect(todoPage.todoCheckbox(pendingTitle)).not.toBeChecked();
  await expect(todoPage.todoCount).toHaveText('1 item left');
});

for (const { name, input } of [
  { name: 'campo vacío', input: '' },
  { name: 'tres espacios', input: '   ' },
]) {
  test(`rechaza ${name} y permite agregar una tarea válida después`, async ({ page }) => {
    const todoPage = new TodoMvcPage(page);
    const title = 'Preparar curso Sensei Tech';

    await todoPage.goto();
    await expect(todoPage.newTodo).toBeVisible();
    await expect(todoPage.todoItems).toHaveCount(0);
    await expect(todoPage.todoCount).not.toBeVisible();

    await todoPage.addTodo(input);
    await expect(todoPage.todoItems).toHaveCount(0);
    await expect(todoPage.todoCount).not.toBeVisible();

    // addTodo usa fill para reemplazar cualquier contenido que haya quedado.
    await todoPage.addTodo(title);
    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(todoPage.todoItem(title)).toBeVisible();
    await expect(todoPage.todoCheckbox(title)).not.toBeChecked();
    await expect(todoPage.todoCount).toHaveText('1 item left');
  });
}
