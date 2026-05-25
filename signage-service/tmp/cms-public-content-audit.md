# CMS Public Content Audit

Generated: 2026-05-24T21:51:12.013Z
Database: postgresql://ep-soft-smoke-agt9wkjm-pooler.c-2.eu-central-1.aws.neon.tech/neondb
Result: WARN

## Summary

| Severity | Count |
| --- | --- |
| INFO | 14 |
| WARN | 18 |

## Blocking And Warning Findings

| Severity | Code | Context | Message |
| --- | --- | --- | --- |
| WARN | MISSING_PROBLEM_ARTICLE | flicking | flicking/tr is missing; article route may fall back to EN or 404. |
| WARN | MISSING_PROBLEM_ARTICLE | flicking | flicking/pl is missing; article route may fall back to EN or 404. |
| WARN | MISSING_PROBLEM_ARTICLE | flicking | flicking/ar is missing; article route may fall back to EN or 404. |
| WARN | MISSING_PROBLEM_ARTICLE | rain-fail | rain-fail/tr is missing; article route may fall back to EN or 404. |
| WARN | MISSING_PROBLEM_ARTICLE | rain-fail | rain-fail/pl is missing; article route may fall back to EN or 404. |
| WARN | MISSING_PROBLEM_ARTICLE | rain-fail | rain-fail/ar is missing; article route may fall back to EN or 404. |
| WARN | MISSING_PROBLEM_ARTICLE | peeling-film | peeling-film/tr is missing; article route may fall back to EN or 404. |
| WARN | MISSING_PROBLEM_ARTICLE | peeling-film | peeling-film/pl is missing; article route may fall back to EN or 404. |
| WARN | MISSING_PROBLEM_ARTICLE | peeling-film | peeling-film/ar is missing; article route may fall back to EN or 404. |
| WARN | MISSING_PROBLEM_ARTICLE | faded-film | faded-film/tr is missing; article route may fall back to EN or 404. |
| WARN | MISSING_PROBLEM_ARTICLE | faded-film | faded-film/pl is missing; article route may fall back to EN or 404. |
| WARN | MISSING_PROBLEM_ARTICLE | faded-film | faded-film/ar is missing; article route may fall back to EN or 404. |
| WARN | MISSING_PROBLEM_ARTICLE | shaky-sign | shaky-sign/tr is missing; article route may fall back to EN or 404. |
| WARN | MISSING_PROBLEM_ARTICLE | shaky-sign | shaky-sign/pl is missing; article route may fall back to EN or 404. |
| WARN | MISSING_PROBLEM_ARTICLE | shaky-sign | shaky-sign/ar is missing; article route may fall back to EN or 404. |
| WARN | MISSING_PROBLEM_ARTICLE | urgent-repair | urgent-repair/tr is missing; article route may fall back to EN or 404. |
| WARN | MISSING_PROBLEM_ARTICLE | urgent-repair | urgent-repair/pl is missing; article route may fall back to EN or 404. |
| WARN | MISSING_PROBLEM_ARTICLE | urgent-repair | urgent-repair/ar is missing; article route may fall back to EN or 404. |

## Source Of Truth Matrix

