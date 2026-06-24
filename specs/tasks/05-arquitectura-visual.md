# Tarea 5: Arquitectura visual

## Objetivo

Definir la guía visual de la Fabric app para que sea coherente con la identidad de marca de dataXbi,
usando los colores y tipografía del sitio https://www.dataxbi.com/ como referencia.

---

## Paleta de colores

Extraída de `https://www.dataxbi.com/assets/css/main.css`.

| Token            | Valor       | Uso principal                              |
|------------------|-------------|--------------------------------------------|
| `primary`        | `#0066cc`   | Botones primarios, enlaces, énfasis activo |
| `primary-dark`   | `#004d99`   | Hover de botones primarios                 |
| `navy`           | `#1e3a5f`   | Header de la app, acento corporativo       |
| `text`           | `#333333`   | Texto base del contenido                   |
| `text-light`     | `#666666`   | Metadatos, etiquetas secundarias           |
| `bg`             | `#ffffff`   | Fondo general de la app (blanco)           |
| `bg-light`       | `#f8f9fa`   | Filas alternas, fondo de cabeceras         |
| `border`         | `#e0e0e0`   | Bordes de tabla, separadores               |
| `danger`         | `#dc3545`   | Botón eliminar, alertas de error           |
| `danger-dark`    | `#b02a37`   | Hover de botón eliminar                    |

> El fondo de la aplicación es siempre **blanco** (`#ffffff`). No se utilizan fondos oscuros ni gradientes
> en el área de contenido principal.

---

## Tipografía

- **Familia:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Tamaño base:** 16 px
- **Tamaño pequeño (metadatos, etiquetas):** 14 px
- **Peso normal:** 400
- **Peso semibold (labels, cabeceras de columna):** 600
- **Peso bold (títulos de sección):** 700
- **Interlineado:** 1.6

---

## Layout general de la página principal

```
┌─────────────────────────────────────────────────────────┐
│  [Logo dataXbi]              [nombre usuario]  [Sign out]│  ← Header #1e3a5f
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ETL Ingestion Config                [+ Añadir config]  │  ← Barra de título
│  ─────────────────────────────────────────────────────  │
│  [Tabla de configuraciones con edición inline]          │
│                                                         │
│  [Mensaje de error si lo hay]                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

- **Header:** fondo `#1e3a5f`, texto blanco, altura fija ~56 px.
  Muestra el logo de dataXbi a la izquierda y el email del usuario + botón "Sign out" a la derecha.
- **Área de contenido:** fondo `#ffffff`, padding de `1.5rem` a cada lado.
- **Ancho máximo:** 1200 px, centrado con `margin: 0 auto`.

---

## Componente de tabla

### Librería

**TanStack Table v8** (`@tanstack/react-table`) como motor de la tabla.
Es una librería _headless_: gestiona el estado y la lógica (ordenación, paginación, edición)
mientras el desarrollador controla completamente el markup y los estilos.
Esto permite adaptar la tabla exactamente a la paleta de dataXbi.

Instalar con:
```bash
npm install @tanstack/react-table
```

### Estructura visual de la tabla

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ETL Ingestion Config                              [+ Añadir configuración]   │
├────────┬──────────────┬────────────┬───────────────┬────────────┬────────────┤
│Enabled │ Connection   │ Source     │ Target        │ Load Mode  │ Acciones   │  ← cabecera bg #f8f9fa
├────────┼──────────────┼────────────┼───────────────┼────────────┼────────────┤
│  ✔     │ SalesSqlProd │ dbo.Sales  │ LakehouseSales│ Incremental│ ✏️  🗑️    │
├────────┼──────────────┼────────────┼───────────────┼────────────┼────────────┤
│  ✔     │ FinanceSqlDev│ finance.In…│ LakehouseFin  │ Full       │ ✏️  🗑️    │
└────────┴──────────────┴────────────┴───────────────┴────────────┴────────────┘
```

#### Cabecera de tabla
- Fondo: `#f8f9fa`, borde inferior: `1px solid #e0e0e0`.
- Texto: `#333333`, font-weight 600, font-size 14 px.
- Cada columna tiene padding `0.75rem 1rem`.

#### Filas
- Fondo base: `#ffffff`.
- Hover: `#f8f9fa` (transición suave 0.15 s).
- Borde inferior entre filas: `1px solid #e0e0e0`.
- Font-size: 14 px, color `#333333`.

