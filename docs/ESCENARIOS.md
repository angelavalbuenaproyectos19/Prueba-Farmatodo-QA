# Test scenarios - https://wordcounter.net/

**Precondition (all):** site open with default configuration and an empty text box.
**Steps (all):** type the text in the editor, then read the indicated panel.
Expected values are fixed and independent from the site. Source of truth: `test-data/scenarios.js`.

## Word count (Words counter)
| ID | Scenario | Input | Expected |
|----|----------|-------|----------|
| WC-01 | Challenge sample | sample text from the brief | 14 |
| WC-02 | Empty text | (nothing) | 0 |
| WC-03 | Single word | `farmatodo` | 1 |
| WC-04 | Multiple spaces | `hola   mundo   hola` | 3 |
| WC-05 | Line breaks separate words | `uno\ndos\ntres` | 3 |

## Character count (Characters counter; spaces counted, line breaks not)
| ID | Scenario | Input | Expected |
|----|----------|-------|----------|
| CC-01 | Challenge sample | sample text from the brief | 99 |
| CC-02 | Empty text | (nothing) | 0 |
| CC-03 | Spaces are counted | `a b` | 3 |
| CC-04 | Line breaks not counted | `uno\ndos` | 6 |
| CC-05 | Multiple spaces counted | `hola   mundo   hola` | 19 |

## Keyword Density (top 3 words with repetitions)
| ID | Scenario | Input | Expected top-3 counts |
|----|----------|-------|-----------------------|
| KD-01 | Challenge sample | sample text from the brief | 6, 3, 2 (farmatodo 6, cuida 3) |
| KD-02 | No repetition | `uno dos tres cuatro` | 1, 1, 1 |
| KD-03 | Case insensitive | `Perro perro PERRO gato gato mar` | 3, 2, 1 |
| KD-04 | Fewer than 3 distinct words | `hola mundo hola` | 2, 1 |
| KD-05 | **Known defect BUG-02** | `sol sol sol luna luna mar` | 3, 2, 1 (site returns 3, 1) |

Notes: tie order is not asserted (the site does not order ties alphabetically, see `REPORTE_FALLAS.md` OPP-01); each listed word must carry its true count. KD-05 fails on purpose.
