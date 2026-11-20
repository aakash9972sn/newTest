# Supplied previous-year papers

Imported from cuet-pg-life-sciences-clean-275.csv on 20 November 2026. All 275 questions, four choices per question, section labels, source numbering and source answer strings are retained. Option number prefixes are removed for display; answer indices use those source prefixes.

| Paper | Questions | Minutes | Correct / wrong | Review-only |
| --- | ---: | ---: | --- | --- |
| CUET PG Life Sciences 2025, 27 March Shift 3 | 75 | 90 | +4 / -1 | Q38 |
| CUET PG Zoology 2022, 9 September Shift 1 | 100 | 120 | +4 / -1 | Q78 |
| CUCET Life Sciences 2021, 24 September Shift 2 | 100 | 120 | +4 / -1 | Q62 |

The supplied CSV flags the three listed keys as disputed or ambiguous. Their official final status has not been independently confirmed. They remain answerable for review but are excluded from marks, maximum marks, accuracy, and topic performance. Maximum practice scores are consequently 296, 396 and 396. Do not silently replace their keys or award penalties.

The CSV provides answer keys rather than worked explanations. The answer review labels this clearly. Original question images were not supplied; textual image descriptions in the source are preserved. AI explanations are optional and are warned about disputed keys.

Historical exam references:
- https://exams.nta.ac.in/CUET-PG/images/ib-of-cuet-pg-2025.pdf
- https://cuj.ac.in/file/admission/CUET-22/CUET%20PG%20Information%20Bulletin%202022.pdf
- https://www.nta.ac.in/Download/Notice/Notice_20210816112158.pdf
- NTA CUCET 2021 information bulletin, section 9.4 (+4/-1), mirrored at https://learningskillsindia.com/wp-content/uploads/2021/08/CUCET-2021-PROSPECTUS-INFORMATION-BULLETIN.pdf

## Adding papers
Append a question bank and an exam/subject/test entry in pyp-data.js. Use stable unique ids, retain source metadata and set unscored only when there is a documented reason. The registry drives search, exam filters, cards, runner and result review. New exam entries set aiSupported:false until their hosted generation endpoint supports them.

## Runner behavior
The active timer uses a wall-clock deadline, including background tabs and reloads. Save & exit pauses it. Navigating to another screen also preserves a paused attempt. Expiry closes any submit/exit modal and submits once. Old saved attempts are validated before use; valid answers are retained.

Validation: node --test tests/*.test.mjs. Source-fidelity verification compared all 275 imported question texts, option arrays and source answers with the CSV without mismatch.
