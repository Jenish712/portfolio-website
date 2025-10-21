import React from 'react';
import { ArrayDndList } from './ArrayDndList';
import { Input, Textarea } from "../ui/input";
import { Separator } from "../ui/separator";

export function DetailSectionsEditor({ sections, onChange }) {
  const makeNewSection = () => ({ heading: '', body: [''], bullets: [], codeSnippets: [], image: null });
  const makeNewSnippet = () => ({ title: '', language: 'javascript', code: '' });

  return (
    <ArrayDndList
      title="Detail Sections"
      items={sections || []}
      onChange={onChange}
      makeNew={makeNewSection}
      getKey={(s, i) => s.heading + i}
      renderItem={({ item, onItemChange }) => (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <div className="text-xs text-emerald-300 mb-1">Heading</div>
              <Input value={item.heading} onChange={(e) => onItemChange({ ...item, heading: e.target.value })} placeholder="Section heading" />
            </div>
            <div>
              <div className="text-xs text-emerald-300 mb-1">Image (URL)</div>
              <Input
                value={item.image?.src || ''}
                onChange={(e) => {
                  const src = e.target.value;
                  const next = src || item.image?.alt || item.image?.caption
                    ? { src: src || '', alt: item.image?.alt || '', caption: item.image?.caption || '' }
                    : null;
                  onItemChange({ ...item, image: next });
                }}
                placeholder="https://..."
              />
            </div>
            <div>
              <div className="text-xs text-emerald-300 mb-1">Image Alt</div>
              <Input
                value={item.image?.alt || ''}
                onChange={(e) => {
                  const alt = e.target.value;
                  const hasAny = (item.image?.src || '').length > 0 || alt || (item.image?.caption || '');
                  onItemChange({
                    ...item,
                    image: hasAny ? { src: item.image?.src || '', alt, caption: item.image?.caption || '' } : null,
                  });
                }}
                placeholder="Describe the image"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="sm:col-start-2">
              <div className="text-xs text-emerald-300 mb-1">Image Caption</div>
              <Input
                value={item.image?.caption || ''}
                onChange={(e) => {
                  const caption = e.target.value;
                  const hasAny = (item.image?.src || '').length > 0 || (item.image?.alt || '') || caption;
                  onItemChange({
                    ...item,
                    image: hasAny ? { src: item.image?.src || '', alt: item.image?.alt || '', caption } : null,
                  });
                }}
                placeholder="Optional caption shown under image"
              />
            </div>
          </div>
          <div>
            <div className="text-xs text-emerald-300 mb-1">Body (one paragraph per line)</div>
            <Textarea rows={3} value={(item.body||[]).join('\n')} onChange={(e) => onItemChange({ ...item, body: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })} />
          </div>
          <div>
            <div className="text-xs text-emerald-300 mb-1">Bullets (one per line)</div>
            <Textarea rows={3} value={(item.bullets||[]).join('\n')} onChange={(e) => onItemChange({ ...item, bullets: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })} />
          </div>
          <Separator />
          <ArrayDndList
            title="Code Snippets"
            items={item.codeSnippets || []}
            onChange={(snips) => onItemChange({ ...item, codeSnippets: snips })}
            makeNew={makeNewSnippet}
            getKey={(s, i) => s.title + i}
            renderItem={({ item: snip, onItemChange: onSnip }) => (
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <div className="text-xs text-emerald-300 mb-1">Title</div>
                  <Input value={snip.title} onChange={(e) => onSnip({ ...snip, title: e.target.value })} />
                </div>
                <div>
                  <div className="text-xs text-emerald-300 mb-1">Language</div>
                  <Input value={snip.language} onChange={(e) => onSnip({ ...snip, language: e.target.value })} />
                </div>
                <div className="sm:col-span-3">
                  <div className="text-xs text-emerald-300 mb-1">Code</div>
                  <Textarea rows={4} value={snip.code} onChange={(e) => onSnip({ ...snip, code: e.target.value })} />
                </div>
              </div>
            )}
          />
        </div>
      )}
    />
  );
}
