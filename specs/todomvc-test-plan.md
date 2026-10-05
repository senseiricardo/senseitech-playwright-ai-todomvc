# Plan de pruebas de TodoMVC

URL: https://demo.playwright.dev/todomvc/

Exploración realizada el 5 de octubre de 2026 con Playwright MCP. Se revisaron `AGENTS.md`, `pages/TodoMvcPage.js` y los tres archivos actuales de `tests/`. Este documento no añade ni modifica tests.

## Evidencia y preparación

Los resultados indicados como **observados** se comprobaron mediante interacciones y snapshots de accesibilidad del navegador MCP. Durante la exploración se limpió el almacenamiento local de este origen y se volvió a abrir la página para obtener una lista vacía. Los escenarios siguientes deben preparar su propio estado, sin depender de otro escenario; para futuros tests se puede usar el contexto aislado de la fixture `page`, como hace el test actual.

Locators observados y disponibles en el Page Object: textbox `What needs to be done?`, `data-testid="todo-item"`, `data-testid="todo-title"`, checkbox `Toggle Todo` dentro de cada tarea y `data-testid="todo-count"`. También se observaron los enlaces `All`, `Active`, `Completed` y el botón `Delete`, que aparece al pasar el puntero sobre una tarea. Las acciones y locators nuevos deberán centralizarse en el Page Object; las expectativas permanecerán en los tests, conforme a `AGENTS.md`.

**Límites y suposiciones:** no se supone que la exploración MCP demuestre el mismo comportamiento en todos los navegadores. No se verificaron persistencia tras recargar, entradas con otros caracteres de espacio ni eliminación de tareas completadas. Ninguno de esos comportamientos se presenta como observado en este plan.

## 1. Agregar una tarea

**Precondiciones:** contexto limpio, página abierta en `#/`, lista vacía y campo de nueva tarea visible.

**Pasos:**

1. Escribir `Preparar curso Sensei Tech` en `What needs to be done?`.
2. Presionar Enter.

**Resultado esperado — observado:** aparece exactamente una tarea con ese título; su checkbox `Toggle Todo` está desmarcado y el contador muestra `1 item left`.

**Cobertura actual:** completa. `tests/todomvc.spec.js`, test `agrega una tarea pendiente y actualiza el contador`, verifica lista inicialmente vacía, exactamente una tarea después de agregar, visibilidad de la tarea, checkbox desmarcado y texto exacto del contador. Se corrigió la expectativa errónea de dos tareas manteniendo el conteo exacto requerido. No crear un duplicado.

## 2. Completar una tarea

**Precondiciones:** contexto limpio, filtro `All` y una única tarea pendiente `Preparar curso Sensei Tech`, preparada para este escenario; contador `1 item left`.

**Pasos:**

1. Hacer clic en el checkbox `Toggle Todo` de esa tarea.

**Resultado esperado — observado:** la tarea permanece visible en `All`, su checkbox queda marcado, el contador muestra `0 items left` y aparece `Clear completed`.

**Cobertura actual:** completa. `tests/todomvc.spec.js`, test `completa una tarea y la conserva visible en All`, prepara una tarea pendiente y verifica la transición: sigue visible en All, checkbox marcado, contador `0 items left` y botón `Clear completed` visible.

## 3. Eliminar una tarea

**Precondiciones:** contexto limpio y filtro `All`; preparar `Preparar curso Sensei Tech` completada y `Revisar material del curso` pendiente. Hay dos tareas y el contador muestra `1 item left`.

**Pasos:**

1. Pasar el puntero sobre `Revisar material del curso`.
2. Hacer clic en el botón `Delete` dentro de esa tarea.

**Resultado esperado — observado:** desaparece `Revisar material del curso`; queda únicamente `Preparar curso Sensei Tech` con su checkbox marcado. El contador pasa a `0 items left`. Esta preparación permite comprobar que la eliminación afecta solo a la tarea elegida.

**Cobertura actual:** completa. `tests/todomvc.spec.js`, test `elimina la tarea pendiente y conserva la tarea completada`, prepara su propio contexto con las dos tareas y comprueba el filtro All, sus estados y el contador inicial. Ejecuta hover y Delete limitado a la tarea pendiente mediante `TodoMvcPage.deleteTodo(title)`. Verifica que la tarea eliminada tiene cero coincidencias, queda exactamente una tarea con el título esperado, su checkbox sigue marcado y el contador muestra `0 items left`.

## 4. Filtrar tareas activas y completadas

**Precondiciones:** contexto limpio y filtro `All`; preparar `Preparar curso Sensei Tech` completada y `Revisar material del curso` pendiente. El contador muestra `1 item left`.

**Pasos:**

1. Hacer clic en `Active`.
2. Hacer clic en `Completed`.
3. Hacer clic en `All`.

**Resultado esperado — observado:**

- En `#/active`, solo aparece `Revisar material del curso`, con checkbox desmarcado.
- En `#/completed`, solo aparece `Preparar curso Sensei Tech`, con checkbox marcado.
- Al volver a `#/`, aparecen ambas tareas con sus estados originales; filtrar no las elimina.
- El contador muestra `1 item left` en los tres filtros: cuenta las tareas pendientes, no las filas visibles.

