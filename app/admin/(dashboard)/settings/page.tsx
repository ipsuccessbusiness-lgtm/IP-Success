'use client';

import { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react';

const SETTING_DEFS = [
  { key: 'whatsapp_number', label: 'WhatsApp Number', type: 'text', placeholder: '919925050013', help: 'Include country code, no + or spaces' },
  { key: 'cod_enabled', label: 'Cash on Delivery', type: 'toggle', help: 'Enable/disable COD for all orders' },
  { key: 'razorpay_enabled', label: 'Online Payments (Razorpay)', type: 'toggle', help: 'Enable/disable Razorpay payments' },
  { key: 'low_stock_alert_email', label: 'Low Stock Alert Email', type: 'email', placeholder: 'admin@ipsuccess.in', help: 'Email to notify when stock is low' },
  { key: 'store_name', label: 'Store Name', type: 'text', placeholder: 'IP Success', help: 'Displayed in emails and invoices' },
  { key: 'store_phone', label: 'Store Phone', type: 'text', placeholder: '+91 99250 50013', help: 'Shown in emails and on website' },
  { key: 'store_address', label: 'Store Address', type: 'text', placeholder: 'Ahmedabad, Gujarat', help: 'Shown on shipping labels' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        const map: Record<string, string> = {};
        if (Array.isArray(data)) {
          data.forEach((s: { key: string; value: string }) => { map[s.key] = s.value; });
        }
        setSettings(map);
        setLoading(false);
      })
      .catch(() => {
        setSettings({});
        setLoading(false);
      });
  }, []);

  const handleSave = async (key: string) => {
    setSaving(key);
    await fetch(`/api/admin/settings/${key}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: settings[key] }),
    });
    setSaving(null);
    setSaved(prev => new Set([...prev, key]));
    setTimeout(() => setSaved(prev => { const s = new Set(prev); s.delete(key); return s; }), 2000);
  };

  if (loading) return <div className="h-48 flex items-center justify-center text-gray-400">Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary-700" />
          Settings
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure your store settings</p>
      </div>

      <div className="space-y-4">
        {SETTING_DEFS.map((def) => (
          <div key={def.key} className="bg-white rounded-2xl p-5 border border-outline-variant shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-grow">
                <label className="block font-semibold text-gray-900 text-sm mb-0.5">{def.label}</label>
                <p className="text-xs text-gray-400 mb-3">{def.help}</p>

                {def.type === 'toggle' ? (
                  <button
                    id={`toggle-${def.key}`}
                    onClick={() => {
                      const newVal = settings[def.key] === 'true' ? 'false' : 'true';
                      setSettings(s => ({ ...s, [def.key]: newVal }));
                    }}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      settings[def.key] === 'true' ? 'bg-primary-700' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                        settings[def.key] === 'true' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                ) : (
                  <input
                    id={`setting-${def.key}`}
                    type={def.type}
                    value={settings[def.key] || ''}
                    onChange={e => setSettings(s => ({ ...s, [def.key]: e.target.value }))}
                    placeholder={def.placeholder}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/30"
                  />
                )}
              </div>

              <button
                onClick={() => handleSave(def.key)}
                disabled={saving === def.key}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary-700 text-white rounded-xl text-xs font-bold hover:bg-primary-800 disabled:opacity-60 transition-all flex-shrink-0 mt-7"
                id={`save-${def.key}`}
              >
                <Save className="w-3.5 h-3.5" />
                {saving === def.key ? '...' : saved.has(def.key) ? '✓' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
