# Failure report - https://wordcounter.net/

Environment: Chromium (Playwright), desktop, default site configuration, 2026-11-12.

## BUG-02 - "luna" is excluded from Keyword Density but counted as a word
- **Severity:** Medium
- **Steps:** open the site, type `sol sol sol luna luna mar`.
- **Expected:** Keyword Density lists `sol: 3`, `luna: 2`, `mar: 1` (6 words, as shown by the Words counter).
- **Actual:** only `sol 3 (75%)` and `mar 1 (25%)` are listed; percentages are computed over 4 words while Words shows 6. Typing only `luna luna` shows "Start typing your document to get a list of most used keywords". `perro perro gato` works correctly, so the omission is specific to some words (likely an undocumented ignore/stop-word list).
- **Automated evidence:** `top 3 keyword density - word "luna" (known defect BUG-02)` fails by design.

## BUG-03 - Numbers are counted as words but never appear in Keyword Density
- **Severity:** Medium
- **Steps:** type `123 456 123`.
- **Expected:** Words = 3 and Keyword Density lists `123: 2`, `456: 1`.
- **Actual:** Words = 3, but the panel shows "Start typing your document to get a list of most used keywords". Same class of inconsistency as BUG-02 (counters and keyword list disagree).
- **Automated evidence:** `KD-11` fails by design.

## OPP-01 - Ties in Keyword Density are not ordered deterministically
- **Steps:** type the challenge sample (`farmatodo` x6, `cuida` x3, `tu` x2, `salud` x2, `toda` x1).
- **Actual:** `tu` is listed before `salud` (same count, not alphabetical; appears to follow first appearance).
- **Impact:** the "top 3" is ambiguous when the 3rd place is tied. Suggest a documented tie-break (alphabetical).

## OPP-02 - Keyword Density updates noticeably later than the counters
- **Steps:** type any text and read the panel immediately.
- **Actual:** Words/Characters update instantly; the Keyword Density list was still empty after 1.5 s and only filled in within 5 s in my runs.
- **Also observed:** the list first renders its rows with an empty count badge (about 1.4 s), then fills them in; the intermediate state can be read as real data.
- **Impact:** users and automated checks can read stale data. Suggest a loading state or a faster refresh.

## Assumptions
- Character count includes spaces and excludes line breaks (matches the challenge example: 99 characters).
- "Top 3 words" is validated by count; the order among tied words is not asserted because the brief does not define it for the site.
- BUG numbering starts at 02 because BUG-01 was discarded after verification (not reproducible).
