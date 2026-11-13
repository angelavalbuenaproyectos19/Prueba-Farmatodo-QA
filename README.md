# Prueba Audifarma - Automatización QA

Suite de pruebas automatizadas con **Playwright + JavaScript** para https://wordcounter.net/, aplicando el patrón **Page Object Model**. El contador de frecuencia de palabras vive en su propio repositorio.

| Parte de la prueba                    | Dónde está                                                                                             |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 1. Suite de pruebas automatizadas     | `tests/`, `pages/`, `fixtures/`, `test-data/`, `reporters/`                                            |
| 2. Reporte de fallas y hallazgos      | `docs/REPORTE_FALLAS.md`                                                                               |
| Escenarios definidos                  | `docs/ESCENARIOS.md`                                                                                   |
| 4. Contador de frecuencia de palabras | [Repositorio independiente](https://github.com/angelavalbuenaproyectos19/contador-frecuencia-palabras) |

---

## 1. Requisitos previos

| Herramienta              | Versión                                    | Cómo verificar  |
| ------------------------ | ------------------------------------------ | --------------- |
| Node.js                  | 18 o superior (probado con 22)             | `node -v`       |
| npm                      | 9 o superior                               | `npm -v`        |
| Git                      | cualquiera reciente                        | `git --version` |
| Google Chrome (opcional) | solo para ejecutar con el Chrome instalado | —               |

Se necesita conexión a internet: las pruebas navegan al sitio real https://wordcounter.net/.

## 2. Clonar el proyecto e instalar

```bash
# 1. Clonar el repositorio
git clone https://github.com/angelavalbuenaproyectos19/Prueba-Audifarma.git

# 2. Entrar a la carpeta
cd Prueba-Audifarma

# 3. Instalar las dependencias (Playwright)
npm install

# 4. Descargar el navegador que usa Playwright (solo la primera vez)
npx playwright install chromium
```

## 3. Ejecutar las pruebas en local

### Ejecución completa (sin ventana, modo headless)

```bash
npm test
```

Al terminar se imprime un **resumen** con los escenarios ejecutados, aprobados y fallidos, junto con la descripción del error de cada falla. El mismo resumen se guarda en `reports/summary.txt`.

### Ver las pruebas en un navegador (modo visible)

```bash
# Con el Chromium de Playwright
npx playwright test --headed

# Con tu Google Chrome instalado (macOS / Linux)
npm run test:headed
```

En Windows, el script `test:headed` no funciona tal cual (usa una variable de entorno en línea). Usa en su lugar:

```powershell
$env:PW_CHANNEL="chrome"; npx playwright test --headed --workers=2
```

### Ejecutar solo una parte

```bash
# Un archivo
npx playwright test tests/e2e/wordcounter.spec.js     # conteos y Keyword Density con la configuración por defecto
npx playwright test tests/e2e/options.spec.js         # menú de opciones y sus combinaciones
npx playwright test tests/e2e/espanol.spec.js         # textos en español

# Un escenario por su ID o por texto del título
npx playwright test -g "WC-01"
npx playwright test -g "OP-07"

# Modo interactivo de Playwright (elegir y depurar pruebas)
npx playwright test --ui
```

### Pruebas unitarias del reporter

```bash
npm run test:unit
```

### Ver el reporte HTML

```bash
npm run report
```

Abre el reporte detallado de Playwright con pasos, capturas y trazas de las pruebas fallidas.

## 4. Cómo interpretar los resultados

- **APROBADO**: el sitio se comporta como se espera.
- **FALLIDO**: el resultado del sitio difiere del esperado. Algunos escenarios **fallan a propósito** porque documentan defectos reales del sitio (están marcados con `DEFECTO` en el título y con la etiqueta `@defecto-conocido`, y explicados en `docs/REPORTE_FALLAS.md`). Una ejecución con esas fallas es el resultado esperado, no un problema del proyecto.
- El sitio actualiza el panel Keyword Density con un pequeño retraso; las pruebas esperan con `expect.poll` en lugar de pausas fijas.
- Cada prueba abre un navegador limpio, así que parte siempre de la configuración por defecto del sitio.

## 5. Estructura del proyecto (Page Object Model)

```
pages/BasePage.js                         clase base (página de Playwright y navegación)
pages/WordCounterPage.js                  page object principal; recibe sus componentes (inyectables)
pages/components/StatsPanel.js            contadores; registro de métricas (nombre -> selector)
pages/components/KeywordDensityPanel.js   lista de Keyword Density
pages/components/OptionsPanel.js          menú de opciones; registro de opciones (nombre -> acción)
fixtures/index.js                         fixtures que entregan los page objects listos
utils/number.js                           utilidades compartidas (conversión de números con separador de miles)
test-data/                                datos de los escenarios (IDs, textos, valores esperados)
tests/e2e/                                pruebas end to end: solo aserciones, sin selectores
tests/unit/                               pruebas unitarias del reporter
reporters/format-summary.js               formato puro del resumen (ejecutados / aprobados / fallidos)
reporters/summary-reporter.js             reporter de Playwright: recolecta resultados y escribe el archivo
docs/                                     escenarios y reporte de fallas
.github/workflows/ci.yml                  integración continua (GitHub Actions)
eslint.config.js, .prettierrc.json        reglas de lint y formato
.editorconfig                             estilo base del editor
```

## 6. Contador de frecuencia de palabras

El contador (punto 4) está en un repositorio independiente, con su propio README, pruebas unitarias y de integración y CI: https://github.com/angelavalbuenaproyectos19/contador-frecuencia-palabras

## 7. Problemas frecuentes

| Problema                                       | Solución                                                                                           |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `browserType.launch: Executable doesn't exist` | Falta el navegador: ejecuta `npx playwright install chromium`.                                     |
| Pruebas con timeout o fallas intermitentes     | Revisa tu conexión: el sitio se consulta en vivo. Reintenta con `npx playwright test --workers=1`. |
| `npm run test:headed` falla en Windows         | Usa el comando de PowerShell de la sección 3.                                                      |
| Quiero empezar de cero                         | Borra `node_modules`, `test-results` y `playwright-report`, y repite la instalación.               |

## 8. Calidad de código

```bash
npm run lint            # revisa el código con ESLint (incluye reglas de buenas prácticas de Playwright)
npm run lint:fix        # corrige automáticamente lo que se pueda
npm run format:check    # verifica el formato con Prettier
npm run format          # aplica el formato
```

Antes de subir cambios, ejecuta `npm run lint`, `npm run format:check` y `npm run test:unit`.

### Integración continua (GitHub Actions)

El flujo `.github/workflows/ci.yml` se ejecuta en cada push y pull request a `main`:

| Job                  | Qué hace                                                                                        | ¿Bloquea?        |
| -------------------- | ----------------------------------------------------------------------------------------------- | ---------------- |
| `calidad`            | lint, formato y pruebas unitarias del reporter                                                  | Sí               |
| `e2e`                | pruebas end to end sin los escenarios de defectos conocidos (`--grep-invert @defecto-conocido`) | Sí               |
| `defectos-conocidos` | solo los escenarios etiquetados `@defecto-conocido`, que fallan a propósito                     | No (informativo) |

El resumen y el reporte HTML se guardan como artefactos de cada ejecución.

## 9. Cómo extender el proyecto

- **Nueva métrica del panel de contadores:** agrega una entrada (nombre -> selector) en `METRIC_SELECTORS` de `pages/components/StatsPanel.js`; las pruebas ya la leen con `app.stats.value('nombre')`.
- **Nueva opción de Keyword Density:** agrega una entrada (nombre -> acción) en `keywordDensityOptions` de `pages/components/OptionsPanel.js` y úsala en los datos con `options: { nombre: valor }`.
- **Nuevo escenario:** agrega un objeto en `test-data/` (id, título, texto y valores esperados); los specs lo recorren sin cambios.
- **Nueva página o sección del sitio:** crea un page object que extienda `BasePage` y regístralo en `fixtures/index.js`.
