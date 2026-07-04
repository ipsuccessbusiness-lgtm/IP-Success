'use client';

export default function LabelActions() {
  return (
    <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }} className="print:hidden">
      <button 
        onClick={() => window.print()} 
        style={{ padding: '8px 16px', background: '#166534', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        🖨️ Print Label
      </button>
      <button 
        onClick={() => window.close()} 
        style={{ padding: '8px 16px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
      >
        Close
      </button>
    </div>
  );
}
