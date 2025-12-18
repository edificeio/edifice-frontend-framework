/**
 * No-op Type decorator for browser builds
 */

export function Type(..._args: unknown[]): PropertyDecorator {
  return () => {};
}

export function ApiProperty(..._args: unknown[]): PropertyDecorator {
  return () => {};
}

export function ApiPropertyOptional(..._args: unknown[]): PropertyDecorator {
  return () => {};
}
