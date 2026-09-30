// tiptap builds its middleware array from named fields only - a raw
// `middleware: [offset(...)]` key is silently ignored.
export const floatingOptions = {
  placement: 'bottom' as const,
  offset: { mainAxis: 10, crossAxis: 0 },
  strategy: 'absolute' as const,
};
