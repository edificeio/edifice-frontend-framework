import { useEffect, useState } from 'react';

import { Meta, StoryObj } from '@storybook/react';
import useDropzone from './useDropzone';

const meta: Meta<typeof useDropzone> = {
  title: 'Hooks/useDropzone',
};

export default meta;
type Story = StoryObj<typeof useDropzone>;

export const Example: Story = {
  render: (args) => {
    const {
      inputRef,
      files,
      handleOnChange,
      handleDragLeave,
      handleDragging,
      handleDrop,
    } = useDropzone();

    const [preview, setPreview] = useState<Record<string, string>>({
      name: '',
      image: '',
    });

    useEffect(() => {
      setPreview({ ...preview, name: '', image: '' });

      const file = files?.[0];
      if (!file) {
        return;
      }

      const newPreview = {
        ...preview,
        name: file.name,
        image: URL.createObjectURL(file),
      };

      setPreview(newPreview);
    }, [files]);

    return (
      <>
        <div
          className="drop-zone"
          onDragEnter={handleDragging}
          onDragOver={handleDragging}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <button onClick={() => inputRef?.current?.click()}>Parcourir</button>
          <div className="drop-wrapper">
            <span>
              Glissez-déposez un fichier depuis votre appareil ou cliquez sur
              parcourir
            </span>
          </div>
          <input
            ref={inputRef}
            type="file"
            name="attachement-input"
            id="attachement-input"
            onChange={handleOnChange}
            hidden
          />
        </div>
        <div>
          {preview.image ? (
            <img
              src={preview.image}
              alt={preview.name}
              width={200}
              height={200}
            />
          ) : null}
        </div>
      </>
    );
  },
};
