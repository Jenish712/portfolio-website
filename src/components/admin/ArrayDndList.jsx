import React, { useState, useCallback } from 'react';
import { Button } from "../ui/button";
import { GripVertical, Plus, Trash2, MoveUp, MoveDown } from "lucide-react";

// Generic drag-and-drop list with reorder support for simple arrays or arrays of objects.
// Props:
// - items: any[]
// - onChange: (next: any[]) => void
// - renderItem: ({ item, index, onItemChange }) => ReactNode
// - makeNew: () => any  (factory for new item)
// - getKey?: (item, index) => string
// - title?: string
export function ArrayDndList({ items, onChange, renderItem, makeNew, getKey, title }) {
  const [dragIndex, setDragIndex] = useState(null);

  const reorder = (list, start, end) => {
    const result = list.slice();
    const [removed] = result.splice(start, 1);
    result.splice(end, 0, removed);
    return result;
  };

  const onDragStart = useCallback((i) => setDragIndex(i), []);
  const onDragOver = useCallback((e) => e.preventDefault(), []);
  const onDrop = useCallback((i) => {
    if (dragIndex == null || dragIndex === i) return;
    onChange(reorder(items, dragIndex, i));
    setDragIndex(null);
  }, [dragIndex, items, onChange]);

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    onChange(reorder(items, i, j));
  };

  const removeAt = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {title && <div className="text-sm font-medium text-emerald-300">{title}</div>}
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={(getKey?.(item, i)) ?? i}
            className="rounded-md border border-emerald-800/40 bg-neutral-900/50 p-3 flex gap-3 items-start"
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(i)}
          >
            <div className="pt-1 text-neutral-400 cursor-grab"><GripVertical className="h-4 w-4" /></div>
            <div className="flex-1 min-w-0">
              {renderItem({ item, index: i, onItemChange: (next) => onChange(items.map((x, idx) => idx === i ? next : x)) })}
            </div>
            <div className="flex gap-2">
              <Button type="button" size="icon" variant="outline" onClick={() => move(i, -1)} className="h-8 w-8"><MoveUp className="h-4 w-4" /></Button>
              <Button type="button" size="icon" variant="outline" onClick={() => move(i, 1)} className="h-8 w-8"><MoveDown className="h-4 w-4" /></Button>
              <Button type="button" size="icon" variant="outline" onClick={() => removeAt(i)} className="h-8 w-8 border-red-500/40 text-red-400"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" onClick={() => onChange([...(items||[]), makeNew()])} className="border-emerald-700/50 text-emerald-300">
        <Plus className="h-4 w-4 mr-2" /> Add
      </Button>
    </div>
  );
}
