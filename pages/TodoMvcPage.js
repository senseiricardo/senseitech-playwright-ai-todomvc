// @ts-check

export class TodoMvcPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.newTodo = page.getByRole('textbox', { name: 'What needs to be done?', exact: true });
    this.todoItems = page.getByTestId('todo-item');
    this.todoCount = page.getByTestId('todo-count');
    this.allFilter = page.getByRole('link', { name: 'All', exact: true });
    this.activeFilter = page.getByRole('link', { name: 'Active', exact: true });
    this.completedFilter = page.getByRole('link', { name: 'Completed', exact: true });
    this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed', exact: true });
  }

  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc/');
  }

  /** @param {string} title */
  async addTodo(title) {
    await this.newTodo.fill(title);
    await this.newTodo.press('Enter');
  }

  /** @param {string} title */
  async completeTodo(title) {
    await this.todoCheckbox(title).check();
  }

  async showAll() {
    await this.allFilter.click();
  }

  async showActive() {
    await this.activeFilter.click();
  }

  async showCompleted() {
    await this.completedFilter.click();
  }

  /** @param {string} title */
  async deleteTodo(title) {
    const item = this.todoItem(title);
    await item.hover();
    await item.getByRole('button', { name: 'Delete', exact: true }).click();
  }

  /** @param {string} title */
  todoItem(title) {
    return this.todoItems.filter({ has: this.page.getByTestId('todo-title').getByText(title, { exact: true }) });
  }

  /** @param {string} title */
  todoCheckbox(title) {
    return this.todoItem(title).getByRole('checkbox', { name: 'Toggle Todo', exact: true });
  }
}
