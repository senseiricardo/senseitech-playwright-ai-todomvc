# Playwright con IA — Sensei Tech

Proyecto del curso de Sensei Tech para practicar automatización de pruebas con JavaScript, Playwright Test y Codex. Incluye los tests iniciales y un ejemplo de Page Object que utiliza la misma página: https://playwright.dev/.

## Requisitos

- Node.js 20 o superior, requerido por la versión instalada de Playwright.
- npm.
- Acceso a Internet para instalar dependencias y navegadores y acceder a la página probada.
- Codex, si deseas realizar los ejercicios con asistencia de IA.

## Instalación

Desde la raíz del proyecto, instala las versiones del archivo de bloqueo y los navegadores:

```bash
npm ci
npx playwright install
```

En Linux, si faltan dependencias del sistema, puedes instalarlas junto con los navegadores con `npx playwright install --with-deps`.

## Ejecutar tests

La configuración existente ejecuta los tests en Chromium, Firefox y WebKit:

```bash
npx playwright test
```

Ejecutar únicamente el ejemplo con Page Object en los tres navegadores:

```bash
npx playwright test tests/playwright-home.spec.js
```

Ejecutarlo únicamente en Chromium o ver el navegador durante la ejecución:

```bash
npx playwright test tests/playwright-home.spec.js --project=chromium
npx playwright test tests/playwright-home.spec.js --project=chromium --headed
```

Abrir el reporte HTML generado por la última ejecución:

```bash
npx playwright show-report
```

Estos comandos utilizan la CLI de Playwright; `package.json` no define scripts npm. La configuración conserva ejecución en paralelo, reintentos en CI y trazas en el primer reintento.

## Estructura

```text
pages/
  PlaywrightHomePage.js      # Locators y acciones de la página inicial
tests/
  example.spec.js            # Tests iniciales, conservados
  playwright-home.spec.js    # Test que utiliza el Page Object
.github/                    # Configuración existente de GitHub
AGENTS.md                   # Reglas para trabajar con Codex
playwright.config.js        # Navegadores, reporter y opciones de ejecución
package.json                # Dependencias del proyecto
package-lock.json           # Versiones reproducibles para npm ci
playwright-report/          # Reporte HTML generado (ignorado)
test-results/               # Artefactos de ejecución (ignorados)
```

El Page Object reúne los locators y las acciones; el test expresa el comportamiento esperado mediante assertions con `await`. Cada test recibe una página aislada de Playwright.

Para practicar con Codex, solicita un cambio concreto, revisa los archivos generados y el resultado de los tests. Por ejemplo: «Agrega un test independiente usando el Page Object, conserva las assertions existentes y ejecuta el archivo modificado». Las reglas del proyecto están en `AGENTS.md`. No incluyas credenciales en archivos ni prompts.
