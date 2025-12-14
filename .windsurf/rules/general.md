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

Code:
- Always write the code, comments and documentation in English, even when the prompt is not in English.
