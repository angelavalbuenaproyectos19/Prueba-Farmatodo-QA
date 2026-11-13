# Prueba Audifarma - Automatización QA

Suite de pruebas automatizadas con **Playwright + JavaScript** para https://wordcounter.net/, aplicando el patrón **Page Object Model**, más un contador de frecuencia de palabras independiente.

| Parte de la prueba | Dónde está |
|--------------------|------------|
| 1. Suite de pruebas automatizadas | `tests/`, `pages/`, `fixtures/`, `test-data/`, `reporters/` |
| 2. Reporte de fallas y hallazgos | `docs/REPORTE_FALLAS.md` |
| Escenarios definidos | `docs/ESCENARIOS.md` |
| 4. Contador de frecuencia de palabras | `contador-frecuencia/` |

---

## 1. Requisitos previos

| Herramienta | Versión | Cómo verificar |
|-------------|---------|----------------|
| Node.js | 18 o superior (probado con 22) | `node -v` |
| npm | 9 o superior | `npm -v` |
| Git | cualquiera reciente | `git --version` |
| Google Chrome (opcional) | solo para ejecutar con el Chrome instalado | — |

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

### Ver el reporte HTML

```bash
npm run report
```

Abre el reporte detallado de Playwright con pasos, capturas y trazas de las pruebas fallidas.

## 4. Cómo interpretar los resultados

- **APROBADO**: el sitio se comporta como se espera.
- **FALLIDO**: el resultado del sitio difiere del esperado. Algunos escenarios **fallan a propósito** porque documentan defectos reales del sitio (están marcados con `DEFECTO` en el título y explicados en `docs/REPORTE_FALLAS.md`). Una ejecución con esas fallas es el resultado esperado, no un problema del proyecto.
- El sitio actualiza el panel Keyword Density con un pequeño retraso; las pruebas esperan con `expect.poll` en lugar de pausas fijas.
- Cada prueba abre un navegador limpio, así que parte siempre de la configuración por defecto del sitio.

## 5. Estructura del proyecto (Page Object Model)

```
pages/BasePage.js                         clase base (página de Playwright y navegación)
pages/WordCounterPage.js                  page object principal; compone los componentes
pages/components/StatsPanel.js            contadores de palabras, caracteres y métricas extra
pages/components/KeywordDensityPanel.js   lista de Keyword Density
pages/components/OptionsPanel.js          menú de opciones (modal)
fixtures/index.js                         fixtures que entregan los page objects listos
test-data/                                datos de los escenarios (IDs, textos, valores esperados)
tests/e2e/                                pruebas: solo aserciones, sin selectores
reporters/summary-reporter.js             reporte resumen (ejecutados / aprobados / fallidos)
docs/                                     escenarios y reporte de fallas
contador-frecuencia/                      contador de frecuencia de palabras (independiente)
```

## 6. Contador de frecuencia de palabras

Programa independiente, sin dependencias, que lee un archivo de texto y muestra palabras, caracteres (incluye espacios, sin saltos de línea) y el histograma ordenado por frecuencia descendente y, en empate, alfabéticamente.

```bash
cd contador-frecuencia

# Ejecutar con el archivo de ejemplo del enunciado
npm start

# Ejecutar con tu propio archivo
node cli.js ruta/a/tu-archivo.txt

# Pruebas unitarias
npm test
```

Salida esperada con `data/sample.txt`:

```
14 words
99 characters

farmatodo: 6
cuida: 3
salud: 2
tu: 2
toda: 1
```

**Complejidad:** O(n) en tiempo para recorrer y contar (n = cantidad de caracteres del texto), más O(k log k) para ordenar las k palabras distintas; espacio adicional O(k).

## 7. Problemas frecuentes

| Problema | Solución |
|----------|----------|
| `browserType.launch: Executable doesn't exist` | Falta el navegador: ejecuta `npx playwright install chromium`. |
| Pruebas con timeout o fallas intermitentes | Revisa tu conexión: el sitio se consulta en vivo. Reintenta con `npx playwright test --workers=1`. |
| `npm run test:headed` falla en Windows | Usa el comando de PowerShell de la sección 3. |
| Quiero empezar de cero | Borra `node_modules`, `test-results` y `playwright-report`, y repite la instalación. |
