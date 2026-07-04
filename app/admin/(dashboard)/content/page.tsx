'use client';

import { useState, useEffect } from 'react';
import { FileText, Save } from 'lucide-react';

interface ContentItem {
  id: string;
  key: string;
  value_en: string;
  value_hi: string | null;
  value_gu: string | null;
  value_hinglish: string | null;
}

const CONTENT_LABELS: Record<string, string> = {
  hero_headline: 'Hero Headline',
  hero_subheadline: 'Hero Subheadline',
  hero_badge: 'Hero Badge Text',
  pain_headline: 'Pain Section Headline',
  offers_title: 'Offers Section Title',
  offers_subtitle: 'Offers Section Subtitle',
  footer_tagline: 'Footer Tagline',
  logo_image: 'Logo Image',
  hero_image: 'Hero Image',
};

export default function ContentPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/content')
      .then(r => r.json())
      .then(d => { 
        setContent(Array.isArray(d) ? d : []); 
        setLoading(false); 
      })
      .catch(e => {
        setContent([]);
        setLoading(false);
      });
  }, []);

  const handleSave = async (item: ContentItem) => {
    setSaving(item.key);
    await fetch(`/api/admin/content/${item.key}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    setSaving(null);
    setSaved(item.key);
    setTimeout(() => setSaved(null), 2000);
  };

  const uploadImage = async (key: string, file: File) => {
    setSaving(key);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        updateField(key, 'value_en', data.url);
        // Automatically save it too
        const updatedItem = content.find(c => c.key === key);
        if (updatedItem) {
          await fetch(`/api/admin/content/${key}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...updatedItem, value_en: data.url }),
          });
          setSaved(key);
          setTimeout(() => setSaved(null), 2000);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(null);
    }
  };

  const updateField = (key: string, field: keyof ContentItem, value: string) => {
    setContent(prev => prev.map(c => c.key === key ? { ...c, [field]: value } : c));
  };

  if (loading) return <div className="h-48 flex items-center justify-center text-gray-400">Loading content...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary-700" />
          Content Management
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Edit landing page text in all languages</p>
      </div>

      <div className="space-y-4">
        {content.map((item) => (
          <div key={item.key} className="bg-white rounded-2xl p-6 border border-outline-variant shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-gray-900">{CONTENT_LABELS[item.key] || item.key}</h2>
                <code className="text-xs text-gray-400 font-mono">{item.key}</code>
              </div>
              <button
                onClick={() => handleSave(item)}
                disabled={saving === item.key}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary-700 text-white rounded-xl text-sm font-semibold hover:bg-primary-800 transition-all disabled:opacity-60"
                id={`save-content-${item.key}`}
              >
                <Save className="w-4 h-4" />
                {saving === item.key ? 'Saving...' : saved === item.key ? '✓ Saved!' : 'Save'}
              </button>
            </div>
            {item.key === 'logo_image' || item.key === 'hero_image' ? (
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-500 mb-2">Upload Image</label>
                <div className="flex items-center gap-4">
                  {item.value_en && (
                    <img src={item.value_en} alt={item.key} className="h-16 w-auto rounded border" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => e.target.files && uploadImage(item.key, e.target.files[0])}
                    disabled={saving === item.key}
                    className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.value_en || ''}
                      onChange={e => updateField(item.key, 'value_en', e.target.value)}
                      placeholder="Or paste image URL directly"
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/30"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {[
                  { field: 'value_en' as const, lang: '🇬🇧 English' },
                  { field: 'value_hi' as const, lang: '🇮🇳 Hindi' },
                  { field: 'value_gu' as const, lang: 'GU Gujarati' },
                  { field: 'value_hinglish' as const, lang: '🌐 Hinglish' },
                ].map(({ field, lang }) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">{lang}</label>
                    <textarea
                      value={item[field] || ''}
                      onChange={e => updateField(item.key, field, e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/30 resize-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {content.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p>No content items found. Run the database seed to create them.</p>
          </div>
        )}
      </div>
    </div>
  );
}
