import React from 'react';

export function JsonPreview({ value }) {
  return (
    <pre className="text-xs bg-neutral-900/60 border border-emerald-800/40 rounded-md p-3 overflow-auto max-h-80 text-emerald-200">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}