**Cobertura actual:** completa. `tests/todomvc.spec.js`, test `filtra tareas activas y completadas conservando sus estados`, prepara ambas tareas de forma independiente. Verifica URL y filtro seleccionado, cantidad y títulos presentes o ausentes, estados de los checkboxes y contador `1 item left` en Active, Completed y All. Las acciones de filtrado y sus locators están centralizados en el Page Object.

## 5. Intentar agregar una tarea vacía

**Precondiciones:** contexto limpio, página en `#/`, lista vacía y campo `What needs to be done?` visible.

**Pasos:**

Ejecutar dos casos independientes: campo vacío (`''`) y tres espacios (`'   '`). Cada caso prepara una lista vacía en su propio contexto.

1. Reemplazar el contenido del campo con la entrada del caso usando `fill` y presionar Enter.
2. Comprobar que no existen tareas y que no aparece el contador.
3. Reemplazar el contenido con `Preparar curso Sensei Tech` usando `fill` y presionar Enter.
4. Verificar que se crea exactamente una tarea con ese título, su checkbox está desmarcado y el contador muestra `1 item left`.

**Resultado esperado — observado:** en ambos intentos la lista permanece vacía y no aparece el contador. Los snapshots no mostraron un mensaje de validación; no se presupone que exista uno ni que el campo se limpie tras rechazar espacios.

**Resultado esperado adicional solicitado:** después del rechazo se puede agregar una única tarea válida pendiente y el contador muestra `1 item left`. Esta secuencia de recuperación no formó parte de la exploración MCP original; su resultado automatizado se registra por separado de la cobertura.

**Cobertura actual:** completa. `tests/todomvc.spec.js` registra dos tests independientes: `rechaza campo vacío y permite agregar una tarea válida después` y `rechaza tres espacios y permite agregar una tarea válida después`. Ambos verifican lista vacía inicial, ausencia de tareas y de contador después del envío inválido, y creación posterior de una única tarea válida pendiente con contador `1 item left`. Reutilizan `addTodo`, que usa `fill`, sin asumir mensajes de error ni limpieza del campo.

## Resumen de cobertura

| Escenario | Cobertura actual |
| --- | --- |
| Agregar una tarea | Completa, `tests/todomvc.spec.js`: conteo exacto de una tarea |
| Completar una tarea | Sí, `tests/todomvc.spec.js`  |
| Eliminar una tarea | Completa, `tests/todomvc.spec.js` |
| Filtrar activas y completadas | Completa, `tests/todomvc.spec.js` |
| Intentar agregar una tarea vacía | Completa, dos tests independientes en `tests/todomvc.spec.js`, incluida recuperación con título válido |

`tests/example.spec.js` y `tests/playwright-home.spec.js` prueban https://playwright.dev/ y no aportan cobertura a estos escenarios de TodoMVC. La cobertura se determina leyendo las acciones y assertions implementadas; los resultados de ejecución se registran por separado a continuación.

## Registro de ejecución

### Ejecución anterior: escenarios 1 a 3

- Fecha: 5 de octubre de 2026.
- Comando: `npx playwright test tests/todomvc.spec.js --reporter=line`.
- Entorno: ejecución autorizada fuera del sandbox, debido a las restricciones de inicio de navegadores observadas previamente.
- Resultado real: **9 passed (7.2s)**, código de salida 0. Los escenarios de agregar, completar y eliminar pasaron en Chromium, Firefox y WebKit (tres tests por navegador).
- Alcance: solo los tests de TodoMVC; los escenarios de filtros y entrada vacía siguen sin implementación automatizada.

### Ejecución actual: escenarios 1 a 5

- Fecha: 5 de octubre de 2026.
- Comando: `npx playwright test tests/todomvc.spec.js --reporter=line`.
- Entorno: ejecución autorizada fuera del sandbox para iniciar los navegadores.
- Resultado real: **18 passed (10.5s)**, código de salida 0. Los seis tests de TodoMVC pasaron en Chromium, Firefox y WebKit.
- Alcance: agregar, completar, eliminar, filtros y los dos casos independientes de entrada inválida. Se verificó también que una tarea válida puede agregarse después de cada rechazo.

### Diagnóstico y verificación de la expectativa de agregar

- Fecha: 5 de octubre de 2026.
- Reproducción: `npx playwright test tests/todomvc.spec.js --grep 'agrega una tarea pendiente' --project=chromium --reporter=line --output=test-results/reproduction`.
- Resultado antes de corregir: **1 failed**, código de salida 1; `toHaveCount(2)` recibió 1. El reporte de error mostró una única tarea pendiente y contador `1 item left`.
- Diagnóstico: error del test. Desde una lista vacía se agrega una sola tarea, por lo que la cantidad esperada es exactamente 1. Se corrigió únicamente esa expectativa; se conservaron todas las assertions restantes.
- Verificación: `npx playwright test tests/todomvc.spec.js --reporter=line`.
- Resultado después de corregir: **18 passed (11.0s)**, código de salida 0; seis tests en Chromium, Firefox y WebKit. Ejecución autorizada fuera del sandbox.
