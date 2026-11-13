# Escenarios de prueba - https://wordcounter.net/

**Precondición (todos):** sitio abierto con la configuración por defecto y el cuadro de texto vacío, en un navegador limpio.
**Pasos (todos):** escribir el texto, aplicar las opciones indicadas (si las hay) y leer el panel correspondiente.
Los valores esperados son fijos e independientes del sitio. Fuente de verdad: `test-data/` y `tests/e2e/`. Total: **78 escenarios**.

## 1. Configuración por defecto - `tests/e2e/wordcounter.spec.js` (40)

### Conteo de palabras - WC-01..WC-12

Texto de ejemplo del enunciado = 14; vacío = 0; una palabra = 1; varios espacios, saltos de línea, puntuación, palabra con guion, números, espacios al inicio/fin, tildes y eñe, tabuladores; texto largo de 500 palabras.

### Conteo de caracteres - CC-01..CC-11

Se cuentan espacios y tabuladores, no los saltos de línea. Ejemplo del enunciado = 99; vacío = 0; `a b` = 3; `uno\ndos` = 6; puntuación; tildes (1 carácter cada una); espacios al inicio/fin; salto de línea final; tabulador; texto largo de 2499 caracteres (el sitio muestra `2,499`).

### Keyword Density top 3 - KD-01..KD-11

Se valida el orden de los conteos (no el de los empates, ver OPP-01) y que cada palabra listada tenga su conteo real. Cubre el ejemplo del enunciado, sin repetición, mayúsculas/minúsculas, menos de 3 palabras distintas, la exclusión por defecto de `luna` (OPP-03), puntuación, palabras con guion, tildes, más de 3 palabras distintas, texto largo y números no listados.

### Porcentajes de Keyword Density - KP-01..KP-03

Ejemplo del enunciado 43 % y 21 %; `hola mundo hola` 67 % y 33 %; una sola palabra repetida 100 %.

### Actualizaciones en vivo - LU-01..LU-03

Borrar el texto reinicia contadores y keywords; escribir tecla por tecla actualiza los contadores; agregar texto actualiza contadores y keywords.

## 2. Menú de opciones - `tests/e2e/options.spec.js` (20)

Cada escenario aplica las opciones desde la interfaz real (menú Options).

| ID                  | Opción o combinación                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| OP-01               | Incluir palabras comunes: `luna` aparece                                                              |
| OP-02, OP-03        | Cantidad = 2 y cantidad = 1                                                                           |
| OP-04, OP-05        | Palabras consecutivas = 2 y = 3 (frases)                                                              |
| OP-06               | Palabras comunes + cantidad 2                                                                         |
| OP-07               | Palabras comunes + consecutivas 2                                                                     |
| OP-08               | Consecutivas 2 + cantidad 1                                                                           |
| OP-09               | Palabras comunes + consecutivas 2 + cantidad 2                                                        |
| OP-10, OP-11        | Cantidad inválida `0` y `-1` (se ignora, ver OPP-04)                                                  |
| OP-12, OP-13, OP-14 | Métricas extra de Details por separado: caracteres sin espacios = 36, palabras únicas = 6, líneas = 2 |
| OP-15               | Las tres métricas extra juntas sin alterar los contadores base                                        |
| OP-16               | Desactivar el panel Keyword Density lo oculta                                                         |
| OP-17               | Una opción se mantiene aplicada tras recargar la página                                               |
| OP-18               | Ocultar el contador Characters mantiene visible Words                                                 |
| OP-19               | Consecutivas = 2 con tildes                                                                           |
| OP-20               | Cantidad = 2 con eñe                                                                                  |

## 3. Textos en español - `tests/e2e/espanol.spec.js` (18)

| ID                 | Escenario                                                                     |
| ------------------ | ----------------------------------------------------------------------------- |
| ES-01              | Frase con `¿?`, `¡!` y tildes: 21 palabras, 108 caracteres                    |
| ES-02              | Dos párrafos separados por una línea en blanco: 8 palabras, 51 caracteres     |
| ES-03              | Eñe y tildes en una oración: 12 palabras, 64 caracteres                       |
| ES-04              | Misma palabra en mayúsculas y minúsculas: 4 palabras, 35 caracteres           |
| ES-05              | Palabras con tilde final: 3 palabras, 21 caracteres                           |
| ES-06              | Signos de apertura no crean palabras extra: 6 palabras, 52 caracteres         |
| ES-KD-01           | Frase larga: `tu` 4, `salud` 3 y una palabra con 2                            |
| ES-KD-02..04       | Tildes, mayúsculas y eñe se agrupan correctamente                             |
| ES-KD-05, ES-KD-06 | **Defecto BUG-01** (`¡Farmatodo`, `¿Farmatodo`, `«hola»`): fallan a propósito |

Las pruebas `ES-01..ES-06` se ejecutan para palabras y para caracteres (12 pruebas) más 6 de Keyword Density.
