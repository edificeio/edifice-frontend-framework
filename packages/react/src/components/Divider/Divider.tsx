import { ReactNode } from 'react';
import { Flex } from '../Flex';

export function Divider({
  children,
  color = 'var(--edifice-gray-400)',
}: {
  children: ReactNode[];
  color: string;
}) {
  return (
    <Flex align="center" justify="around" gap="16" wrap="nowrap">
      <hr
        className="divider m-12 ms-0 flex-fill"
        style={{ borderColor: color }}
      />
      <Flex gap="12" align="center" justify="around">
        {...children}
      </Flex>
      <hr
        className="divider m-12 me-0 flex-fill"
        style={{ borderColor: color }}
      />
    </Flex>
  );
}
