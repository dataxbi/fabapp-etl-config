# Tarea 3: Crear script SQL de datos iniciales

## Objetivo
Preparar un script SQL independiente que inserte valores iniciales de ejemplo en `EtlConfigIngestion`.

## Requisitos
- El script debe ser standalone y fácil de ejecutar.
- Debe asumir al menos dos conexiones de origen distintas.
- Debe incluir ejemplos de tablas a copiar de cada origen.
- Debe respetar los campos del modelo y los valores válidos para `LoadMode`.

## Trabajo previsto
- Crear un archivo SQL en la raíz del proyecto o en `specs/`.
- Incluir inserts con varios registros de ejemplo.
- Usar datos realistas para dos orígenes de datos y varias tablas.
- Documentar cómo ejecutar el script.

## Criterios de aceptación
- El script carga registros válidos en la tabla.
- Los datos iniciales cubren al menos dos conexiones de origen.
- El script es reutilizable como base para pruebas o demos.
