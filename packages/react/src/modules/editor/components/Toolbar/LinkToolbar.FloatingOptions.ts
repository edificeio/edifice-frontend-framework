import { offset } from '@floating-ui/dom';

export const floatingOptions = {
  placement: 'bottom' as const,
  middleware: [offset({ mainAxis: 10, crossAxis: 0 })],
  strategy: 'absolute' as const,
};
