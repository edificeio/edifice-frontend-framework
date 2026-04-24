import React, { useState } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import AppHeader from '../AppHeader/AppHeader';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import { Button } from '../Button';
import PageLayout from './PageLayout';

const blogApp = {
  address: '/blog',
  icon: '',
  name: '',
  scope: [],
  display: false,
  displayName: 'Blog',
  isExternal: false,
};

const meta: Meta<typeof PageLayout> = {
  title: 'Components/PageLayout',
  component: PageLayout,
  parameters: {
    docs: {
      description: {
        component:
          'PageLayout is a compound component for page layouts with optional sidebars and breadcrumb. Supports "centered" (default) and "fullpage" variants.',
      },
    },
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ marginTop: '-1.2rem' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PageLayout>;

const appHeaderExample = (
  <div style={{ overflow: 'hidden' }}>
    <AppHeader render={() => <Button>Action</Button>}>
      <Breadcrumb app={blogApp} name="Mon article" />
    </AppHeader>
  </div>
);

// ==========================================================================
// Helpers visuels — couleur de colonne vs couleur interne
// La couleur de colonne apparaît dans la zone de padding.
// La couleur interne remplit la zone de contenu.
// ==========================================================================

const colColors = {
  sidebarLeft: { col: '#c8d3fe', inner: '#f5f7ff' },
  content: { col: '#ffe5a3', inner: '#fefaec' },
  sidebarRight: { col: '#bdf0d5', inner: '#f2fcf7' },
};

const colStyle = (
  key: keyof typeof colColors,
  extra?: React.CSSProperties,
): React.CSSProperties => ({
  background: colColors[key].col,
  minHeight: '300px',
  ...extra,
});

const innerStyle = (
  key: keyof typeof colColors,
  extra?: React.CSSProperties,
): React.CSSProperties => ({
  background: colColors[key].inner,
  height: '100%',
  minHeight: '300px',
  display: 'flex',
  alignItems: 'flex-start',
  paddingTop: '12px',
  paddingLeft: '8px',
  fontSize: '12px',
  fontFamily: 'monospace',
  color: 'rgba(0,0,0,0.45)',
  boxSizing: 'border-box',
  ...extra,
});

// ==========================================================================
// Centered variant (default)
// ==========================================================================

export const Base: Story = {
  render: (args) => (
    <PageLayout {...args}>
      <PageLayout.Header />
      <PageLayout.Content style={colStyle('content')}>
        <div style={innerStyle('content')}>Content only</div>
      </PageLayout.Content>
    </PageLayout>
  ),
};

export const WithBreadcrumb: Story = {
  render: (args) => (
    <PageLayout {...args}>
      <PageLayout.Header />
      <PageLayout.Breadcrumb>{appHeaderExample}</PageLayout.Breadcrumb>
      <PageLayout.Content style={colStyle('content')}>
        <div style={innerStyle('content')}>Content with breadcrumb</div>
      </PageLayout.Content>
    </PageLayout>
  ),
};

export const WithLeftSidebarOnly: Story = {
  render: (args) => (
    <PageLayout {...args}>
      <PageLayout.Header />
      <PageLayout.Breadcrumb>{appHeaderExample}</PageLayout.Breadcrumb>
      <PageLayout.SidebarLeft style={colStyle('sidebarLeft')}>
        <div style={innerStyle('sidebarLeft')}>Sidebar Left (33%)</div>
      </PageLayout.SidebarLeft>
      <PageLayout.Content style={colStyle('content')}>
        <div style={innerStyle('content')}>Content (66%)</div>
      </PageLayout.Content>
    </PageLayout>
  ),
};

export const WithRightSidebarOnly: Story = {
  render: (args) => (
    <PageLayout {...args}>
      <PageLayout.Header />
      <PageLayout.Breadcrumb>{appHeaderExample}</PageLayout.Breadcrumb>
      <PageLayout.Content style={colStyle('content')}>
        <div style={innerStyle('content')}>Content (66%)</div>
      </PageLayout.Content>
      <PageLayout.SidebarRight style={colStyle('sidebarRight')}>
        <div style={innerStyle('sidebarRight')}>Sidebar Right (33%)</div>
      </PageLayout.SidebarRight>
    </PageLayout>
  ),
};

export const WithBothSidebars: Story = {
  render: (args) => (
    <PageLayout {...args}>
      <PageLayout.Header />
      <PageLayout.Breadcrumb>{appHeaderExample}</PageLayout.Breadcrumb>
      <PageLayout.SidebarLeft style={colStyle('sidebarLeft')}>
        <div style={innerStyle('sidebarLeft')}>Sidebar Left (25%)</div>
      </PageLayout.SidebarLeft>
      <PageLayout.Content style={colStyle('content')}>
        <div style={innerStyle('content')}>Content (50%)</div>
      </PageLayout.Content>
      <PageLayout.SidebarRight style={colStyle('sidebarRight')}>
        <div style={innerStyle('sidebarRight')}>Sidebar Right (25%)</div>
      </PageLayout.SidebarRight>
    </PageLayout>
  ),
};

export const NoPaddingContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Content (66%) sans padding — cas liste. La couleur de colonne est visible dans la zone de padding de la sidebar. Sans padding, le fond interne du content touche directement les bords.',
      },
    },
  },
  render: (args) => (
    <PageLayout noPadding={{ content: true }} {...args}>
      <PageLayout.Header />
      <PageLayout.Breadcrumb>{appHeaderExample}</PageLayout.Breadcrumb>
      <PageLayout.SidebarLeft style={colStyle('sidebarLeft')}>
        <div style={innerStyle('sidebarLeft')}>
          sidebar-left · padding: 2.4rem
        </div>
      </PageLayout.SidebarLeft>
      <PageLayout.Content style={colStyle('content')}>
        <div style={innerStyle('content')}>content · noPadding</div>
      </PageLayout.Content>
    </PageLayout>
  ),
};

