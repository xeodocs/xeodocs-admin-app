---
trigger: always_on
---

- The project website domain is xeodocs.com
- The website/app name is XeoDocs
- The repository project name is xeodocs-admin-app
- Always use pnpm to handle the repository project
- Never remove the .windsurf directory

- The dev backend API is on http://dev-api.xeodocs.localhost:12020

Implementation:
- If an endpoint returns a list of elements, in the case that no elements exist yet, it will always return an empty array `[]`, never `null`.
- Whenever you need to configure the request to an API endpoint, refer to the OpenAPI description on the GitHub MCP Server.

Code:
- Always write the code, comments and documentation in English, even when the prompt is not in English.

API:
- This is a `output: 'export'` (Static Export) application; there is no Next.js server, therefore NEVER use Next.js server options. All server functionality is obtained by interacting with the API configured in `NEXT_PUBLIC_API_URL`.