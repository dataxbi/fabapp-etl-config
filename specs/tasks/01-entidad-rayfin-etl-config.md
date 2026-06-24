# Tarea 1: Definir la entidad Rayfin

## Objetivo
Crear la entidad `EtlConfigIngestData` en `rayfin/data/` y registrarla en el schema para que Rayfin genere la tabla y la API de datos.

## Requisitos
- Usar decoradores Rayfin de acuerdo con la guía del proyecto.
- Incluir todos los campos de la tabla propuesta.
- Añadir permisos explícitos para que la entidad no quede accesible sin control.
- Mantener los tipos compatibles con MSSQL.

## Trabajo previsto
- Crear un archivo de entidad en `rayfin/data/`.
- Registrar la entidad en `rayfin/data/schema.ts`.
- Asegurar que `ConfigId` sea el identificador principal.
- Definir `LoadMode` como texto limitado con valores `Full` o `Incremental`.
- Añadir `CreatedAt`, `UpdatedAt` y `UpdatedByUserId` con el tratamiento adecuado para fechas y trazabilidad de usuario.

## Criterios de aceptación
- La entidad existe y aparece en el schema de Rayfin.
- `rayfin up` puede aplicar la tabla de forma coherente.
- La entidad está protegida con permisos explícitos.
