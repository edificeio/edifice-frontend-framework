import { Meta, StoryObj } from '@storybook/react-vite';

import { RefAttributes, useState } from 'react';
import {
  IconCopy,
  IconCut,
  IconDelete,
  IconEdit,
  IconFilter,
  IconPrint,
} from '../../../modules/icons/components';
import IconButton, { IconButtonProps } from '../../Button/IconButton';
import { ColorPicker, DefaultPalette } from '../../ColorPicker';
import Dropdown from '../Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown/Base',
  component: Dropdown,
  decorators: [(Story) => <div style={{ height: '400px' }}>{Story()}</div>],
  args: {
    block: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Dropdown` component is a flexible and accessible UI element that supports both keyboard and mouse interactions. It provides a comprehensive set of compound components including `Item`, `CheckboxItem`, `RadioItem`, and `Separator` for building dropdown menus. The component features a customizable trigger through render props and includes a `useDropdown` hook for creating custom dropdown implementations. Key features include:\n\n- Full keyboard navigation and ARIA support\n- Compound components for different menu item types\n- Customizable trigger via render props\n- Support for icons and badges\n- Flexible positioning\n- Multi-select capabilities with checkboxes\n- Single-select capabilities with radio buttons',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Base: Story = {
  render: (args) => {
    return (
      <Dropdown {...args}>
        <Dropdown.Trigger label="Dropdown" />
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => alert('click')}>
            Dropdown Item
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

export const Hover: Story = {
  render: () => {
    return (
      <Dropdown isTriggerHovered={true}>
        <Dropdown.Trigger label="Dropdown" />
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => alert('click')}>
            Dropdown Item
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

export const MenuGroup: Story = {
  render: () => {
    return (
      <Dropdown>
        <Dropdown.Trigger label="Dropdown" />
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => alert('click')}>
            Dropdown Item
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.MenuGroup label="Title label">
            <Dropdown.Item>Dropdown Item</Dropdown.Item>
            <Dropdown.Item>Dropdown Item</Dropdown.Item>
          </Dropdown.MenuGroup>
          <Dropdown.Separator />
          <Dropdown.MenuGroup label="Title label">
            <Dropdown.Item>Dropdown Item</Dropdown.Item>
            <Dropdown.Item>Dropdown Item</Dropdown.Item>
          </Dropdown.MenuGroup>
          <Dropdown.Separator />
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '`Dropdown.MenuGroup` is used when we need to have different sections. It accepts a prop `label` ',
      },
    },
  },
};

export const ActionMenu: Story = {
  render: () => {
    return (
      <Dropdown>
        <Dropdown.Trigger label="Action menu" />
        <Dropdown.Menu>
          <Dropdown.Item icon={<IconEdit />} onClick={() => alert('edit')}>
            Edit
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item icon={<IconCopy />} onClick={() => alert('copy')}>
            Copy
          </Dropdown.Item>
          <Dropdown.Item icon={<IconCut />} onClick={() => alert('cut')}>
            Cut
          </Dropdown.Item>
          <Dropdown.Item icon={<IconPrint />} onClick={() => alert('print')}>
            Print
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item icon={<IconDelete />} onClick={() => alert('delete')}>
            Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Dropdown.Trigger accepts a prop `icon`',
      },
    },
  },
};

export const CheckboxGroup: Story = {
  render: () => {
    const [selectedCheckboxes, setSelectedCheckboxes] = useState<
      (string | number)[]
    >([]);

    const handleMultiCheckbox = (value: string | number) => {
      let checked = [...selectedCheckboxes];
      const findIndex = checked.findIndex(
        (item: string | number): boolean => item === value,
      );

      if (!selectedCheckboxes.includes(value)) {
        checked = [...selectedCheckboxes, value];
      } else {
        checked = selectedCheckboxes.filter(
          (_, index: number) => index !== findIndex,
        );
      }

      setSelectedCheckboxes(checked);
    };

    const checkboxOptions = [
      { label: 'Choice 1', value: 1 },
      { label: 'Choice 2', value: 2 },
      { label: 'Choice 3', value: 3 },
    ];

    const count = selectedCheckboxes.length;

    return (
      <Dropdown>
        <Dropdown.Trigger
          label="Dropdown"
          icon={<IconFilter />}
          badgeContent={count}
        />
        <Dropdown.Menu>
          {checkboxOptions.map((option, index) => (
            <Dropdown.CheckboxItem
              key={index}
              value={option.value}
              model={selectedCheckboxes}
              onChange={() => handleMultiCheckbox(option.value)}
            >
              {option.label}
            </Dropdown.CheckboxItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

export const RadioGroup: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');

    const handleOnChangeRadio = (value: string) => {
      setValue(value);
    };

    const radioOptions = [
      {
        label: 'Classe préparatoire',
        value: 'CP',
      },
      {
        label: 'Cours élémentaire 1',
        value: 'CM1',
      },
      {
        label: 'Cours élémentaire 2',
        value: 'CM2',
      },
    ];

    return (
      <Dropdown>
        <Dropdown.Trigger label="Dropdown" icon={<IconFilter />} />
        <Dropdown.Menu>
          {radioOptions.map((option, index) => (
            <Dropdown.RadioItem
              key={index}
              value={option.value}
              model={value}
              onChange={() => handleOnChangeRadio(option.value)}
            >
              {option.label}
            </Dropdown.RadioItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

export const Stack: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    const [selectedCheckboxes, setSelectedCheckboxes] = useState<
      (string | number)[]
    >([]);

    const handleOnChangeRadio = (value: string) => {
      setValue(value);
    };

    const handleMultiCheckbox = (value: string | number) => {
      let checked = [...selectedCheckboxes];
      const findIndex = checked.findIndex(
        (item: string | number): boolean => item === value,
      );

      if (!selectedCheckboxes.includes(value)) {
        checked = [...selectedCheckboxes, value];
      } else {
        checked = selectedCheckboxes.filter(
          (_, index: number) => index !== findIndex,
        );
      }

      setSelectedCheckboxes(checked);
    };

    const radioOptions = [
      {
        label: 'Classe préparatoire',
        value: 'CP',
      },
      {
        label: 'Cours élémentaire 1',
        value: 'CM1',
      },
      {
        label: 'Cours élémentaire 2',
        value: 'CM2',
      },
    ];

    const checkboxOptions = [
      { label: 'Choice 1', value: 1 },
      { label: 'Choice 2', value: 2 },
      { label: 'Choice 3', value: 3 },
    ];

    return (
      <Dropdown>
        <Dropdown.Trigger label="Dropdown" icon={<IconFilter />} />
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => console.log('click')}>
            Action label
          </Dropdown.Item>
          <Dropdown.Separator />
          {radioOptions.map((option, index) => (
            <Dropdown.RadioItem
              key={index}
              value={option.value}
              model={value}
              onChange={() => handleOnChangeRadio(option.value)}
            >
              {option.label}
            </Dropdown.RadioItem>
          ))}
          <Dropdown.Separator />
          {checkboxOptions.map((option, index) => (
            <Dropdown.CheckboxItem
              key={index}
              value={option.value}
              model={selectedCheckboxes}
              onChange={() => handleMultiCheckbox(option.value)}
            >
              {option.label}
            </Dropdown.CheckboxItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '`Dropdown` Component can accept any Dropdown Item to make your own custom dropdown',
      },
    },
  },
};

export const CustomTrigger: Story = {
  render: () => {
    return (
      <Dropdown>
        {(
          triggerProps: JSX.IntrinsicAttributes &
            Omit<IconButtonProps, 'ref'> &
            RefAttributes<HTMLButtonElement>,
        ) => (
          <>
            <IconButton
              {...triggerProps}
              type="button"
              aria-label="label"
              color="tertiary"
              variant="ghost"
              icon={<IconEdit />}
            />

            <Dropdown.Menu>
              <Dropdown.Item>Dropdown Item</Dropdown.Item>
              <Dropdown.Item>Dropdown Item</Dropdown.Item>
            </Dropdown.Menu>
          </>
        )}
      </Dropdown>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Any component can be used as a custom trigger when use as a function as children (render prop). It can access `triggerProps` to get required a11y attributes.',
      },
      source: {
        code: `<Dropdown>
        {(
          triggerProps: JSX.IntrinsicAttributes &
            Omit<IconButtonProps, 'ref'> &
            RefAttributes<HTMLButtonElement>,
        ) => (
          <>
            <IconButton
              {...triggerProps}
              type="button"
              aria-label="label"
              color="tertiary"
              variant="ghost"
              icon={<IconEdit />}
            />

            <Dropdown.Menu>
              <Dropdown.Item>Dropdown Item</Dropdown.Item>
              <Dropdown.Item>Dropdown Item</Dropdown.Item>
            </Dropdown.Menu>
          </>
        )}
      </Dropdown>`,
      },
    },
  },
};

export const CustomMenu: Story = {
  render: () => {
    const [currentColor, setCurrentColor] = useState<string>('#4A4A4A');
    const handleOnChange = (color: string) => setCurrentColor(color);
    return (
      <Dropdown>
        {(
          triggerProps: JSX.IntrinsicAttributes &
            Omit<IconButtonProps, 'ref'> &
            RefAttributes<HTMLButtonElement>,
          itemRefs,
        ) => (
          <>
            <IconButton
              {...triggerProps}
              type="button"
              aria-label="label"
              color="tertiary"
              variant="ghost"
              icon={<IconEdit />}
            />

            <Dropdown.Menu>
              <ColorPicker
                ref={(el) => (itemRefs.current['color-picker'] = el)}
                palettes={[
                  {
                    ...DefaultPalette,
                    reset: { value: 'transparent', description: 'None' },
                  },
                ]}
                model={currentColor}
                onChange={handleOnChange}
              />
            </Dropdown.Menu>
          </>
        )}
      </Dropdown>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'You can pass any Component inside `Dropdown.Menu` by exposing `itemRefs` (render prop) and adding a ref to your component `ref={(el) => (itemRefs.current[id] = el)}`',
      },
      source: {
        code: `<Dropdown>
        {(
          triggerProps: JSX.IntrinsicAttributes &
            Omit<IconButtonProps, 'ref'> &
            RefAttributes<HTMLButtonElement>,
          itemRefs,
        ) => (
          <>
            <IconButton
              {...triggerProps}
              type="button"
              aria-label="label"
              color="tertiary"
              variant="ghost"
              icon={<IconEdit />}
            />

            <Dropdown.Menu>
              <ColorPicker
                ref={(el) => (itemRefs.current['color-picker'] = el)}
                palettes={[
                  {
                    ...DefaultPalette,
                    reset: { value: 'transparent', description: 'None' },
                  },
                ]}
                model={currentColor}
                onChange={handleOnChange}
              />
            </Dropdown.Menu>
          </>
        )}
      </Dropdown>`,
      },
    },
  },
};

interface CityOption {
  id: string;
  name: string;
}

const cities: CityOption[] = Array.from({ length: 6800 }, (_, index) => ({
  id: String(index),
  name: `Établissement ${String(index + 1).padStart(4, '0')}`,
}));

export const VirtualizedSearchableSelect: Story = {
  render: () => {
    const [selected, setSelected] = useState<CityOption | null>(null);

    return (
      <div style={{ width: 320 }}>
        <Dropdown block>
          <Dropdown.Trigger
            label={selected ? selected.name : 'Sélectionner…'}
          />
          <Dropdown.VirtualizedMenu<CityOption>
            block
            searchable
            items={cities}
            aria-label="Établissements"
            getItemKey={(item) => item.id}
            getItemText={(item) => item.name}
            searchPlaceholder="Rechercher un établissement…"
            onSelect={(item) => setSelected(item)}
            renderItem={(item, { active }) => (
              <div className={`dropdown-item ${active ? 'focus' : ''}`}>
                {item.name}
              </div>
            )}
          />
        </Dropdown>
      </div>
    );
  },

  parameters: {
    docs: {
      description: {
        story: `**\`Dropdown.VirtualizedMenu\`** renders a long option list with windowing: only the visible rows (plus a small overscan) are mounted, so the DOM node count — and therefore performance — stays constant whether the list has 50 or 50 000 options.

### When to use it

Use it instead of \`Dropdown.Menu\` when the number of options is large enough to make a plain menu sluggish (roughly a few hundred and up: long pickers of users, schools, classes, tags…). For small, static menus keep the regular compound API (\`Dropdown.Menu\` + \`Dropdown.Item\`): it is simpler and supports rich item types (checkboxes, groups, separators).

### Normal vs virtualized

The switch is **not automatic** for the Dropdown: you opt in by choosing the component. \`Dropdown.Menu\` renders the children you pass; \`Dropdown.VirtualizedMenu\` is data-driven — you give it the \`items\` array and a \`renderItem\` function, and it owns the rendering so it can mount only what is visible. (The \`Table\` component, by contrast, switches to virtualization automatically past a threshold.)

### Data & rendering

- \`items\`: the full array of options (any shape).
- \`renderItem(item, { index, active })\`: returns the content of one option. \`active\` is \`true\` for the option currently highlighted by keyboard or hover — use it to style the highlight (here, the \`focus\` class).
- \`getItemKey(item, index)\`: stable React key (defaults to the index).
- \`onSelect(item, index)\`: called when an option is chosen by click or Enter. By default the menu closes afterwards (\`closeOnSelect\`, default \`true\`).

### Integrated search (combobox)

- \`searchable\`: adds a search field at the top of the panel. Focus stays in the field (combobox pattern) while the arrow keys drive the list below.
- \`getItemText(item)\`: the text each option is matched against — required for the built-in filtering.
- \`searchPlaceholder\` / \`noResultsLabel\`: field placeholder and empty-state message.
- \`onSearch(query)\`: notified on every query change (e.g. to fetch remotely). Without \`searchable\`, no field is shown and the whole list is browsable.

### Keyboard & accessibility

Arrow Up/Down move the active option, Home/End jump to the ends, Enter selects, Escape/Tab close. The active option is always scrolled into view. Roles \`listbox\`/\`option\`, \`aria-selected\` and \`aria-activedescendant\` are wired up; with \`searchable\`, the field is a \`combobox\` controlling the listbox.

### Sizing & tuning

- \`maxHeight\` (px): height of the scroll area (default \`320\`).
- \`estimateItemHeight\` (px): first guess before each row is measured; rows are then measured dynamically, so variable heights are supported. A good estimate just reduces the initial scrollbar jump.
- \`overscan\`: number of off-screen rows kept mounted on each side to smooth fast scrolling.
- \`block\`: makes the panel take the full trigger width; \`unstyled\` drops the default panel styling.

The example below is a single-select over ~6 800 options with integrated search.`,
      },
    },
  },
};