| Page key | Locale | Route | Source | CMS status | Missing blocks | Missing fields |
| --- | --- | --- | --- | --- | --- | --- |
| global | de | layout/header-footer | CMS + fallback | PUBLISHED |  |  |
| global | en | layout/header-footer | CMS + fallback | PUBLISHED |  |  |
| global | ru | layout/header-footer | CMS + fallback | PUBLISHED |  |  |
| global | tr | layout/header-footer | CMS + fallback | PUBLISHED |  |  |
| global | pl | layout/header-footer | CMS + fallback | PUBLISHED |  |  |
| global | ar | layout/header-footer | CMS + fallback | PUBLISHED |  |  |
| home | de | /de | CMS + fallback | PUBLISHED |  |  |
| home | en | /en | CMS + fallback | PUBLISHED |  |  |
| home | ru | /ru | CMS + fallback | PUBLISHED |  |  |
| home | tr | /tr | CMS + fallback | PUBLISHED |  |  |
| home | pl | /pl | CMS + fallback | PUBLISHED |  |  |
| home | ar | /ar | CMS + fallback | PUBLISHED |  |  |
| status | de | /de/status | CMS + fallback | PUBLISHED |  |  |
| status | en | /en/status | CMS + fallback | PUBLISHED |  |  |
| status | ru | /ru/status | CMS + fallback | PUBLISHED |  |  |
| status | tr | /tr/status | CMS + fallback | PUBLISHED |  |  |
| status | pl | /pl/status | CMS + fallback | PUBLISHED |  |  |
| status | ar | /ar/status | CMS + fallback | PUBLISHED |  |  |
| impressum | de | /de/impressum | CMS + fallback | PUBLISHED |  |  |
| privacy | de | /de/privacy | CMS + fallback | PUBLISHED |  |  |
| leistungen | de | /de/leistungen | CMS + fallback | PUBLISHED |  |  |
| leistungen | en | /en/leistungen | CMS + fallback | PUBLISHED |  |  |
| leistungen | ru | /ru/leistungen | CMS + fallback | PUBLISHED |  |  |
| leistungen | tr | /tr/leistungen | CMS + fallback | PUBLISHED |  |  |
| leistungen | pl | /pl/leistungen | CMS + fallback | PUBLISHED |  |  |
| leistungen | ar | /ar/leistungen | CMS + fallback | PUBLISHED |  |  |
| business | de | /de/business | CMS + fallback | PUBLISHED |  |  |
| business | en | /en/business | CMS + fallback | PUBLISHED |  |  |
| business | ru | /ru/business | CMS + fallback | PUBLISHED |  |  |
| business | tr | /tr/business | CMS + fallback | PUBLISHED |  |  |
| business | pl | /pl/business | CMS + fallback | PUBLISHED |  |  |
| business | ar | /ar/business | CMS + fallback | PUBLISHED |  |  |
| probleme-loesungen | de | /de/probleme-loesungen | CMS + fallback | PUBLISHED |  |  |
| probleme-loesungen | en | /en/probleme-loesungen | CMS + fallback | PUBLISHED |  |  |
| probleme-loesungen | ru | /ru/probleme-loesungen | CMS + fallback | PUBLISHED |  |  |
| probleme-loesungen | tr | /tr/probleme-loesungen | CMS + fallback | PUBLISHED |  |  |
| probleme-loesungen | pl | /pl/probleme-loesungen | CMS + fallback | PUBLISHED |  |  |
| probleme-loesungen | ar | /ar/probleme-loesungen | CMS + fallback | PUBLISHED |  |  |
| about | de | /de/ueber-uns | CMS + fallback | PUBLISHED |  |  |
| about | en | /en/ueber-uns | CMS + fallback | PUBLISHED |  |  |
| about | ru | /ru/ueber-uns | CMS + fallback | PUBLISHED |  |  |
| about | tr | /tr/ueber-uns | CMS + fallback | PUBLISHED |  |  |
| about | pl | /pl/ueber-uns | CMS + fallback | PUBLISHED |  |  |
| about | ar | /ar/ueber-uns | CMS + fallback | PUBLISHED |  |  |
| referenzen | de | /de/referenzen | CMS + fallback | PUBLISHED |  |  |
| referenzen | en | /en/referenzen | CMS + fallback | PUBLISHED |  |  |
| referenzen | ru | /ru/referenzen | CMS + fallback | PUBLISHED |  |  |
| referenzen | tr | /tr/referenzen | CMS + fallback | PUBLISHED |  |  |
| referenzen | pl | /pl/referenzen | CMS + fallback | PUBLISHED |  |  |
| referenzen | ar | /ar/referenzen | CMS + fallback | PUBLISHED |  |  |

## Problem Article Matrix

