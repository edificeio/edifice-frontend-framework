import { ShareRightActionDisplayName } from '@edifice.io/client';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ShareResources, {
  ShareOptions,
  ShareResourcesRef,
} from './ShareResources';

// Mock data for props
const mockShareOptions: ShareOptions = {
  resourceId: 'resource-1',
  resourceRights: [],
  resourceCreatorId: 'user-1',
};

const meta: Meta<typeof ShareResources> = {
  title: 'Modules/ShareResources',
  component: ShareResources,
  globals: {
    app: 'actualites',
  },
  args: {
    shareOptions: mockShareOptions,
    onSuccess: () => alert('Shared!'),
  },
};

export default meta;

type Story = StoryObj<typeof ShareResources>;

export const Default: Story = {
  render: (args, { ref }) => (
    <ShareResources {...args} ref={ref as React.Ref<ShareResourcesRef>} />
  ),
};

export const OverrideUrls: Story = {
  args: {
    shareOptions: {
      ...mockShareOptions,
      urls: {
        getResourceRights: '/actualites/api/v1/infos/ressource-1/shares',
        saveResourceRights: '/actualites/api/v1/infos/ressource-1/shares',
        getShareMapping: '/actualites/api/v1/rights/sharing',
      },
      filteredActions: ['read', 'comment'] as ShareRightActionDisplayName[],
    },
  },
  render: (args, { ref }) => (
    <ShareResources {...args} ref={ref as React.Ref<ShareResourcesRef>} />
  ),
};

export const FilterActions: Story = {
  args: {
    shareOptions: {
      ...mockShareOptions,
      filteredActions: ['read', 'comment'] as ShareRightActionDisplayName[],
    },
  },
  render: (args, { ref }) => (
    <ShareResources {...args} ref={ref as React.Ref<ShareResourcesRef>} />
  ),
};
