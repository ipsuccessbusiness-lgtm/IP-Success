'use client';

import { useState, useEffect } from 'react';
import { Star, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  review: string;
  rating: number;
  avatar_initials: string;
  image_url?: string;
  video_url?: string;
  is_active: boolean;
  sort_order: number;
}

const DEFAULT_FORM = { name: '', location: '', review: '', rating: 5, avatar_initials: '', image_url: '', video_url: '', is_active: true, sort_order: 0 };

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Testimonial, 'id'>>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch {
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/admin/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...form, 
        avatar_initials: form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
        image_url: form.image_url || null,
        video_url: form.video_url || null
      }),
    });
    setForm(DEFAULT_FORM);
    setShowForm(false);
    await fetchTestimonials();
    setSaving(false);
  };

  const uploadMedia = async (type: 'image_url' | 'video_url', file: File) => {
    setSaving(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setForm(f => ({ ...f, [type]: data.url }));
      }
    } catch (e) {
      console.error('Upload failed', e);
      alert('Failed to upload file');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (t: Testimonial) => {
    await fetch(`/api/admin/testimonials/${t.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !t.is_active }),
    });
    await fetchTestimonials();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
    await fetchTestimonials();
  };

  if (loading) return <div className="h-48 flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Star className="w-6 h-6 text-primary-700" />
            Testimonials
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{testimonials.length} testimonials</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary-700 text-white rounded-xl text-sm font-bold hover:bg-primary-800 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-primary-200 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900">New Testimonial</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/30" placeholder="Customer Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location *</label>
              <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/30" placeholder="City, State" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Review *</label>
            <textarea value={form.review} onChange={e => setForm(f => ({ ...f, review: e.target.value }))} rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/30 resize-none" placeholder="Customer review..." />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Image Upload (Optional)</label>
              <div className="flex flex-col gap-2">
                <input type="file" accept="image/*" onChange={e => e.target.files && uploadMedia('image_url', e.target.files[0])} disabled={saving} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                <input type="text" value={form.image_url || ''} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="Or paste Image URL" className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/30" />
                {form.image_url && <img src={form.image_url} alt="Preview" className="h-16 w-16 object-cover rounded-xl mt-1 border" />}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Video Upload (Optional)</label>
              <div className="flex flex-col gap-2">
                <input type="file" accept="video/*" onChange={e => e.target.files && uploadMedia('video_url', e.target.files[0])} disabled={saving} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                <input type="text" value={form.video_url || ''} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} placeholder="Or paste Video URL" className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/30" />
                {form.video_url && <video src={form.video_url} className="h-16 w-auto object-cover rounded-xl mt-1 border" controls />}
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating</label>
              <select value={form.rating} onChange={e => setForm(f => ({ ...f, rating: parseInt(e.target.value) }))}
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm focus:outline-none">
                {[5, 4, 3].map(r => <option key={r} value={r}>{r} Stars</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving}
              className="px-6 py-2.5 bg-primary-700 text-white rounded-xl text-sm font-bold hover:bg-primary-800 disabled:opacity-60 transition-all">
              {saving ? 'Saving...' : 'Save Testimonial'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="grid gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className={`bg-white rounded-2xl p-5 border shadow-sm flex items-start gap-4 ${!t.is_active ? 'opacity-60' : 'border-outline-variant'}`}>
            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${t.is_active ? 'bg-primary-700 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {t.avatar_initials}
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-900">{t.name}</span>
                <span className="text-xs text-gray-400">· {t.location}</span>
                <div className="flex ml-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 italic truncate">{t.review}</p>
              
              {(t.image_url || t.video_url) && (
                <div className="flex gap-2 mt-3">
                  {t.image_url && (
                    <a href={t.image_url} target="_blank" className="relative group">
                      <img src={t.image_url} alt="Testimonial media" className="w-16 h-16 object-cover rounded-xl border shadow-sm group-hover:opacity-80 transition-opacity" />
                    </a>
                  )}
                  {t.video_url && (
                    <a href={t.video_url} target="_blank" className="relative group">
                      <video src={t.video_url} className="w-16 h-16 object-cover rounded-xl border shadow-sm group-hover:opacity-80 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent ml-0.5" />
                        </div>
                      </div>
                    </a>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => handleToggle(t)} className="text-gray-400 hover:text-primary-700 transition-colors" title={t.is_active ? 'Deactivate' : 'Activate'}>
                {t.is_active ? <ToggleRight className="w-6 h-6 text-primary-700" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
              <button onClick={() => handleDelete(t.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="text-center py-16 text-gray-400">No testimonials yet. Add your first one above.</div>
        )}
      </div>
    </div>
  );
}
