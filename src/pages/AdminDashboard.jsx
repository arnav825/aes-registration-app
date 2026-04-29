import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { fetchAllRegistrations, deleteRegistration, updateRegistration } from '../firebase';
import { CATEGORIES, BRANCHES } from '../data/competitions';

function StatCard({ label, value, icon, color }) {
  return (
    <div className="card flex items-center gap-3 min-w-0">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-black text-gray-800 leading-none">{value}</p>
        <p className="text-xs text-gray-400 font-medium mt-0.5 truncate">{label}</p>
      </div>
    </div>
  );
}

function EditModal({ reg, onClose, onSave }) {
  const [form, setForm] = useState({ ...reg });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateRegistration(reg.id, {
        studentName:  form.studentName,
        class:        form.class,
        branch:       form.branch,
        teacherName:  form.teacherName,
      });
      onSave({ ...reg, ...form });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-lg text-gray-800">Edit Registration</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {[
            ['studentName', 'Student Name'],
            ['class', 'Class'],
            ['teacherName', 'Teacher Name'],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">{label}</label>
              <input
                type="text"
                value={form[key] || ''}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                className="input-field"
              />
            </div>
          ))}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Branch</label>
            <select
              value={form.branch || ''}
              onChange={e => setForm(p => ({ ...p, branch: e.target.value }))}
              className="input-field"
            >
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary py-2.5 text-sm">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary py-2.5 text-sm disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [searchName, setSearchName] = useState('');
  const [filterCat, setFilterCat]   = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterLevel, setFilterLevel]   = useState('');
  const [editingReg, setEditingReg] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [activeTab, setActiveTab]   = useState('list'); // list | stats

  // Auth guard
  useEffect(() => {
    if (!sessionStorage.getItem('aes_admin')) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllRegistrations();
      setRegistrations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this registration? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteRegistration(id);
      setRegistrations(prev => prev.filter(r => r.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveEdit = (updated) => {
    setRegistrations(prev => prev.map(r => r.id === updated.id ? updated : r));
    setEditingReg(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('aes_admin');
    navigate('/');
  };

  const handleExportCSV = () => {
    const rows = filtered.map(r => ({
      'Registration ID': r.registrationId,
      'Student Name':    r.studentName,
      'Class':           r.class,
      'Branch':          r.branch,
      'Category':        r.categoryName,
      'Level':           r.levelName,
      'Level Classes':   r.levelClasses,
      'Teacher':         r.teacherName,
      'Timestamp':       r.timestamp?.toDate ? r.timestamp.toDate().toLocaleString() : '',
    }));
    const ws   = XLSX.utils.json_to_sheet(rows);
    const wb   = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations');
    XLSX.writeFile(wb, `AES_Registrations_${Date.now()}.xlsx`);
  };

  // ── Filtering ───────────────────────────────────────────────
  const filtered = registrations.filter(r => {
    const nameMatch   = r.studentName?.toLowerCase().includes(searchName.toLowerCase());
    const catMatch    = !filterCat    || r.categoryId === filterCat;
    const branchMatch = !filterBranch || r.branch === filterBranch;
    const levelMatch  = !filterLevel  || r.levelId === filterLevel;
    return nameMatch && catMatch && branchMatch && levelMatch;
  });

  // ── Stats ───────────────────────────────────────────────────
  const total = registrations.length;
  const byCategory = CATEGORIES.map(c => ({
    ...c,
    count: registrations.filter(r => r.categoryId === c.id).length,
  }));
  const byBranch = BRANCHES.map(b => ({
    name: b,
    count: registrations.filter(r => r.branch === b).length,
  }));

  // Unique levels in current category filter
  const availableLevels = registrations
    .filter(r => !filterCat || r.categoryId === filterCat)
    .reduce((acc, r) => {
      if (!acc.find(l => l.id === r.levelId)) acc.push({ id: r.levelId, name: r.levelName });
      return acc;
    }, []);

  const tabs = ['list', 'stats'];

  return (
    <div className="screen-container">
      {/* Header */}
      <div className="bg-primary-500 text-white px-4 pt-10 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="font-black text-xl">Admin Dashboard</h1>
            <p className="text-primary-200 text-xs font-medium">AES Inter-School Competitions</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-primary-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Quick stats row */}
        <div className="flex gap-2 mt-3">
          <div className="bg-white/10 rounded-xl px-3 py-2 flex-1 text-center">
            <p className="text-xl font-black text-white">{total}</p>
            <p className="text-xs text-primary-200 font-medium">Total</p>
          </div>
          {CATEGORIES.slice(0, 3).map(c => (
            <div key={c.id} className="bg-white/10 rounded-xl px-3 py-2 flex-1 text-center">
              <p className="text-xl font-black text-white">
                {registrations.filter(r => r.categoryId === c.id).length}
              </p>
              <p className="text-xs text-primary-200 font-medium">{c.name.split(' ')[0]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-100">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 py-3 text-sm font-bold capitalize transition-colors ${
              activeTab === t
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-400'
            }`}
          >
            {t === 'list' ? '📋 Registrations' : '📊 Statistics'}
          </button>
        ))}
      </div>

      {activeTab === 'list' && (
        <div className="flex-1 overflow-y-auto">
          {/* Filters */}
          <div className="px-4 py-3 space-y-2 bg-gray-50 border-b border-gray-100">
            <input
              type="text"
              placeholder="🔍 Search by student name…"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              className="input-field text-sm"
            />
            <div className="grid grid-cols-3 gap-2">
              <select value={filterCat} onChange={e => { setFilterCat(e.target.value); setFilterLevel(''); }} className="input-field text-xs py-2">
                <option value="">All Events</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)} className="input-field text-xs py-2">
                <option value="">All Branches</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b.replace('AES ', '')}</option>)}
              </select>
              <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className="input-field text-xs py-2">
                <option value="">All Levels</option>
                {availableLevels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400 font-medium">
                Showing {filtered.length} of {total} registrations
              </p>
              <button
                onClick={handleExportCSV}
                className="text-xs font-bold text-primary-500 hover:text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                ⬇️ Export Excel
              </button>
            </div>
          </div>

          {/* List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin w-8 h-8 text-primary-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-2">📭</p>
              <p className="text-gray-400 font-medium text-sm">No registrations found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map(reg => {
                const cat = CATEGORIES.find(c => c.id === reg.categoryId);
                return (
                  <div key={reg.id} className="px-4 py-3 bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        <span className="text-xl flex-shrink-0 mt-0.5">{cat?.icon || '📝'}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-sm text-gray-800">{reg.studentName}</p>
                            <span className="text-xs bg-gold-100 text-gold-700 font-bold px-1.5 py-0.5 rounded">
                              {reg.registrationId}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-medium">
                            Class {reg.class} · {reg.branch}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
  {reg.categoryName} · {reg.levelName} · Teacher: {reg.teacherName}
  {reg.language && (
    <span className="ml-1 text-blue-500 font-bold">· 🌐 {reg.language}</span>
  )}
</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => setEditingReg(reg)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(reg.id)}
                          disabled={deletingId === reg.id}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors disabled:opacity-50"
                        >
                          {deletingId === reg.id ? (
                            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="h-6" />
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
          {/* Category stats */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">By Event</p>
            <div className="space-y-2">
              {byCategory.map(c => (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="text-lg w-6 text-center">{c.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-bold text-gray-700 truncate">{c.name}</p>
                      <p className="text-xs font-black text-gray-800 ml-2">{c.count}</p>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: total > 0 ? `${(c.count / total) * 100}%` : '0%',
                          background: c.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Branch stats */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">By Branch</p>
            <div className="space-y-2">
              {byBranch.map(b => (
                <div key={b.name} className="card flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-700 truncate">{b.name}</p>
                    <div className="h-1.5 bg-gray-100 rounded-full mt-1.5 w-32 overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-700"
                        style={{ width: total > 0 ? `${(b.count / total) * 100}%` : '0%' }}
                      />
                    </div>
                  </div>
                  <span className="text-xl font-black text-primary-500 ml-3">{b.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Export from stats tab */}
          <button
            onClick={handleExportCSV}
            className="w-full btn-primary"
          >
            ⬇️ Export All to Excel
          </button>
          <div className="h-4" />
        </div>
      )}

      {/* Edit modal */}
      {editingReg && (
        <EditModal
          reg={editingReg}
          onClose={() => setEditingReg(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
