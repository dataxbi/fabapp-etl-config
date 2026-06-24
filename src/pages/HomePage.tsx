import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/hooks/AuthContext';
import dataxbiLogo from '@/assets/dataxbi-logo.png';
import { getRayfinClient } from '@/services/rayfinClient';

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

const emptyForm: EtlConfigForm = {
  isEnabled: true,
  sourceConnectionName: '',
  sourceSchemaName: '',
  sourceTableName: '',
  loadMode: 'Full',
  incrementalColumnName: '',
  targetWorkspaceName: '',
  targetLakehouseName: '',
  targetSchemaName: '',
  targetTableName: '',
};

export function HomePage() {
  const { signOut } = useAuth();
  const [records, setRecords] = useState<EtlConfigRecord[]>([]);
  const [form, setForm] = useState<EtlConfigForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const client = useMemo(() => getRayfinClient(), []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await client.data.EtlConfigIngestData.select([
        'id',
        'isEnabled',
        'sourceConnectionName',
        'sourceSchemaName',
        'sourceTableName',
        'loadMode',
        'incrementalColumnName',
        'targetWorkspaceName',
        'targetLakehouseName',
        'targetSchemaName',
        'targetTableName',
        'createdAt',
        'updatedAt',
        'updatedByUserId',
      ]).execute();
      setRecords(response as unknown as EtlConfigRecord[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load ETL configurations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRecords();
  }, [client]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        isEnabled: form.isEnabled,
        sourceConnectionName: form.sourceConnectionName,
        sourceSchemaName: form.sourceSchemaName,
        sourceTableName: form.sourceTableName,
        loadMode: form.loadMode,
        incrementalColumnName: form.incrementalColumnName || undefined,
        targetWorkspaceName: form.targetWorkspaceName,
        targetLakehouseName: form.targetLakehouseName,
        targetSchemaName: form.targetSchemaName || undefined,
        targetTableName: form.targetTableName,
        updatedAt: new Date(),
        updatedByUserId: undefined,
      };

      if (editingId) {
        await client.data.EtlConfigIngestData.update({ id: editingId }, payload);
      } else {
        await client.data.EtlConfigIngestData.create({
          ...payload,
          createdAt: new Date(),
        });
      }
      resetForm();
      await loadRecords();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : editingId
            ? 'Unable to update ETL configuration'
            : 'Unable to create ETL configuration'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (record: EtlConfigRecord) => {
    setEditingId(record.id);
    setForm({
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
  };

  const onDelete = async (recordId: string) => {
    if (!window.confirm('Delete this ETL configuration?')) {
      return;
    }

    try {
      await client.data.EtlConfigIngestData.delete({ id: recordId });
      if (editingId === recordId) {
        resetForm();
      }
      await loadRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete ETL configuration');
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_30%),linear-gradient(135deg,#07111f_0%,#0d1b2e_45%,#10253e_100%)] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/70 px-6 py-4 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <img src={dataxbiLogo} alt="dataXbi" className="h-9 w-auto" />
            <div>
              <p className="text-sm font-semibold text-cyan-300">ETL Config Studio</p>
              <p className="text-sm text-slate-400">Fabric app for pipeline configuration</p>
            </div>
          </div>
          <button
            onClick={() => void signOut()}
            className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/20"
            aria-label="Sign out"
          >
            Sign out
          </button>
        </header>

        <main className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <section className="rounded-[28px] border border-white/10 bg-slate-950/70 p-8 shadow-[0_20px_60px_rgba(2,6,23,0.3)] backdrop-blur-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Overview</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Manage ingestion settings with clarity.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              This Fabric app now exposes a live ETL configuration CRUD experience backed by Rayfin data entities.
            </p>

            <form onSubmit={onSubmit} className="mt-8 grid gap-4 rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm text-slate-300">
                  <span className="mb-2 block font-medium">Source connection</span>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm outline-none ring-0"
                    value={form.sourceConnectionName}
                    onChange={(event) => setForm({ ...form, sourceConnectionName: event.target.value })}
                    required
                  />
                </label>
                <label className="text-sm text-slate-300">
                  <span className="mb-2 block font-medium">Load mode</span>
                  <select
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm outline-none ring-0"
                    value={form.loadMode}
                    onChange={(event) => setForm({ ...form, loadMode: event.target.value as 'Full' | 'Incremental' })}
                  >
                    <option value="Full">Full</option>
                    <option value="Incremental">Incremental</option>
                  </select>
                </label>
                <label className="text-sm text-slate-300">
                  <span className="mb-2 block font-medium">Source schema</span>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm outline-none ring-0"
                    value={form.sourceSchemaName}
                    onChange={(event) => setForm({ ...form, sourceSchemaName: event.target.value })}
                    required
                  />
                </label>
                <label className="text-sm text-slate-300">
                  <span className="mb-2 block font-medium">Source table</span>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm outline-none ring-0"
                    value={form.sourceTableName}
                    onChange={(event) => setForm({ ...form, sourceTableName: event.target.value })}
                    required
                  />
                </label>
                <label className="text-sm text-slate-300">
                  <span className="mb-2 block font-medium">Target workspace</span>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm outline-none ring-0"
                    value={form.targetWorkspaceName}
                    onChange={(event) => setForm({ ...form, targetWorkspaceName: event.target.value })}
                    required
                  />
                </label>
                <label className="text-sm text-slate-300">
                  <span className="mb-2 block font-medium">Target lakehouse</span>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm outline-none ring-0"
                    value={form.targetLakehouseName}
                    onChange={(event) => setForm({ ...form, targetLakehouseName: event.target.value })}
                    required
                  />
                </label>
                <label className="text-sm text-slate-300">
                  <span className="mb-2 block font-medium">Target schema</span>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm outline-none ring-0"
                    value={form.targetSchemaName}
                    onChange={(event) => setForm({ ...form, targetSchemaName: event.target.value })}
                  />
                </label>
                <label className="text-sm text-slate-300">
                  <span className="mb-2 block font-medium">Target table</span>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm outline-none ring-0"
                    value={form.targetTableName}
                    onChange={(event) => setForm({ ...form, targetTableName: event.target.value })}
                    required
                  />
                </label>
                <label className="text-sm text-slate-300">
                  <span className="mb-2 block font-medium">Incremental column</span>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm outline-none ring-0"
                    value={form.incrementalColumnName}
                    onChange={(event) => setForm({ ...form, incrementalColumnName: event.target.value })}
                  />
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.isEnabled}
                    onChange={(event) => setForm({ ...form, isEnabled: event.target.checked })}
                  />
                  Enabled
                </label>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Saving…' : editingId ? 'Update configuration' : 'Create configuration'}
                </button>
                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <aside className="rounded-[28px] border border-white/10 bg-white/10 p-8 shadow-[0_20px_60px_rgba(2,6,23,0.2)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">Live records</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">ETL configurations</h2>
              </div>
              <button
                onClick={() => void loadRecords()}
                className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200"
              >
                Refresh
              </button>
            </div>

            {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

            <div className="mt-6 space-y-3">
              {loading ? (
                <p className="text-sm text-slate-300">Loading…</p>
              ) : records.length === 0 ? (
                <p className="text-sm text-slate-300">No configurations yet.</p>
              ) : (
                records.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{record.targetTableName}</p>
                        <p className="text-sm text-slate-400">
                          {record.sourceConnectionName} • {record.loadMode}
                        </p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${record.isEnabled ? 'bg-emerald-400/15 text-emerald-300' : 'bg-slate-400/15 text-slate-300'}`}>
                        {record.isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-300">
                      {record.sourceSchemaName}.{record.sourceTableName} → {record.targetLakehouseName}/{record.targetSchemaName || 'dbo'}.{record.targetTableName}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEditing(record)}
                        className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-200"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void onDelete(record.id)}
                        className="rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-1.5 text-xs font-semibold text-rose-200"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
