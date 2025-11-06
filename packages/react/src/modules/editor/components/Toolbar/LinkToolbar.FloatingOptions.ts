export const floatingOptions = {
  placement: 'bottom' as const,
  middleware: [
    {
      name: 'offset',
      options: { mainAxis: 10, crossAxis: 0 },
    },
  ],
  strategy: 'fixed' as const,
};
