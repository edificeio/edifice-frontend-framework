import { useState } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import RadioCard, { RadioCardProps } from './RadioCard';
import { Flex } from '../Flex';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export

const meta: Meta<typeof RadioCard> = {
  title: 'Forms/RadioCard',
  component: RadioCard,
  args: {
    value: '',
    model: '',
    onChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        component:
          'RadioCard is a radio button presented as a card, displaying a name and a description for a single, more visual selection than a classic radio button.',
      },
    },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export default meta;
type Story = StoryObj<typeof RadioCard>;

export const Base: Story = {
  render: (args: RadioCardProps) => {
    const [selectedValue, setSelectedValue] = useState<string>('CP');

    const handleChange = ({
      target: { value },
    }: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedValue(value);
    };

    const options = [
      {
        title: 'Classe préparatoire',
        value: 'CP',
        content:
          "Première année du cycle primaire, axée sur l'apprentissage de la lecture, de l'écriture et des bases en mathématiques.",
      },
      {
        title: 'Cours élémentaire 1',
        value: 'CM1',
        content:
          'Avant-dernière année du primaire, où les élèves approfondissent leurs connaissances fondamentales et développent leur autonomie.',
      },
      {
        title: 'Cours élémentaire 2',
        value: 'CM2',
        content:
          "Dernière année du primaire, préparant les élèves à l'entrée au collège avec un renforcement des acquis scolaires.",
      },
    ];

    return (
      <div>
        <div className="align-items-center">
          <Flex direction="column" fill>
            {options.map((option, index) => (
              <RadioCard
                key={index}
                value={option.value}
                selectedValue={selectedValue}
                onChange={handleChange}
              >
                <RadioCard.Title>{option.title}</RadioCard.Title>
                <RadioCard.Content>
                  <p className="px-24 text-gray-700 pe-32">{option.content}</p>
                </RadioCard.Content>
              </RadioCard>
            ))}
          </Flex>
        </div>
        <div>Option séléctionnée : {selectedValue}</div>
      </div>
    );
  },
};
