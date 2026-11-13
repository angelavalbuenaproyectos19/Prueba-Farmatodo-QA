# Reporte de fallas y oportunidades de mejora - https://wordcounter.net/

Entorno: Chromium (Playwright), escritorio, configuración por defecto del sitio, 12/11/2026.
Todos los hallazgos fueron reproducidos manualmente con Playwright antes de reportarse.

## Defectos

### BUG-01 - Los signos de apertura `¿ ¡ «` quedan pegados a la palabra y parten el conteo en Keyword Density
- **Severidad:** Media (afecta a todo texto en español)
- **Pasos:** escribir `farmatodo cuida. ¡Farmatodo cuida! ¿Farmatodo cuida?`
- **Esperado:** `farmatodo: 3` y `cuida: 3` (así lo hace el sitio con `farmatodo cuida. Farmatodo cuida! Farmatodo cuida?`).
- **Actual:** `cuida: 3`, `farmatodo: 1`, `¡farmatodo: 1`, `¿farmatodo: 1`. La puntuación final (`. ! ?`) sí se descarta, pero la de apertura no.
- **También ocurre con** `hola «hola» "hola" (hola)`: `hola: 3` y `«hola»: 1`.
- **Evidencia automatizada:** `ES-KD-05` y `ES-KD-06` (fallan a propósito).

## Oportunidades de mejora

### OPP-01 - Los empates en Keyword Density no tienen un orden definido
- **Pasos:** escribir el texto de ejemplo del enunciado (`farmatodo` x6, `cuida` x3, `tu` x2, `salud` x2, `toda` x1).
- **Actual:** `tu` aparece antes que `salud` (mismo conteo, no alfabético; parece seguir el orden de aparición).
- **Impacto:** el "top 3" es ambiguo cuando el tercer lugar está empatado. Se sugiere un desempate documentado (alfabético).

### OPP-02 - Keyword Density se actualiza bastante después que los contadores
- **Pasos:** escribir cualquier texto y leer el panel de inmediato.
- **Actual:** Words y Characters se actualizan al instante. La lista de keywords primero aparece con las filas **vacías** (sin número) durante ~1,4 s y recién después se completa; con 1,5 s de espera aún podía estar vacía.
- **Impacto:** el usuario o una prueba automatizada pueden leer un estado intermedio. Se sugiere un indicador de carga o una actualización más rápida.

### OPP-03 - Keyword Density excluye palabras en silencio y sin avisar
- **Pasos:** escribir `sol sol sol luna luna mar` y luego `123 123 456`.
- **Actual por defecto:** `luna` no aparece en la lista (los porcentajes se calculan sobre 4 palabras y no sobre las 6 que muestra Words). Los números no aparecen nunca, ni siquiera activando la opción **Include common words in word density count** (con ella `luna` sí aparece: `sol 3, luna 2, mar 1`).
- **Impacto:** el panel no indica que está excluyendo palabras y que los totales difieren de los contadores. Que `luna` esté en una lista de "palabras comunes" es inesperado. Se sugiere mostrar la regla en la interfaz.
- **Nota de corrección:** en una versión anterior de este reporte estos casos se clasificaron como defectos de conteo (BUG-02 y BUG-03). Tras probar la opción de palabras comunes se comprobó que es un comportamiento de configuración y se reclasificó.
- **Evidencia automatizada:** `KD-05`, `KD-11`, `OP-01`.

### OPP-04 - Los campos numéricos de Keyword Density aceptan valores inválidos sin avisar
- **Pasos:** Options > Keyword Density: poner **Amount** en `0` o `-1`, o **Consecutive** en `0`.
- **Actual:** el campo conserva el valor inválido, no muestra error y el sitio lo ignora en silencio (la lista sigue completa).
- **Impacto:** el usuario cree haber configurado algo que no se aplicó. Se sugiere validar el rango y mostrar un mensaje.
- **Evidencia automatizada:** `OP-10`, `OP-11`.

### OPP-05 - Las palabras comunes del español no se excluyen
- **Pasos:** escribir `el la de que y en un una el la de`.
- **Actual:** `el`, `la`, `de`, `que`, `en`, `un` y `una` aparecen como keywords. En un texto en español el top 3 puede quedar ocupado por artículos y preposiciones (por ejemplo `la` y `de` en `ES-KD-01`).
- **Impacto:** el análisis de densidad es menos útil para textos en español. Se sugiere una lista de palabras comunes por idioma.

## Supuestos
- Los caracteres incluyen espacios y tabuladores y excluyen los saltos de línea (coincide con el ejemplo del enunciado: 99 caracteres).
- El "top 3" se valida por conteos en orden; el orden entre palabras empatadas no se valida porque el enunciado no lo define para el sitio.
- El sitio formatea los miles (`2,499`); las pruebas lo normalizan antes de comparar.
