# Especificación general: CRUD para EtlConfigIngestion

## Objetivo
Extender la Fabric app para gestionar una tabla de configuración de ETL llamada `EtlConfigIngestion` desde una interfaz CRUD dentro de la aplicación.

## Alcance del proyecto
- Crear una entidad Rayfin que represente la tabla de configuración.
- Exponer dicha entidad a través del backend de Rayfin/Data API de la app.
- Añadir una vista en la app para crear, leer, actualizar y eliminar registros.
- Preparar un script SQL con datos iniciales de ejemplo para poblar la tabla.
- Adaptar el diseño visual de la app al estilo de dataXbi usando el logo y el icono disponibles en `resources/`.
- Validar el funcionamiento del build y de la integración.

## Estructura esperada de la tabla
```sql
CREATE TABLE EtlConfigIngestions (
    ConfigId UNIQUEIDENTIFIER NOT NULL
        PRIMARY KEY DEFAULT NEWID(),

    IsEnabled BIT NOT NULL
        DEFAULT 1,

    SourceConnectionName NVARCHAR(100) NOT NULL,
    SourceSchemaName NVARCHAR(128) NOT NULL,
    SourceTableName NVARCHAR(128) NOT NULL,

    LoadMode NVARCHAR(20) NOT NULL,
    IncrementalColumnName NVARCHAR(128) NULL,

    TargetWorkspaceName NVARCHAR(100) NOT NULL,
    TargetLakehouseName NVARCHAR(100) NOT NULL,
    TargetSchemaName NVARCHAR(128) NULL,
    TargetTableName NVARCHAR(128) NOT NULL,

    CreatedAt DATETIME2 NOT NULL
        DEFAULT SYSDATETIME(),

    UpdatedAt DATETIME2 NULL,
    UpdatedByUserId NVARCHAR(100) NULL,

    CONSTRAINT CK_EtlConfigIngestions_LoadMode
        CHECK (LoadMode IN ('Full', 'Incremental'))
);
```

## Arquitectura funcional
- Se usará el backend de Rayfin/Data API de la app, no un warehouse o SQL endpoint externo.
- La interfaz será sencilla, funcional y orientada a administración.
- El flujo de autenticación actual se mantendrá.
- Se añadirá una columna `UpdatedByUserId` para registrar el identificador del usuario que actualiza el registro, usando el identificador de usuario autenticado gestionado por Rayfin (sin depender de una tabla propia adicional).

## Arquitectura visual
- Fondo blanco (`#ffffff`) en todo el área de contenido, basado en los colores de https://www.dataxbi.com/.
- Color primario `#0066cc`, acento navy `#1e3a5f` para el header, texto `#333333`.
- Los datos se muestran en una tabla construida con **TanStack Table** (`@tanstack/react-table`).
- La tabla incluye un botón "Añadir configuración" en la barra superior.
- La edición de registros es **inline por fila**: al hacer clic en el icono de editar, las celdas de la fila se convierten en inputs; se confirma con "Guardar" o se descarta con "Cancelar".
- Ver la especificación completa en [Tarea 5: Arquitectura visual](./tasks/05-arquitectura-visual.md).

## Reglas de commit
- Los cambios de especificación deberán quedar firmados con autor `nelson-dataxbi` y coautor `Copilot`.
- Los commits de código deberán usar autor `Copilot` y no incluir coautor.
- Añadir el modelo LLM que generó el commit en el mensaje de commit se hará mediante un trailer personalizado en el formato `Model-Used: <nombre-del-modelo>`. Si el entorno no permite identificar el modelo con certeza, se omitirá ese trailer y se registrará el modelo solo cuando sea verificable.

## Orden de implementación
1. Definir la entidad Rayfin y registrarla en el schema.
2. Añadir permisos explícitos y desplegar el cambio con `rayfin up`.
3. Implementar la lógica de frontend para consumir la entidad.
4. Añadir la vista CRUD y el formulario de edición.
5. Adaptar el diseño visual de auth y home al estilo de dataXbi antes de completar la experiencia CRUD.
6. Preparar el script SQL de datos iniciales.
7. Validar build y ajustar errores de integración.

## Enlaces a las tareas
- [Tarea 1: Entidad Rayfin](./tasks/01-entidad-rayfin-etl-config.md)
- [Tarea 2: UI CRUD](./tasks/02-ui-crud-etl-config.md)
- [Tarea 3: Script SQL de datos iniciales](./tasks/03-script-sql-datos-iniciales.md)
- [Tarea 4: Validación y despliegue](./tasks/04-validacion-y-despliegue.md)
- [Tarea 5: Arquitectura visual](./tasks/05-arquitectura-visual.md)
- [Script SQL de seed](./tasks/etl-config-seed-data.sql)

## Criterios de aceptación
- La app permite listar registros de la tabla.
- La app permite crear, editar y borrar registros desde la UI.
- Los datos se muestran en una tabla con TanStack Table, con edición inline por fila.
- El diseño usa los colores de dataxbi.com con fondo blanco.
- Los datos se almacenan en la entidad Rayfin y quedan accesibles desde la API.
- El script SQL inserta datos iniciales válidos para el modelo.
- El proyecto compila correctamente.
