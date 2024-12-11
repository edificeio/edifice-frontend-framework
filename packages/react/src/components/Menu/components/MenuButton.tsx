import clsx from 'clsx';
import { Button, ButtonProps } from '../../Button';
import { useMenuContext } from './MenuContext';

export type MenuButtonProps = Pick<
  ButtonProps,
  'children' | 'leftIcon' | 'rightIcon' | 'onClick'
> & {
  selected: boolean;
};

export const MenuButton = (props: Partial<MenuButtonProps>) => {
  const { selected, leftIcon, rightIcon, onClick, children } = props;

  const { childProps } = useMenuContext();

  return (
    <Button
      variant="ghost"
      color="tertiary"
      className={clsx('stack w-100', {
        selected: selected,
      })}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      onClick={onClick}
      {...childProps}
    >
      {children}
    </Button>
  );
};
