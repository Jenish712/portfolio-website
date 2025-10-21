import React from 'react';
import { ArrayDndList } from './ArrayDndList';
import { Input } from "../ui/input";

export function StringListEditor({ title, items, onChange, placeholder }) {
  return (
    <ArrayDndList
      title={title}
      items={items || []}
      onChange={onChange}
      makeNew={() => ('')}
      renderItem={({ item, onItemChange }) => (
        <Input value={item} placeholder={placeholder} onChange={(e) => onItemChange(e.target.value)} />
      )}
    />
  );
}
