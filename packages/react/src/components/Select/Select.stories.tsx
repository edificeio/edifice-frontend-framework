import { Meta, StoryObj } from '@storybook/react';

import { IconListOrder } from '../../modules/icons/components';
import Select, { OptionsType } from './Select';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Select> = {
  title: 'Forms/Select',
  component: Select,
  decorators: [(Story) => <div style={{ height: '400px' }}>{Story()}</div>],
  parameters: {
    docs: {
      description: {
        component:
          'Select component for creating dropdown selection menus. Supports single and multiple selections, custom options formatting, search functionality, and disabled states. Ideal for when users need to choose one or more options from a predefined list.',
      },
    },
  },
} as Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof Select>;

const subjectAreaOptions: OptionsType[] = [
  { value: 'artActivity', label: 'Activités artistiques' },
  { value: 'readLearning', label: 'Apprentissage de la lecture' },
  { value: 'chemistry', label: 'Chimie' },
  { value: 'law', label: 'Droit' },
  { value: 'worldDiscovery', label: 'Découverte du monde' },
  { value: 'economy', label: 'Economie' },
  { value: 'mediaEducation', label: 'Education aux médias' },
  { value: 'musicEducation', label: 'Education musicale' },
  { value: 'sportEducation', label: 'Education physique et sportive' },
  { value: 'citizenshipEducation', label: 'Enseignement civique' },
  { value: 'geography', label: 'Géographie' },
  { value: 'history', label: 'Histoire' },
  { value: 'artHistory', label: 'Histoire des arts' },
  { value: 'ComputerScience', label: 'Informatique' },
  { value: 'languages', label: 'Langues' },
  { value: 'ancientLanguages', label: 'Langues anciennes' },
  { value: 'literature', label: 'Littérature' },
  { value: 'mathematics', label: 'Mathématiques' },
  { value: 'vocationalGuidance', label: 'Orientation' },
  { value: 'philosohppy', label: 'Philosophie' },
  { value: 'physics', label: 'Physique' },
  { value: 'politicalSscience', label: 'Sciences politiques' },
  { value: 'sociology', label: 'Sociologie' },
  { value: 'biology', label: 'SVT - Biologie' },
  { value: 'geology', label: 'SVT - Géologie' },
  { value: 'technology', label: 'Technologie' },
  { value: 'german', label: 'Allemand' },
  { value: 'english', label: 'Anglais' },
  { value: 'arabian', label: 'Arabe' },
  { value: 'spanish', label: 'Espagnol' },
  { value: 'french', label: 'Français' },
  { value: 'frensh', label: 'Français' },
  { value: 'italian', label: 'Italien' },
  { value: 'japanese', label: 'Japonais' },
  { value: 'mandarinChinese', label: 'Mandarin' },
  { value: 'portuguese', label: 'Portuguais' },
  { value: 'russian', label: 'Russe' },
];

export const Base: Story = {
  render: (args) => {
    const onChange = (option: OptionsType | string) => {
      console.log(option);
    };

    return (
      <Select
        onValueChange={onChange}
        options={subjectAreaOptions}
        placeholderOption={subjectAreaOptions[0].label}
      />
    );
  },
};

export const WithIcon: Story = {
  render: (args) => {
    const onChange = (option: OptionsType | string) => {
      console.log(option);
    };

    return (
      <Select
        icon={<IconListOrder />}
        onValueChange={onChange}
        options={subjectAreaOptions}
        placeholderOption={subjectAreaOptions[0].label}
      />
    );
  },
};

export const DefaultValue: Story = {
  render: (args) => {
    const onChange = (option: OptionsType | string) => {
      console.log(option);
    };

    return (
      <Select
        onValueChange={onChange}
        options={subjectAreaOptions}
        placeholderOption={subjectAreaOptions[0].label}
        defaultValue={subjectAreaOptions[3].value}
      />
    );
  },
};

export const Disabled: Story = {
  render: (args) => {
    const onChange = (option: OptionsType | string) => {
      console.log(option);
    };

    return (
      <Select
        onValueChange={onChange}
        options={subjectAreaOptions}
        placeholderOption={subjectAreaOptions[0].label}
        disabled
      />
    );
  },
};

export const Variant: Story = {
  render: (args) => {
    const onChange = (option: OptionsType | string) => {
      console.log(option);
    };

    return (
      <Select
        onValueChange={onChange}
        options={subjectAreaOptions}
        variant="ghost"
        placeholderOption={subjectAreaOptions[0].label}
      />
    );
  },
};

export const SelectSizes: Story = {
  render: (args) => {
    const onChange = (option: OptionsType | string) => {
      console.log(option);
    };

    return (
      <>
        <div className="d-flex align-items-center gap-8">
          <Select
            onValueChange={onChange}
            options={subjectAreaOptions}
            size="sm"
            placeholderOption={subjectAreaOptions[0].label}
          />
          <Select
            onValueChange={onChange}
            options={subjectAreaOptions}
            size="md"
            placeholderOption={subjectAreaOptions[0].label}
          />
          <Select
            onValueChange={onChange}
            options={subjectAreaOptions}
            size="lg"
            placeholderOption={subjectAreaOptions[0].label}
          />
        </div>
        <div className="d-flex align-items-center gap-8">
          <Select
            onValueChange={onChange}
            options={subjectAreaOptions}
            size="sm"
            variant="ghost"
            placeholderOption={subjectAreaOptions[0].label}
          />
          <Select
            onValueChange={onChange}
            options={subjectAreaOptions}
            size="md"
            variant="ghost"
            placeholderOption={subjectAreaOptions[0].label}
          />
          <Select
            onValueChange={onChange}
            options={subjectAreaOptions}
            size="lg"
            variant="ghost"
            placeholderOption={subjectAreaOptions[0].label}
          />
        </div>
      </>
    );
  },
};
