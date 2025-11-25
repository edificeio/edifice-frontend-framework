import { FormEvent, useCallback, useEffect, useState } from 'react';

import { App, odeServices } from '@edifice.io/client';
/*
 * Augmented definition of a resource, until behaviours are dropped.
 * The path would otherwise be found by using `IWebResourceService.getViewUrl(resource)`
 */
import { ILinkedResource } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';

import {
  AppKeys,
  emptyScreenMapping,
} from '../../../../utilities/emptyscreen-mapping';

import { useDebounce } from '@uidotdev/usehooks';
import {
  AppIcon,
  Dropdown,
  EmptyScreen,
  SearchBar,
} from '../../../../components';
import { useResourceSearch } from '../../../../hooks/useResourceSearch';
import { useEdificeTheme } from '../../../../providers/EdificeThemeProvider/EdificeThemeProvider.hook';
import { IconApplications } from '../../../icons/components';
import LinkerCard from '../../LinkerCard/LinkerCard';

/**
 * Definition of an internal link.
 */
type ApplicationOption = {
  /** Icon to display */
  icon?: JSX.Element;
  /** Application code */
  application: string;
  /** Display name */
  displayName: string;
};

/**
 * Properties for the InternalLinker react component.
 */
export interface InternalLinkerProps {
  /** Currently running application */
  appCode: App;
  /** When defined, preloads and displays this type of resources. */
  defaultAppCode?: App | null;
  /** When defined, selects this resource (defaultApp must be specified) */
  defaultResourceId?: string | null;
  /** Notify when the user selects an application in the dropdown */
  onChange?: (application?: ApplicationOption) => void;
  /** Notify when resources selection changes */
  onSelect?: (resources: ILinkedResource[]) => void;
  /** Whether to allow multiple resources selection */
  multiple: boolean | undefined;
  /** List of resources to display */
  resourceList?: ILinkedResource[];
  /** List of applications to display */
  applicationList?: ApplicationOption[];
  /** Whether to show the application selector */
  showApplicationSelector?: boolean;
  /** Optional callback to filter resources after loading. Applied in addition to search filters. */
  resourceFilter?: (resource: ILinkedResource) => boolean;
}

