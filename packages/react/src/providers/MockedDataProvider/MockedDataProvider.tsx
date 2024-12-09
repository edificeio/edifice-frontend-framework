import { createContext, type ReactNode, useContext, useMemo } from 'react';

import {
  App,
  GetContextParameters,
  IResource,
  ResourceType,
  WorkspaceElement,
} from '@edifice.io/ts-client';

export interface MockedDataProps {
  children: ReactNode;
  mocks: {
    /** Current app code */
    app?: App;
    /** User's granted workflow rights */
    workflows?: string[];
    /** List of pseudo-documents from workspace. */
    workspaceDocuments?: WorkspaceElement[];
    /** List of available apps. */
    availableApps?: App[];
    /** List of pseudo-IResource by type. */
    appResources?: { [resourceType: ResourceType]: IResource[] };
  };
}

export interface MockedContextProps {
  app?: App;
  availableApps?: Promise<App[]>;
  hasWorkflow?: (workflow: string) => Promise<boolean>;
  listWorkspaceDocuments?: () => Promise<WorkspaceElement[]>;
  loadResources?: (filters: GetContextParameters) => Promise<IResource[]>;
}

const MockedDataContext = createContext<MockedContextProps | null>(null!);

export function MockedDataProvider({ children, mocks }: MockedDataProps) {
  const values = useMemo<MockedContextProps>(() => {
    const value: MockedContextProps = {};

    if (typeof mocks.app !== 'undefined') {
      value.app = mocks.app;
    }

    if (Array.isArray(mocks.availableApps)) {
      value.availableApps = Promise.resolve(mocks.availableApps);
    }

    if (typeof mocks.workflows !== 'undefined') {
      value.hasWorkflow = async (workflow) =>
        mocks.workflows?.findIndex((w) => w === workflow) !== -1;
    }

    if (mocks.workspaceDocuments) {
      value.listWorkspaceDocuments = async () => mocks.workspaceDocuments ?? [];
    }

    if (mocks.appResources) {
      value.loadResources = async (filters: GetContextParameters) =>
        mocks.appResources?.[filters.types[0]]?.filter(() => {
          // TODO pseudo-filter
          if (filters) {
            console.log(filters.search || 'none');
          }
          return true;
        }) || [];
    }

    return value;
  }, [mocks]);

  return (
    <MockedDataContext.Provider value={values}>
      {children}
    </MockedDataContext.Provider>
  );
}

export function useMockedData() {
  const context = useContext(MockedDataContext);
  // Do not raise an exception here if context is null :
  // - In production, hooks and services will be outside of a mocked data context.
  // - In documentation on StoryBook, a mocked data context may exist.
  return context;
}
