# Convenciones del curso de Sensei Tech

- Usar JavaScript y Playwright Test. Conservar la configuración y el trabajo existente salvo que el cambio solicitado requiera modificarlos.
- Preferir `getByRole`, `getByLabel` y `getByTestId` para localizar elementos. Usar nombres accesibles precisos y limitar los locators al contexto necesario.
- Usar `await` en las acciones asíncronas y en las assertions de Playwright, por ejemplo `await expect(locator).toBeVisible()`.
- Mantener los tests independientes: cada test prepara su propio estado y no depende del orden de ejecución ni de datos creados por otro test.
- Evitar esperas fijas como `page.waitForTimeout()`. Usar el auto-wait de Playwright y assertions que esperen el estado esperado.
- No eliminar ni debilitar assertions para hacer pasar tests. Investigar el fallo y corregir su causa; explicar los fallos que no se puedan resolver.
- No incluir credenciales, tokens ni secretos en código, documentación, prompts o logs.
- Ejecutar los tests modificados o creados y explicar el comando, el resultado y cualquier limitación del entorno.
- Mantener los Page Objects en `pages/` y los tests en `tests/`. Centralizar locators y acciones en los Page Objects y expresar las expectativas del escenario en los tests.
- Usar comandos que existan en la CLI instalada o en `package.json`; no inventar scripts npm.
- Después de crear o modificar tests, revisar el plan de pruebas correspondiente en `specs/` y actualizar tanto la sección del escenario como el resumen de cobertura.
- Determinar la cobertura leyendo las acciones y assertions implementadas. No marcar un escenario como completamente cubierto si faltan validaciones del resultado esperado; indicar cobertura parcial y detallar lo pendiente.
- Registrar los resultados de ejecución por separado de la cobertura. Un escenario cubierto puede fallar al ejecutarse; no afirmar que pasó si no se ejecutó.