export const InternalLinker = ({
  appCode,
  defaultAppCode,
  defaultResourceId,
  onChange,
  onSelect,
  multiple = true,
  resourceList,
  applicationList,
  showApplicationSelector = true,
  resourceFilter,
}: InternalLinkerProps) => {
  const { t } = useTranslation();
  const { theme } = useEdificeTheme();

  // Get available applications, and a function to load their resources.
  // Pass the resourceFilter to enable custom filtering of loaded resources
  const { resourceApplications, loadResources } = useResourceSearch(appCode);

  // List of options (applications with name and icon) to display, for the user to choose.
  const [options, setOptions] = useState<Array<ApplicationOption>>();
  // User selected application
  const [selectedApplication, setSelectedApplication] = useState<
    ApplicationOption | undefined
  >();
  // User search terms (typed in an input) and its debounced equivalent.
  const [searchTerms, setSearchTerms] = useState<string | undefined>();
  const debounceSearch = useDebounce<string>(searchTerms || '', 500);

  // List of resources to display.
  const [resources, setResources] = useState<ILinkedResource[] | undefined>([]);
  // Function to filter resources based on search terms.
  const filterResources = useCallback(
    (resource: ILinkedResource, search?: string) => {
      if (!search) return true;
      const searchParam = search?.toLowerCase() || '';
      return (
        resource.name?.toLowerCase().includes(searchParam) ||
        resource.creatorName?.toLowerCase().includes(searchParam) ||
        resource.description?.toLowerCase().includes(searchParam)
      );
    },
    [],
  );
  // Function to sort resources by modified date.
  const sortResources = useCallback((resources: ILinkedResource[]) => {
    return resources.sort((a, b) => (a.modifiedAt < b.modifiedAt ? 1 : -1));
  }, []);
  // Function to load and display resources of the currently selected application.
  const loadAndDisplayResources = useCallback(
    (search?: string) => {
      async function load() {
        // If resources are provided, use them directly.
        if (resourceList) {
          // Filter resources based on search terms and optional custom filter
          let filteredResources = resourceList.filter((resource) =>
            filterResources(resource, search),
          );

          // Apply additional custom resource filter if provided
          if (resourceFilter) {
            filteredResources = filteredResources.filter(resourceFilter);
          }

          setResources(sortResources(filteredResources));
          return;
        } else if (selectedApplication) {
          // Otherwise, load resources from the currently selected application.
          try {
            // Load resources from the currently selected application.
            // Note: resourceFilter is already applied in useResourceSearch hook
            let resources = (
              await loadResources({
                application: selectedApplication.application,
                search,
                types: [selectedApplication.application],
                filters: {},
                pagination: { startIdx: 0, pageSize: 300 }, // ignored at the moment
              })
            ).filter((resource) => filterResources(resource, search));
            // Apply additional custom resource filter if provided
            if (resourceFilter) {
              resources = resources.filter(resourceFilter);
            }
            // Sort resources by modified date before displaying them
            setResources(sortResources(resources));
            return; // end here
          } catch {
            // continue on error
          }
        }
        setResources([]);
      }
      load();
    },
    [
      loadResources,
      selectedApplication,
      filterResources,
      sortResources,
      resourceList,
      resourceFilter,
    ],
  );

  // List of selected documents
  const [selectedDocuments, setSelectedDocuments] = useState<ILinkedResource[]>(
    [],
  );

  // Notify parent when an application is selected.
  const handleOptionClick = (option: ApplicationOption) => {
    onChange?.(option);
    setSelectedApplication(option);
  };

  // Handle search input events (and debounce)
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    setSearchTerms(newText.toString());
  };
  const handleSubmit = useCallback(
    (event: FormEvent) => {
      loadAndDisplayResources(searchTerms);
      event.stopPropagation();
      event.preventDefault();
    },
    [loadAndDisplayResources, searchTerms],
  );

  /**
   * Check if a resource is selected.
   * @returns its index in selectedDocuments, or -1 if not selected.
   */
  const getSelectedResourceIndex = useCallback(
    (resourceId: string) => {
      return selectedDocuments.findIndex(
        (selectedDocument) => selectedDocument.assetId === resourceId,
      );
    },
    [selectedDocuments],
  );

  // Select a resource.
  const selectResource = useCallback(
    (resource: ILinkedResource) => {
      if (multiple) {
        // Add this resource to the previous selected ones.
        setSelectedDocuments((previousState) => [...previousState, resource]);
      } else {
        // Replace previous selection by this resource.
        setSelectedDocuments([resource]);
      }
    },
    [setSelectedDocuments, multiple],
  );

  // Handle [de-]selection of a resource by the user.
  const toggleResourceSelection = useCallback(
    (resource: ILinkedResource) => {
      const index = getSelectedResourceIndex(resource.assetId);
      if (index < 0) {
        selectResource(resource);
      } else {
        // De-select resource (clicked twice)
        setSelectedDocuments(
          selectedDocuments.filter((_value, i) => i !== index),
        );
      }
    },
    [getSelectedResourceIndex, selectResource, selectedDocuments],
  );

  // Update dropdown when available applications list is updated.
  useEffect(() => {
    (async () => {
      // If applications are provided, use them directly.
      if (applicationList) {
        setOptions(
          applicationList.sort((app1, app2) =>
            app1.displayName.localeCompare(app2.displayName),
          ),
        );
        return;
      }
      // Otherwise, load applications from the resource search.
      const appPromises = resourceApplications.map((application) =>
        odeServices.session().getWebApp(application),
      );
      // Wait for all promises to resolve.
      const webApps = await Promise.all(appPromises);

      const opts = resourceApplications
        .map((application, index) => {
          let displayName = webApps[index]?.displayName ?? application;
          if (application === 'exercizer') {
            displayName = 'bbm.linker.int.app.exercizer';
          } else if (application === 'formulaire') {
            displayName = 'bbm.linker.int.app.forms';
          }
          return {
            application,
            displayName: t(displayName ?? application),
            icon: <AppIcon app={webApps[index]} size="24" />,
          } as ApplicationOption;
        })
        .sort((a, b) => a.displayName.localeCompare(b.displayName));

      setOptions(opts);
    })();
  }, [resourceApplications, t, applicationList]);

  // Load and display search results when debounce is over
  useEffect(() => {
    loadAndDisplayResources(debounceSearch);
  }, [loadAndDisplayResources, debounceSearch]);

  // Notify parent when resources selection changes.
  useEffect(() => {
    onSelect?.(selectedDocuments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDocuments]);

  // Preselect default option and load associated resources, if specified.
  useEffect(() => {
    // If defaultAppCode is not provided, and there is only one application, use it.
    const safeDefaultAppCode =
      defaultAppCode ??
      (applicationList?.length === 1 && applicationList?.[0]?.application);
    if (safeDefaultAppCode) {
      const option = options?.find(
        (option) => safeDefaultAppCode === option.application,
      );
      setSelectedApplication(option);
      loadAndDisplayResources('');
    }
    /* Note : when options changes, `defaultAppCode` and `loadAndDisplayResources` are
     * already set at a correct value. So we remove them from the dependency array,
     * otherwise they will provoke side effects forbiding user from changing the selected app.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, defaultAppCode]);

  // Preselect default resource, if specified.
  useEffect(() => {
    if (defaultResourceId && getSelectedResourceIndex(defaultResourceId) < 0) {
      const resource = resources?.find(
        (resource) => defaultResourceId === resource.assetId,
      );
      resource && selectResource(resource);
    }
    /* Note : when resources changes, `defaultResourceId`, `getSelectedResourceIndex`
     * and `selectResource` are already set at a correct value.
     * So we remove them from the dependency array, otherwise they will provoke side effects
     * forbiding user from changing the selected resources.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resources]);

  return (
    <div className="d-flex flex-column flex-fill overflow-hidden">
      <div className="search d-flex bg-light rounded-top border border-bottom-0">
        {showApplicationSelector && (
          <div className="flex-shrink-1 px-8 py-12 border-end">
            <Dropdown overflow>
              <Dropdown.Trigger
                icon={
                  <div className="pe-8">
                    {selectedApplication?.icon || <IconApplications />}
                  </div>
                }
                label={
                  <span className="d-md-inline d-sm-none">
                    {' '}
                    {t(
                      selectedApplication?.displayName ||
                        'bbm.linker.int.choose',
                    )}
                  </span>
                }
                variant="ghost"
                size="md"
              />
              <Dropdown.Menu>
                {options?.map((option) => (
                  <Dropdown.Item
                    key={option.application}
                    icon={option.icon}
                    onClick={() => handleOptionClick(option)}
                  >
                    {option.displayName}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}
        <div className="flex-grow-1 align-self-center">
          <form
            className="gap-16 d-flex w-100 align-items-center px-16 py-8"
            onSubmit={handleSubmit}
          >
            <SearchBar
              isVariant
              placeholder={t('search')}
              size="lg"
              className="w-100"
              disabled={selectedApplication ? false : true}
              onChange={handleSearchChange}
            />
          </form>
        </div>
      </div>

      <div className="internal-linker flex-grow-1 w-100 rounded-bottom border gap-0 overflow-auto">
        {selectedApplication && resources && resources.length > 0 && (
          <div>
            {resources.map((resource) => {
              const isSelected =
                selectedDocuments.findIndex(
                  (doc) => doc.assetId === resource.assetId,
                ) >= 0;
              return (
                <LinkerCard
                  key={resource.path}
                  doc={resource}
                  isSelected={isSelected}
                  onClick={() => toggleResourceSelection(resource)}
                />
              );
            })}
          </div>
        )}

        {selectedApplication && resources && resources.length <= 0 && (
          <div className="d-flex justify-content-center mt-16">
            <EmptyScreen
              imageSrc={
                emptyScreenMapping[
                  (theme?.bootstrapVersion as 'one' | 'neo') ?? 'one'
                ][selectedApplication?.application as AppKeys]
              }
              text={t('bbm.linker.int.notfound')}
              className="mt-16"
            />
          </div>
        )}

        {!selectedApplication && (
          <div className="d-flex justify-content-center mt-32">
            <EmptyScreen
              imageSrc={
                emptyScreenMapping[
                  (theme?.bootstrapVersion as 'one' | 'neo') ?? 'one'
                ]['empty']
              }
              text={t('bbm.linker.int.empty')}
              className="mt-32"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InternalLinker;
