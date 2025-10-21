import React from 'react';
import { ArrayDndList } from './ArrayDndList';
import { Input, Textarea } from "../ui/input";

export function LinksEditor({ items, onChange }) {
  return (
    <ArrayDndList
      title="Links"
      items={items || []}
      onChange={onChange}
      makeNew={() => ({ label: '', url: '' })}
      getKey={(l, i) => `${l.label}-${i}`}
      renderItem={({ item, onItemChange }) => (
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-emerald-300 mb-1">Label</div>
            <Input value={item.label} onChange={(e) => onItemChange({ ...item, label: e.target.value })} />
          </div>
          <div>
            <div className="text-xs text-emerald-300 mb-1">URL</div>
            <Input value={item.url} onChange={(e) => onItemChange({ ...item, url: e.target.value })} />
          </div>
        </div>
      )}
    />
  );
}

export function MetricsEditor({ items, onChange }) {
  return (
    <ArrayDndList
      title="Metrics"
      items={items || []}
      onChange={onChange}
      makeNew={() => ({ label: '', value: '' })}
      getKey={(m, i) => `${m.label}-${i}`}
      renderItem={({ item, onItemChange }) => (
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-emerald-300 mb-1">Label</div>
            <Input value={item.label} onChange={(e) => onItemChange({ ...item, label: e.target.value })} />
          </div>
          <div>
            <div className="text-xs text-emerald-300 mb-1">Value</div>
            <Input value={item.value} onChange={(e) => onItemChange({ ...item, value: e.target.value })} />
          </div>
        </div>
      )}
    />
  );
}

export function GalleryEditor({ items, onChange }) {
  return (
    <ArrayDndList
      title="Gallery"
      items={items || []}
      onChange={onChange}
      makeNew={() => ({ src: '', alt: '', caption: '' })}
      getKey={(g, i) => `${g.src}-${i}`}
      renderItem={({ item, onItemChange }) => (
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-emerald-300 mb-1">Image URL</div>
            <Input value={item.src} onChange={(e) => onItemChange({ ...item, src: e.target.value })} />
          </div>
          <div>
            <div className="text-xs text-emerald-300 mb-1">Alt</div>
            <Input value={item.alt} onChange={(e) => onItemChange({ ...item, alt: e.target.value })} />
          </div>
          <div>
            <div className="text-xs text-emerald-300 mb-1">Caption</div>
            <Input value={item.caption || ''} onChange={(e) => onItemChange({ ...item, caption: e.target.value })} />
          </div>
        </div>
      )}
    />
  );
}
