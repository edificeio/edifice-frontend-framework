import { ReactNode } from 'react';
import { Flex } from '..';

export type SeparatedInfoProps = {
  children: ReactNode[];
  className?: string;
};

export function SeparatedInfo({ children, className }: SeparatedInfoProps) {
  return (
    <Flex direction="row" className={`separated-info ${className}`}>
      {...children}
    </Flex>
  );
}