export const NoPaddingAll: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Toutes les colonnes sans padding — le fond interne touche les bords de chaque colonne.',
      },
    },
  },
  render: (args) => (
    <PageLayout
      noPadding={{ sidebarLeft: true, content: true, sidebarRight: true }}
      {...args}
    >
      <PageLayout.Header />
      <PageLayout.Breadcrumb>{appHeaderExample}</PageLayout.Breadcrumb>
      <PageLayout.SidebarLeft style={colStyle('sidebarLeft')}>
        <div style={innerStyle('sidebarLeft')}>sidebar-left · noPadding</div>
      </PageLayout.SidebarLeft>
      <PageLayout.Content style={colStyle('content')}>
        <div style={innerStyle('content')}>content · noPadding</div>
      </PageLayout.Content>
      <PageLayout.SidebarRight style={colStyle('sidebarRight')}>
        <div style={innerStyle('sidebarRight')}>sidebar-right · noPadding</div>
      </PageLayout.SidebarRight>
    </PageLayout>
  ),
};

export const WithGap: Story = {
  render: (args) => (
    <PageLayout withGap {...args}>
      <PageLayout.Header />
      <PageLayout.Breadcrumb>{appHeaderExample}</PageLayout.Breadcrumb>
      <PageLayout.SidebarLeft style={colStyle('sidebarLeft')}>
        <div style={innerStyle('sidebarLeft')}>Sidebar Left</div>
      </PageLayout.SidebarLeft>
      <PageLayout.Content style={colStyle('content')}>
        <div style={innerStyle('content')}>Content (no gap)</div>
      </PageLayout.Content>
      <PageLayout.SidebarRight style={colStyle('sidebarRight')}>
        <div style={innerStyle('sidebarRight')}>Sidebar Right</div>
      </PageLayout.SidebarRight>
    </PageLayout>
  ),
};

// ==========================================================================
// Fullpage variant
// ==========================================================================

