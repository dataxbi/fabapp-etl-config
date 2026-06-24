# Tarea 2: Implementar la UI CRUD

## Objetivo
Añadir una vista en la Fabric app para gestionar registros de `EtlConfigIngestion` desde la interfaz.

## Requisitos
- La app debe listar los registros existentes.
- Debe permitir crear uno nuevo.
- Debe permitir editar los datos de un registro.
- Debe permitir borrar un registro.
- La UI debe ser simple y funcional, sin sobre-diseñar el MVP.

## Trabajo previsto
- Crear una ruta o vista nueva, por ejemplo `/etl-config`.
- Añadir un formulario para datos de configuración.
- Conectar la vista con el cliente Rayfin para leer y escribir datos.
- Mostrar mensajes de carga y error de forma básica.

## Criterios de aceptación
- El usuario puede ver una lista de configuraciones.
- El usuario puede crear, editar y eliminar registros desde la interfaz.
- La UI se integra con el backend de Rayfin sin necesidad de escribir consultas manuales.
