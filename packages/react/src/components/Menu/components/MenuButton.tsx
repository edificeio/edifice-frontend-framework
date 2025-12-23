import clsx from 'clsx';
import { Button, ButtonProps } from '../../Button';
import { useMenuContext } from './MenuContext';

export type MenuButtonProps = Pick<
  ButtonProps,
  'children' | 'leftIcon' | 'rightIcon' | 'onClick'
> & {
  selected: boolean;
  className?: string;
  size?: 'md' | 'lg';
};

export const MenuButton = (props: Partial<MenuButtonProps>) => {
  const { selected, leftIcon, rightIcon, onClick, children, className, size } =
    props;

  const { childProps } = useMenuContext();

  return (
    <Button
      variant="ghost"
      color="tertiary"
      className={clsx(
        'stack w-100 overflow-hidden',
        {
          'selected': selected,
          'menu-button-lg': size === 'lg',
        },
        className,
      )}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      onClick={onClick}
      {...childProps}
      style={size === 'lg' ? { height: 'auto' } : undefined}
    >
      <div
        className={clsx('text-truncate w-100 text-start', {
          'text-truncate-2 text-start ms-0': size === 'lg',
        })}
        style={{ overflowWrap: 'break-word' }}
      >
        {children}
      </div>
    </Button>
  );
};