export const FullpageWithBothSidebars: Story = {
  render: () => (
    <PageLayout variant="fullpage">
      <PageLayout.Header />
      <PageLayout.Breadcrumb>{appHeaderExample}</PageLayout.Breadcrumb>
      <PageLayout.SidebarLeft style={colStyle('sidebarLeft')}>
        <div style={innerStyle('sidebarLeft')}>Sidebar Left (edge-to-edge)</div>
      </PageLayout.SidebarLeft>
      <PageLayout.Content style={colStyle('content')}>
        <div style={innerStyle('content')}>Content</div>
      </PageLayout.Content>
      <PageLayout.SidebarRight style={colStyle('sidebarRight')}>
        <div style={innerStyle('sidebarRight')}>
          Sidebar Right (edge-to-edge)
        </div>
      </PageLayout.SidebarRight>
    </PageLayout>
  ),
};

export const FullpageWithLeftSidebarOnly: Story = {
  render: () => (
    <PageLayout variant="fullpage">
      <PageLayout.Header />
      <PageLayout.Breadcrumb>{appHeaderExample}</PageLayout.Breadcrumb>
      <PageLayout.SidebarLeft style={colStyle('sidebarLeft')}>
        <div style={innerStyle('sidebarLeft')}>Sidebar Left (edge-to-edge)</div>
      </PageLayout.SidebarLeft>
      <PageLayout.Content style={colStyle('content')}>
        <div style={innerStyle('content')}>Content</div>
      </PageLayout.Content>
    </PageLayout>
  ),
};

// ==========================================================================
// Dynamic right sidebar injection (fullpage)
// ==========================================================================

export const FullpageDynamicRightSidebar: Story = {
  render: () => {
    const [showRight, setShowRight] = useState(false);

    return (
      <PageLayout variant="fullpage">
        <PageLayout.Header />
        <PageLayout.Breadcrumb>{appHeaderExample}</PageLayout.Breadcrumb>
        <PageLayout.SidebarLeft style={colStyle('sidebarLeft')}>
          <div style={innerStyle('sidebarLeft')}>Sidebar Left</div>
        </PageLayout.SidebarLeft>
        <PageLayout.Content style={colStyle('content')}>
          <div style={innerStyle('content')}>
            <Button onClick={() => setShowRight((prev) => !prev)}>
              {showRight ? 'Masquer' : 'Afficher'} la sidebar droite
            </Button>
          </div>
        </PageLayout.Content>
        {showRight && (
          <PageLayout.SidebarRight style={colStyle('sidebarRight')}>
            <div style={innerStyle('sidebarRight')}>
              Sidebar Right (injectée dynamiquement)
            </div>
          </PageLayout.SidebarRight>
        )}
      </PageLayout>
    );
  },
};

// ==========================================================================
// Overlay
// ==========================================================================

export const OverlayWithoutBackdrop: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <PageLayout {...args}>
        <PageLayout.Header />
        <PageLayout.Breadcrumb>{appHeaderExample}</PageLayout.Breadcrumb>
        <PageLayout.SidebarLeft style={colStyle('sidebarLeft')}>
          <div style={innerStyle('sidebarLeft')}>Sidebar Left</div>
        </PageLayout.SidebarLeft>
        <PageLayout.Content style={colStyle('content')}>
          <div style={innerStyle('content')}>
            <Button onClick={() => setOpen(true)}>Ouvrir le panneau</Button>
          </div>
        </PageLayout.Content>
        <PageLayout.SidebarRight style={colStyle('sidebarRight')}>
          <div style={innerStyle('sidebarRight')}>Sidebar Right</div>
        </PageLayout.SidebarRight>
        <PageLayout.Overlay open={open} onClose={() => setOpen(false)}>
          <div style={{ padding: '24px' }}>
            <h2>Panneau latéral</h2>
            <p>Contenu dynamique de l&apos;overlay.</p>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fermer
            </Button>
          </div>
        </PageLayout.Overlay>
      </PageLayout>
    );
  },
};

