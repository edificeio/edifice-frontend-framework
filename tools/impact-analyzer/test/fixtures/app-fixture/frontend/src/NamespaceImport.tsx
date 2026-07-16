import * as Fixture from '@edifice.io/fixture';

export function NamespaceWidget() {
  const enabled = Fixture.useToggle(true);
  return <Fixture.Button>{String(enabled)}</Fixture.Button>;
}