#### Columna `IsEnabled`
- Modo lectura: checkbox deshabilitado o icono ✔ / ✗.
- Modo edición: `<input type="checkbox">` estilizado.

#### Columna `LoadMode`
- Modo lectura: texto plano ("Full" o "Incremental").
- Modo edición: `<select>` con las dos opciones.

#### Columna de acciones (modo lectura)
- Botón **Editar**: icono de lápiz, color `#0066cc`, sin fondo hasta hover.
  Al hacer clic activa el modo edición inline de esa fila.
- Botón **Eliminar**: icono de papelera, color `#dc3545`, sin fondo hasta hover.
  Solicita confirmación antes de borrar.

---

## Edición inline

### Flujo
1. El usuario hace clic en el icono ✏️ de una fila → la fila entra en modo edición.
2. Cada celda editable se convierte en un `<input>` o `<select>` con los valores actuales.
3. La columna de acciones muestra dos botones: **Guardar** y **Cancelar**.
4. Al hacer clic en **Guardar** se llama a `client.data.EtlConfigIngestion.update(...)`.
5. Al hacer clic en **Cancelar** la fila vuelve a modo lectura sin persistir cambios.
6. Solo puede haber **una fila en modo edición** a la vez.

### Implementación con TanStack Table
```typescript
// Estado local para controlar qué fila se está editando
const [editingRowId, setEditingRowId] = useState<string | null>(null);
const [editValues, setEditValues] = useState<Partial<EtlConfigRecord>>({});

// Al activar edición
const startEdit = (row: EtlConfigRecord) => {
  setEditingRowId(row.id);
  setEditValues({ ...row });
};

// Celda editable de ejemplo
const renderCell = (field: keyof EtlConfigRecord, row: EtlConfigRecord) => {
  if (editingRowId === row.id) {
    return (
      <input
        value={String(editValues[field] ?? '')}
        onChange={(e) => setEditValues(prev => ({ ...prev, [field]: e.target.value }))}
      />
    );
  }
  return <span>{String(row[field] ?? '')}</span>;
};
```

---

## Botón "Añadir configuración"

- Posición: esquina superior derecha de la barra de título.
- Estilo: `btn-primary` → fondo `#0066cc`, texto blanco, `border-radius: 4px`, padding `0.6rem 1.2rem`, font-weight 600.
- Hover: fondo `#004d99`, ligero desplazamiento hacia arriba (`translateY(-2px)`).
- Al hacer clic abre una fila vacía al inicio de la tabla en modo edición,
  o bien un formulario modal compacto (decisión de implementación).

---

## Estados de carga y error

### Carga inicial
- Mientras se obtienen los datos: mostrar un indicador de _spinner_ o filas _skeleton_
  (barras de fondo `#f8f9fa` animadas).
- El botón "Añadir" permanece deshabilitado durante la carga.

### Error de red / API
- Mostrar un banner de alerta sobre la tabla:
  fondo `#fff3cd`, borde izquierdo `4px solid #dc3545`, texto `#333333`.
- Incluir el mensaje de error y un botón "Reintentar".

---

## Pantalla de autenticación (AuthPage)

- Fondo: `#ffffff`.
- Card centrada de `max-width: 400 px`, borde `1px solid #e0e0e0`, `border-radius: 8px`, sombra sutil.
- Logo de dataXbi centrado arriba del formulario.
- Botón de login: estilo `btn-primary` (`#0066cc`).

---

## Responsividad

- En pantallas `< 768 px`: la tabla agrega `overflow-x: auto` para permitir scroll horizontal.
- El header colapsa el email del usuario y mantiene solo el botón de logout.

---

## Criterios de aceptación

- La app usa fondo blanco (`#ffffff`) en toda el área de contenido.
- Los botones primarios muestran `#0066cc` y hover `#004d99`.
- La tabla usa TanStack Table y muestra todas las columnas de `EtlConfigIngestion`.
- El botón "Añadir configuración" está visible en la parte superior de la tabla.
- Cada fila tiene iconos de editar y eliminar.
- Al hacer clic en editar, la fila cambia a modo edición inline con inputs.
- Guardar llama a la API y actualiza la fila; cancelar descarta los cambios.
- Los estados de carga y error se muestran de forma visible y comprensible.
