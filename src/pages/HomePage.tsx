import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';

import { useAuth } from '@/hooks/AuthContext';
import dataxbiLogo from '@/assets/dataxbi-logo.png';
import { getRayfinClient } from '@/services/rayfinClient';

// ─── Types ────────────────────────────────────────────────────────────────────

type EtlConfigRecord = {
  id: string;
  isEnabled: boolean;
  sourceConnectionName: string;
  sourceSchemaName: string;
  sourceTableName: string;
  loadMode: string;
  incrementalColumnName?: string;
  targetWorkspaceName: string;
  targetLakehouseName: string;
  targetSchemaName?: string;
  targetTableName: string;
  createdAt: string;
  updatedAt?: string;
  updatedByUserId?: string;
};

type EtlConfigForm = {
  isEnabled: boolean;
  sourceConnectionName: string;
  sourceSchemaName: string;
  sourceTableName: string;
  loadMode: 'Full' | 'Incremental';
  incrementalColumnName: string;
  targetWorkspaceName: string;
  targetLakehouseName: string;
  targetSchemaName: string;
  targetTableName: string;
};

const emptyForm: EtlConfigForm = {
  isEnabled: true,
  sourceConnectionName: '',
  sourceSchemaName: 'dbo',
  sourceTableName: '',
  loadMode: 'Full',
  incrementalColumnName: '',
  targetWorkspaceName: '',
  targetLakehouseName: '',
  targetSchemaName: 'dbo',
  targetTableName: '',
};

// ─── Styles (shared) ─────────────────────────────────────────────────────────

const inputCls =
  'w-full border border-[#e0e0e0] rounded px-2 py-1 text-sm text-[#333333] bg-white ' +
  'focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc]';

const selectCls = inputCls + ' cursor-pointer';

// ─── Sub-components ──────────────────────────────────────────────────────────