export const OverlayWithBackdrop: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <PageLayout {...args}>
        <PageLayout.Header />
        <PageLayout.Breadcrumb>{appHeaderExample}</PageLayout.Breadcrumb>
        <PageLayout.SidebarLeft style={colStyle('sidebarLeft')}>
          <div style={innerStyle('sidebarLeft')}>Sidebar Left</div>
        </PageLayout.SidebarLeft>
        <PageLayout.Content style={colStyle('content')}>
          <div style={innerStyle('content')}>
            <Button onClick={() => setOpen(true)}>
              Ouvrir le panneau (avec backdrop)
            </Button>
          </div>
        </PageLayout.Content>
        <PageLayout.SidebarRight style={colStyle('sidebarRight')}>
          <div style={innerStyle('sidebarRight')}>Sidebar Right</div>
        </PageLayout.SidebarRight>
        <PageLayout.Overlay open={open} onClose={() => setOpen(false)} backdrop>
          <div style={{ padding: '24px' }}>
            <h2>Panneau latéral</h2>
            <p>Avec backdrop — cliquez en dehors pour fermer.</p>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fermer
            </Button>
          </div>
        </PageLayout.Overlay>
      </PageLayout>
    );
  },
};

// ==========================================================================
// Scroll modes
// ==========================================================================

export const ScrollModeColumns: Story = {
  decorators: [
    (Story) => (
      <div style={{ marginBottom: '-1.2rem' }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <PageLayout {...args} scrollMode="columns">
      <PageLayout.Header />
      <PageLayout.Breadcrumb>{appHeaderExample}</PageLayout.Breadcrumb>
      <PageLayout.SidebarLeft style={colStyle('sidebarLeft')}>
        <div style={innerStyle('sidebarLeft', { minHeight: '150vh' })}>
          Sidebar Left — scroll indépendant
        </div>
      </PageLayout.SidebarLeft>
      <PageLayout.Content style={colStyle('content')}>
        <div style={innerStyle('content', { minHeight: '200vh' })}>
          Content — scroll indépendant
        </div>
      </PageLayout.Content>
      <PageLayout.SidebarRight style={colStyle('sidebarRight')}>
        <div style={innerStyle('sidebarRight', { minHeight: '100vh' })}>
          Sidebar Right — scroll indépendant
        </div>
      </PageLayout.SidebarRight>
    </PageLayout>
  ),
};

export const ScrollModePage: Story = {
  render: (args) => (
    <PageLayout {...args} scrollMode="page">
      <PageLayout.Header />
      <PageLayout.Breadcrumb>{appHeaderExample}</PageLayout.Breadcrumb>
      <PageLayout.SidebarLeft style={colStyle('sidebarLeft')}>
        <div style={innerStyle('sidebarLeft')}>Sidebar Left</div>
      </PageLayout.SidebarLeft>
      <PageLayout.Content style={colStyle('content')}>
        <div style={innerStyle('content', { minHeight: '200vh' })}>
          Content — scroll global, breadcrumb sticky
        </div>
      </PageLayout.Content>
      <PageLayout.SidebarRight style={colStyle('sidebarRight')}>
        <div style={innerStyle('sidebarRight')}>Sidebar Right</div>
      </PageLayout.SidebarRight>
    </PageLayout>
  ),
};

// ==========================================================================
// Custom header
// ==========================================================================

export const CustomHeader: Story = {
  render: (args) => (
    <PageLayout {...args}>
      <PageLayout.Header>
        <div
          style={{
            background: '#6f42c1',
            color: '#fff',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          Custom Header Content
        </div>
      </PageLayout.Header>
      <PageLayout.Content style={colStyle('content')}>
        <div style={innerStyle('content')}>
          Content with a custom header override
        </div>
      </PageLayout.Content>
    </PageLayout>
  ),
};
