# Tarea 2: Implementar la UI CRUD

## Objetivo
Añadir una vista en la Fabric app para gestionar registros de `EtlConfigIngestion` desde la interfaz.

## Requisitos
- La app debe listar los registros existentes en una **tabla** construida con **TanStack Table** (`@tanstack/react-table`).
- La tabla debe tener un botón **"Añadir configuración"** en la barra superior.
- La edición de registros debe ser **inline por fila**: al hacer clic en el icono de editar, las celdas de esa fila se convierten en `<input>` / `<select>`; se confirma con "Guardar" o se descarta con "Cancelar". Solo una fila puede estar en modo edición a la vez.
- Debe permitir borrar un registro mostrando un **modal de confirmación** (nunca `window.confirm`).
- Debe permitir **selección múltiple de filas** mediante checkboxes (primera columna). El encabezado tiene un checkbox "seleccionar todo" con estado indeterminado cuando hay selección parcial.
- Cuando hay filas seleccionadas, aparece una **barra de acciones bulk** encima de la tabla con:
  - Contador de filas seleccionadas.
  - Botón **"Eliminar seleccionadas"** (con confirmación en modal).
  - Botón **"Desactivar seleccionadas"** (con confirmación en modal).
- Los checkboxes se deshabilitan mientras una fila está en modo edición.
- El diseño visual sigue la guía de [Tarea 5: Arquitectura visual](./05-arquitectura-visual.md): fondo blanco, colores dataxbi.com, tipografía sistema.

## Trabajo previsto
- Instalar `@tanstack/react-table`.
- Refactorizar `src/pages/HomePage.tsx` para usar `useReactTable` con las columnas de `EtlConfigIngestion`.
- Implementar el estado `editingRowId` + `editValues` para la edición inline.
- Añadir la función de creación: fila vacía al inicio de la tabla en modo edición o formulario compacto.
- Conectar guardar/cancelar/borrar con `client.data.EtlConfigIngestion`.
- Aplicar estilos según la guía visual (tarea 05).
- Mostrar estado de carga (skeleton o spinner) y error (banner visible).

## Criterios de aceptación
- El usuario puede ver una lista de configuraciones en una tabla.
- El usuario puede crear, editar y eliminar registros desde la interfaz con edición inline.
- Eliminar siempre muestra un modal de confirmación antes de proceder.
- El usuario puede seleccionar múltiples filas y ejecutar acciones bulk (eliminar o desactivar) con confirmación.
- La UI se integra con el backend de Rayfin sin necesidad de escribir consultas manuales.
- El diseño es coherente con la guía visual de dataxbi.com.