function EnabledBadge({ value }: { value: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
        value ? 'bg-[#d4edda] text-[#155724]' : 'bg-[#f8f9fa] text-[#666666]'
      }`}
    >
      {value ? 'Sí' : 'No'}
    </span>
  );
}

function LoadModeBadge({ value }: { value: string }) {
  return (
    <span className="inline-block rounded-full bg-[#e8f0fe] text-[#0066cc] px-2 py-0.5 text-xs font-medium">
      {value}
    </span>
  );
}

function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <tr key={i} className="border-b border-[#e0e0e0]">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 rounded bg-[#f8f9fa] animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function HomePage() {
  const { signOut } = useAuth();
  const client = useMemo(() => getRayfinClient(), []);

  const [records, setRecords] = useState<EtlConfigRecord[]>([]);
  // editingRowId: null = none | 'new' = adding | uuid = editing existing
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EtlConfigForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Data loading ──────────────────────────────────────────────────────────

  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await client.data.EtlConfigIngestion.select([
        'id', 'isEnabled', 'sourceConnectionName', 'sourceSchemaName',
        'sourceTableName', 'loadMode', 'incrementalColumnName',
        'targetWorkspaceName', 'targetLakehouseName', 'targetSchemaName',
        'targetTableName', 'createdAt', 'updatedAt', 'updatedByUserId',
      ]).orderBy({ createdAt: 'desc' }).execute();
      setRecords(response as unknown as EtlConfigRecord[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load ETL configurations');
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => { void loadRecords(); }, [loadRecords]);

  // ── Editing helpers ───────────────────────────────────────────────────────

  const updateField = useCallback(
    <K extends keyof EtlConfigForm>(field: K, value: EtlConfigForm[K]) =>
      setEditValues(v => ({ ...v, [field]: value })),
    []
  );

  const startAdd = useCallback(() => {
    setEditingRowId('new');
    setEditValues(emptyForm);
  }, []);

  const startEdit = useCallback((record: EtlConfigRecord) => {
    setEditingRowId(record.id);
    setEditValues({
      isEnabled: record.isEnabled,
      sourceConnectionName: record.sourceConnectionName,
      sourceSchemaName: record.sourceSchemaName,
      sourceTableName: record.sourceTableName,
      loadMode: record.loadMode as 'Full' | 'Incremental',
      incrementalColumnName: record.incrementalColumnName ?? '',
      targetWorkspaceName: record.targetWorkspaceName,
      targetLakehouseName: record.targetLakehouseName,
      targetSchemaName: record.targetSchemaName ?? '',
      targetTableName: record.targetTableName,
    });
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingRowId(null);
    setEditValues(emptyForm);
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editingRowId) return;
    try {
      setSaving(true);
      setError(null);
      const payload = {
        isEnabled: editValues.isEnabled,
        sourceConnectionName: editValues.sourceConnectionName,
        sourceSchemaName: editValues.sourceSchemaName,
        sourceTableName: editValues.sourceTableName,
        loadMode: editValues.loadMode,
        incrementalColumnName: editValues.incrementalColumnName || undefined,
        targetWorkspaceName: editValues.targetWorkspaceName,
        targetLakehouseName: editValues.targetLakehouseName,
        targetSchemaName: editValues.targetSchemaName || undefined,
        targetTableName: editValues.targetTableName,
        updatedAt: new Date(),
      };
      if (editingRowId === 'new') {
        await client.data.EtlConfigIngestion.create({ ...payload, createdAt: new Date() });
      } else {
        await client.data.EtlConfigIngestion.update({ id: editingRowId }, payload);
      }
      cancelEdit();
      await loadRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save configuration');
    } finally {
      setSaving(false);
    }
  }, [editingRowId, editValues, client, cancelEdit, loadRecords]);

  const onDelete = useCallback(async (id: string) => {
    if (!window.confirm('¿Eliminar esta configuración ETL?')) return;
    try {
      setError(null);
      await client.data.EtlConfigIngestion.delete({ id });
      if (editingRowId === id) cancelEdit();
      await loadRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete configuration');
    }
  }, [client, editingRowId, cancelEdit, loadRecords]);

  // ── Column definitions ────────────────────────────────────────────────────

  const columns = useMemo<ColumnDef<EtlConfigRecord>[]>(
    () => [
      {
        id: 'isEnabled',
        header: 'Activo',
        size: 70,
        cell: ({ row }) =>
          editingRowId === row.original.id ? (
            <input
              type="checkbox"
              checked={editValues.isEnabled}
              onChange={e => updateField('isEnabled', e.target.checked)}
              className="h-4 w-4 cursor-pointer accent-[#0066cc]"
            />
          ) : (
            <EnabledBadge value={row.original.isEnabled} />
          ),
      },
      {
        id: 'sourceConnectionName',
        header: 'Conexión origen',
        accessorKey: 'sourceConnectionName',
        cell: ({ row }) =>
          editingRowId === row.original.id ? (
            <input
              className={inputCls}
              value={editValues.sourceConnectionName}
              onChange={e => updateField('sourceConnectionName', e.target.value)}
              placeholder="ConnectionName"
            />
          ) : (
            <span className="font-medium text-[#333333]">{row.original.sourceConnectionName}</span>
          ),
      },
      {
        id: 'source',
        header: 'Tabla origen',
        cell: ({ row }) =>
          editingRowId === row.original.id ? (
            <div className="flex gap-1">
              <input
                className={inputCls}
                style={{ width: '42%' }}
                value={editValues.sourceSchemaName}
                onChange={e => updateField('sourceSchemaName', e.target.value)}
                placeholder="schema"
              />
              <span className="self-center text-[#666666]">.</span>
              <input
                className={inputCls}
                style={{ width: '55%' }}
                value={editValues.sourceTableName}
                onChange={e => updateField('sourceTableName', e.target.value)}
                placeholder="tabla"
              />
            </div>
          ) : (
            <span className="text-[#333333]">
              <span className="text-[#666666]">{row.original.sourceSchemaName}.</span>
              {row.original.sourceTableName}
            </span>
          ),
      },
      {
        id: 'loadMode',
        header: 'Modo',
        size: 160,
        cell: ({ row }) =>
          editingRowId === row.original.id ? (
            <div className="flex flex-col gap-1">
              <select
                className={selectCls}
                value={editValues.loadMode}
                onChange={e => updateField('loadMode', e.target.value as 'Full' | 'Incremental')}
              >
                <option value="Full">Full</option>
                <option value="Incremental">Incremental</option>
              </select>
              {editValues.loadMode === 'Incremental' && (
                <input
                  className={inputCls}
                  value={editValues.incrementalColumnName}
                  onChange={e => updateField('incrementalColumnName', e.target.value)}
                  placeholder="Columna incremental"
                />
              )}
            </div>
          ) : (
            <div>
              <LoadModeBadge value={row.original.loadMode} />
              {row.original.incrementalColumnName && (
                <p className="mt-0.5 text-xs text-[#666666]">{row.original.incrementalColumnName}</p>
              )}
            </div>
          ),
      },
      {
        id: 'target',
        header: 'Destino',
        cell: ({ row }) =>
          editingRowId === row.original.id ? (
            <div className="flex flex-col gap-1">
              <input
                className={inputCls}
                value={editValues.targetWorkspaceName}
                onChange={e => updateField('targetWorkspaceName', e.target.value)}
                placeholder="Workspace"
              />
              <input
                className={inputCls}
                value={editValues.targetLakehouseName}
                onChange={e => updateField('targetLakehouseName', e.target.value)}
                placeholder="Lakehouse"
              />
              <div className="flex gap-1">
                <input
                  className={inputCls}
                  style={{ width: '42%' }}
                  value={editValues.targetSchemaName}
                  onChange={e => updateField('targetSchemaName', e.target.value)}
                  placeholder="schema"
                />
                <span className="self-center text-[#666666]">.</span>
                <input
                  className={inputCls}
                  style={{ width: '55%' }}
                  value={editValues.targetTableName}
                  onChange={e => updateField('targetTableName', e.target.value)}
                  placeholder="tabla"
                />
              </div>
            </div>
          ) : (
            <div>
              <span className="text-xs text-[#666666] block">{row.original.targetWorkspaceName}</span>
              <span className="text-[#333333]">
                {row.original.targetLakehouseName}
                {' / '}
                <span className="text-[#666666]">{row.original.targetSchemaName || 'dbo'}.</span>
                {row.original.targetTableName}
              </span>
            </div>
          ),
      },
      {
        id: 'actions',
        header: '',
        size: 120,
        cell: ({ row }) =>
          editingRowId === row.original.id ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void saveEdit()}
                disabled={saving}
                className="rounded bg-[#0066cc] px-3 py-1 text-xs font-semibold text-white hover:bg-[#004d99] disabled:opacity-60 transition"
              >
                {saving ? '…' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="rounded border border-[#e0e0e0] px-3 py-1 text-xs font-medium text-[#333333] hover:bg-[#f8f9fa] transition"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(row.original)}
                disabled={editingRowId !== null}
                className="p-1.5 rounded text-[#0066cc] hover:bg-[#e8f0fe] disabled:opacity-30 transition"
                title="Editar"
              >
                ✏️
              </button>
              <button
                type="button"
                onClick={() => void onDelete(row.original.id)}
                disabled={editingRowId !== null}
                className="p-1.5 rounded text-[#dc3545] hover:bg-[#fdecea] disabled:opacity-30 transition"
                title="Eliminar"
              >
                🗑️
              </button>
            </div>
          ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editingRowId, editValues, saving]
  );

  // ── TanStack Table ────────────────────────────────────────────────────────

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const colCount = columns.length;

  // ── New-row form (rendered as first tbody row when editingRowId === 'new') ─

  const newRow = editingRowId === 'new' ? (
    <tr className="border-b border-[#e0e0e0] bg-[#fffbe6]">
      <td className="px-4 py-2">
        <input
          type="checkbox"
          checked={editValues.isEnabled}
          onChange={e => updateField('isEnabled', e.target.checked)}
          className="h-4 w-4 cursor-pointer accent-[#0066cc]"
        />
      </td>
      <td className="px-4 py-2">
        <input className={inputCls} value={editValues.sourceConnectionName}
          onChange={e => updateField('sourceConnectionName', e.target.value)}
          placeholder="ConnectionName" />
      </td>
      <td className="px-4 py-2">
        <div className="flex gap-1">
          <input className={inputCls} style={{ width: '42%' }} value={editValues.sourceSchemaName}
            onChange={e => updateField('sourceSchemaName', e.target.value)} placeholder="schema" />
          <span className="self-center text-[#666666]">.</span>
          <input className={inputCls} style={{ width: '55%' }} value={editValues.sourceTableName}
            onChange={e => updateField('sourceTableName', e.target.value)} placeholder="tabla" />
        </div>
      </td>
      <td className="px-4 py-2">
        <div className="flex flex-col gap-1">
          <select className={selectCls} value={editValues.loadMode}
            onChange={e => updateField('loadMode', e.target.value as 'Full' | 'Incremental')}>
            <option value="Full">Full</option>
            <option value="Incremental">Incremental</option>
          </select>
          {editValues.loadMode === 'Incremental' && (
            <input className={inputCls} value={editValues.incrementalColumnName}
              onChange={e => updateField('incrementalColumnName', e.target.value)}
              placeholder="Columna incremental" />
          )}
        </div>
      </td>
      <td className="px-4 py-2">
        <div className="flex flex-col gap-1">
          <input className={inputCls} value={editValues.targetWorkspaceName}
            onChange={e => updateField('targetWorkspaceName', e.target.value)} placeholder="Workspace" />
          <input className={inputCls} value={editValues.targetLakehouseName}
            onChange={e => updateField('targetLakehouseName', e.target.value)} placeholder="Lakehouse" />
          <div className="flex gap-1">
            <input className={inputCls} style={{ width: '42%' }} value={editValues.targetSchemaName}
              onChange={e => updateField('targetSchemaName', e.target.value)} placeholder="schema" />
            <span className="self-center text-[#666666]">.</span>
            <input className={inputCls} style={{ width: '55%' }} value={editValues.targetTableName}
              onChange={e => updateField('targetTableName', e.target.value)} placeholder="tabla" />
          </div>
        </div>
      </td>
      <td className="px-4 py-2">
        <div className="flex gap-2">
          <button type="button" onClick={() => void saveEdit()} disabled={saving}
            className="rounded bg-[#0066cc] px-3 py-1 text-xs font-semibold text-white hover:bg-[#004d99] disabled:opacity-60 transition">
            {saving ? '…' : 'Crear'}
          </button>
          <button type="button" onClick={cancelEdit} disabled={saving}
            className="rounded border border-[#e0e0e0] px-3 py-1 text-xs font-medium text-[#333333] hover:bg-[#f8f9fa] transition">
            Cancelar
          </button>
        </div>
      </td>
    </tr>
  ) : null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[#e0e0e0] px-6 py-3 flex items-center justify-between">
        <img src={dataxbiLogo} alt="dataXbi" className="h-8 w-auto" />
        <button
          onClick={() => void signOut()}
          className="rounded border border-[#0066cc] px-3 py-1.5 text-sm font-medium text-[#0066cc] hover:bg-[#0066cc] hover:text-white transition"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-[1200px] px-6 py-8">
        {/* Toolbar */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#333333]">ETL Ingestion Config</h1>
            <p className="text-sm text-[#666666]">Configuraciones de ingesta de datos</p>
          </div>
          <button
            type="button"
            onClick={startAdd}
            disabled={editingRowId !== null || loading}
            className="rounded bg-[#0066cc] px-4 py-2 text-sm font-semibold text-white hover:bg-[#004d99] disabled:opacity-50 transition"
            style={{ transform: 'translateY(0)', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
          >
            + Añadir configuración
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 flex items-start gap-3 rounded border-l-4 border-[#dc3545] bg-[#fff3cd] px-4 py-3">
            <span className="text-sm text-[#333333] flex-1">{error}</span>
            <button
              type="button"
              onClick={() => void loadRecords()}
              className="text-sm font-medium text-[#0066cc] hover:underline shrink-0"
            >
              Reintentar
            </button>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-[#666666] hover:text-[#333333] shrink-0"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded border border-[#e0e0e0]">
          <table className="w-full border-collapse text-sm" style={{ minWidth: 900 }}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-[#e0e0e0] bg-[#f8f9fa]">
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left font-semibold text-[#333333]"
                      style={{ width: header.column.columnDef.size }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {newRow}
              {loading ? (
                <SkeletonRows cols={colCount} />
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={colCount} className="px-4 py-8 text-center text-[#666666]">
                    No hay configuraciones. Haz clic en "+ Añadir configuración" para crear una.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr
                    key={row.id}
                    className={`border-b border-[#e0e0e0] transition-colors ${
                      editingRowId === row.original.id
                        ? 'bg-[#f0f7ff]'
                        : 'hover:bg-[#f8f9fa]'
                    }`}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-4 py-3 align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && records.length > 0 && (
          <p className="mt-2 text-xs text-[#666666]">
            {records.length} configuración{records.length !== 1 ? 'es' : ''}
          </p>
        )}
      </main>
    </div>
  );
}
