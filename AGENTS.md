# AGENTS.md

This project ships Rayfin agent context.
Load `.agents/skills/rayfin/SKILL.md` and the `rayfin` MCP server in `.mcp.json` before writing Rayfin code.

Rayfin docs are version-locked to the packages installed in this project.
Prefer the MCP tools `search_docs`, `get_doc`, `list_docs`, and `discover_packages` for examples, API details, and troubleshooting.
If MCP is unavailable, run `rayfin docs ...` from the project root so the CLI reads this project's `node_modules`.
If `rayfin` is not on `PATH`, use `npx -y @microsoft/rayfin-cli docs ...` from the project root.

Use `discover_packages` or `rayfin docs discover <topic>` when installed docs do not cover the task.

## Especificaciones del proyecto

El trabajo relacionado con la funcionalidad de CRUD para `EtlConfigIngestData` debe consultarse primero en la carpeta `specs/`.

- Leer `specs/00-especificacion-general.md` antes de implementar cambios de alcance amplio.
- La especificación general contiene los enlaces a las tareas específicas ubicadas en `specs/tasks/`.
- Si cambian requisitos o alcance, actualizar también la especificación afectada antes de continuar.