| CMS slug | Locale | Public slug | Status | Content | Short answer | SEO |
| --- | --- | --- | --- | --- | --- | --- |
| no-light | de | werbeanlage-leuchtet-nicht | PUBLISHED | yes | yes | yes |
| no-light | en | werbeanlage-leuchtet-nicht | PUBLISHED | yes | yes | yes |
| no-light | ru | werbeanlage-leuchtet-nicht | PUBLISHED | yes | yes | yes |
| no-light | tr | werbeanlage-leuchtet-nicht | PUBLISHED | yes | yes | yes |
| no-light | pl | werbeanlage-leuchtet-nicht | PUBLISHED | yes | yes | yes |
| no-light | ar | werbeanlage-leuchtet-nicht | PUBLISHED | yes | yes | yes |
| flicking | de | werbeanlage-flackert | PUBLISHED | yes | yes | yes |
| flicking | en | werbeanlage-flackert | PUBLISHED | yes | yes | yes |
| flicking | ru | werbeanlage-flackert | PUBLISHED | yes | yes | yes |
| flicking | tr | werbeanlage-flackert | MISSING | no | no | partial |
| flicking | pl | werbeanlage-flackert | MISSING | no | no | partial |
| flicking | ar | werbeanlage-flackert | MISSING | no | no | partial |
| uneven-light | de | led-leuchtet-ungleichmaessig | PUBLISHED | yes | yes | yes |
| uneven-light | en | led-leuchtet-ungleichmaessig | PUBLISHED | yes | yes | yes |
| uneven-light | ru | led-leuchtet-ungleichmaessig | PUBLISHED | yes | yes | yes |
| uneven-light | tr | led-leuchtet-ungleichmaessig | PUBLISHED | yes | yes | yes |
| uneven-light | pl | led-leuchtet-ungleichmaessig | PUBLISHED | yes | yes | yes |
| uneven-light | ar | led-leuchtet-ungleichmaessig | PUBLISHED | yes | yes | yes |
| letter-out | de | buchstabe-leuchtet-nicht | PUBLISHED | yes | yes | yes |
| letter-out | en | buchstabe-leuchtet-nicht | PUBLISHED | yes | yes | yes |
| letter-out | ru | buchstabe-leuchtet-nicht | PUBLISHED | yes | yes | yes |
| letter-out | tr | buchstabe-leuchtet-nicht | PUBLISHED | yes | yes | yes |
| letter-out | pl | buchstabe-leuchtet-nicht | PUBLISHED | yes | yes | yes |
| letter-out | ar | buchstabe-leuchtet-nicht | PUBLISHED | yes | yes | yes |
| rain-fail | de | werbeanlage-schaltet-nach-regen-ab | PUBLISHED | yes | yes | yes |
| rain-fail | en | werbeanlage-schaltet-nach-regen-ab | PUBLISHED | yes | yes | yes |
| rain-fail | ru | werbeanlage-schaltet-nach-regen-ab | PUBLISHED | yes | yes | yes |
| rain-fail | tr | werbeanlage-schaltet-nach-regen-ab | MISSING | no | no | partial |
| rain-fail | pl | werbeanlage-schaltet-nach-regen-ab | MISSING | no | no | partial |
| rain-fail | ar | werbeanlage-schaltet-nach-regen-ab | MISSING | no | no | partial |
| peeling-film | de | folie-loest-sich | PUBLISHED | yes | yes | yes |
| peeling-film | en | folie-loest-sich | PUBLISHED | yes | yes | yes |
| peeling-film | ru | folie-loest-sich | PUBLISHED | yes | yes | yes |
| peeling-film | tr | folie-loest-sich | MISSING | no | no | partial |
| peeling-film | pl | folie-loest-sich | MISSING | no | no | partial |
| peeling-film | ar | folie-loest-sich | MISSING | no | no | partial |
| faded-film | de | folie-ist-ausgeblichen | PUBLISHED | yes | yes | yes |
| faded-film | en | folie-ist-ausgeblichen | PUBLISHED | yes | yes | yes |
| faded-film | ru | folie-ist-ausgeblichen | PUBLISHED | yes | yes | yes |
| faded-film | tr | folie-ist-ausgeblichen | MISSING | no | no | partial |
| faded-film | pl | folie-ist-ausgeblichen | MISSING | no | no | partial |
| faded-film | ar | folie-ist-ausgeblichen | MISSING | no | no | partial |
| shaky-sign | de | werbeanlage-wackelt | PUBLISHED | yes | yes | yes |
| shaky-sign | en | werbeanlage-wackelt | PUBLISHED | yes | yes | yes |
| shaky-sign | ru | werbeanlage-wackelt | PUBLISHED | yes | yes | yes |
| shaky-sign | tr | werbeanlage-wackelt | MISSING | no | no | partial |
| shaky-sign | pl | werbeanlage-wackelt | MISSING | no | no | partial |
| shaky-sign | ar | werbeanlage-wackelt | MISSING | no | no | partial |
| urgent-repair | de | dringende-reparatur-werbeanlage | PUBLISHED | yes | yes | yes |
| urgent-repair | en | dringende-reparatur-werbeanlage | PUBLISHED | yes | yes | yes |
| urgent-repair | ru | dringende-reparatur-werbeanlage | PUBLISHED | yes | yes | yes |
| urgent-repair | tr | dringende-reparatur-werbeanlage | MISSING | no | no | partial |
| urgent-repair | pl | dringende-reparatur-werbeanlage | MISSING | no | no | partial |
| urgent-repair | ar | dringende-reparatur-werbeanlage | MISSING | no | no | partial |


## Notes

- This audit is read-only: it does not write to CMS, articles, media, or page data.
- Static fallback can keep a route rendering while CMS content is missing or stale; those cases are intentionally reported as risk, not ignored.