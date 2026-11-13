import { CarnetDeBord } from './CarnetDeBord';
import { useCarnetDeBordContainer } from './hooks/useCarnetDeBordContainer';

export function CarnetDeBordContainer() {
  const { status, eleves, currentEleveIndex, onEleveChange, isRelative } =
    useCarnetDeBordContainer();

  return (
    <CarnetDeBord
      status={status}
      eleves={eleves}
      currentEleveIndex={currentEleveIndex}
      onEleveChange={onEleveChange}
      isRelative={isRelative}
    />
  );
}
