# 05 References

## Internal Project Documents

- `docs/README.md`
- `docs/04_client_portal/request_tracking_and_customer_portal_architecture.md`
- `docs/13_references_archive/old_request_tracking_implementation_blueprint.md`
- `docs/13_references_archive/historical_phase_2_crm_and_external_channels.md`
- `docs/08_ai_assistant/historical_phase_2b_ai_chat_system.md`
- `docs/13_references_archive/historical_phase_2c_cms_crm_split.md`
- `docs/06_crm/bitrix24_crm_integration_plan.md`
- `docs/07_content_ai_seo/geo_optimization_strategy.md`
- `docs/07_content_ai_seo/troubleshooting_content_plan.md`
- `docs/07_content_ai_seo/troubleshooting_page_template.md`
- `docs/10_security_privacy/security_guardrails.md`
- `docs/10_security_privacy/security_checklist.md`

## Current Code References

- `signage-service/prisma/schema.prisma`
- `signage-service/src/lib/admin-auth.ts`
- `signage-service/src/lib/rate-limit.ts`
- `signage-service/src/lib/ai/system-prompt.ts`
- `signage-service/src/lib/ai/chat-engine.ts`
- `signage-service/src/app/api/admin/*`
- `signage-service/src/app/api/cms/*`
- `signage-service/src/app/[locale]/ring-manager-crm/*`
- `signage-service/src/app/[locale]/ring-master-config/*`
- `signage-service/src/app/[locale]/support/page.tsx`
- `signage-service/src/components/sections/SymptomCluster.tsx`

## CMS And Admin Product References

- Payload drafts and versions: https://payloadcms.com/docs/versions/drafts
- Payload localization: https://payloadcms.com/docs/configuration/localization
- Payload preview: https://payloadcms.com/docs/admin/preview
- Payload blocks: https://payloadcms.com/docs/fields/blocks
- Strapi draft/publish: https://docs.strapi.io/cms/features/draft-and-publish
- Strapi internationalization: https://docs.strapi.io/cms/features/internationalization
- Strapi preview: https://docs.strapi.io/cms/features/preview
- Directus revisions: https://docs.directus.io/reference/system/revisions
- Directus files: https://docs.directus.io/reference/files
- Contentful localization: https://www.contentful.com/help/localization/
- Contentful scheduled publishing: https://www.contentful.com/help/scheduled-publishing/
- TinaCMS editorial workflow: https://tina.io/docs/drafts/editorial-workflow
- React Admin access control: https://marmelab.com/react-admin/CanAccess.html
- Refine access control provider: https://refine.dev/core/docs/authorization/access-control-provider/
- Refine audit log provider: https://refine.dev/core/docs/audit-logs/audit-log-provider/

## SEO/GEO References

- Google localized versions: https://developers.google.com/search/docs/specialty/international/localized-versions
- Google canonical URLs: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google structured data policies: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Google Article structured data: https://developers.google.com/search/docs/appearance/structured-data/article
- Google Organization structured data: https://developers.google.com/search/docs/appearance/structured-data/organization

## Security References

- OWASP Authorization Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- OWASP Session Management Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- OWASP CSRF Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- OWASP Logging Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
- OWASP File Upload Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- OWASP HTTP Security Response Headers Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
- OWASP API Security Top 10 API1:2023 BOLA: https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/
- OWASP WSTG admin interface testing: https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/05-Enumerate_Infrastructure_and_Application_Admin_Interfaces
- NIST SP 800-63B: https://pages.nist.gov/800-63-4/sp800-63b.html
- NIST SP 800-53 Rev.5: https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final
- GDPR Article 5: https://eur-lex.europa.eu/eli/reg/2016/679/2016-05-04
