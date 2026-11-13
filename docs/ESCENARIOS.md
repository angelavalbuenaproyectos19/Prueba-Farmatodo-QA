# Test scenarios - https://wordcounter.net/

**Precondition (all):** site open with default configuration and an empty text box.
**Steps (all):** type the text in the editor, then read the indicated panel.
Expected values are fixed and independent from the site. Source of truth: `test-data/scenarios.js` (IDs match) and `tests/e2e/wordcounter.spec.js`.

Total: 40 scenarios (38 expected to pass, 2 known-defect scenarios that fail on purpose: KD-05 / BUG-02 and KD-11 / BUG-03).

## Word count - WC-01..WC-12
Sample from the brief = 14; empty = 0; single word = 1; multiple spaces = 3 words; line breaks separate words; punctuation, hyphenated words, numbers, leading/trailing spaces, accented letters, tabs; long text of 500 words.

## Character count - CC-01..CC-11
Spaces and tabs are counted, line breaks are not. Sample = 99; empty = 0; `a b` = 3; `uno\ndos` = 6; punctuation; accents (1 char each); leading/trailing spaces; trailing line break; tab; long text of 2499 characters (the site shows `2,499`).

## Keyword Density top 3 - KD-01..KD-11
Counts in order are asserted (tie order is not, see OPP-01) and every listed word must carry its true count. Covers sample, no repetition, case insensitivity, fewer than 3 distinct words, punctuation, hyphens, accents, more than 3 distinct words, long text, and the two known defects (`luna`, numbers).

## Keyword Density percentages - KP-01..KP-03
Sample 43% / 21%; `hola mundo hola` 67% / 33%; single repeated word 100%.

## Live updates - LU-01..LU-03
Clearing resets counters and keywords; typing key by key updates counters; appending text updates counters and keywords.
