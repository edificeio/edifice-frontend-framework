import {
  Ref,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  WorkspaceElement,
  WorkspaceVisibility,
  odeServices,
} from '@edifice.io/client';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Modal,
  ModalElement,
  Tabs,
  TabsItemProps,
} from '../../../components';
import { useHasWorkflow, useHttpErrorToast } from '../../../hooks';
import {
  IconApplications,
  IconCode,
  IconFolder,
  IconGlobe,
  IconMic,
  IconRecordVideo,
  IconSmartphone,
} from '../../icons/components';
import { InnerTabs } from './innertabs';
import { ExternalLinkTabProps } from './innertabs/ExternalLink';
import {
  InternalLinkTabProps,
  InternalLinkTabResult,
} from './innertabs/InternalLink';
import { MediaLibraryContext } from './MediaLibraryContext';

//---------------------------------------------------
// Tabs parameters
//---------------------------------------------------
/** Ordered list of tabs. */
const orderedTabs = [
  'audio-capture',
  'video-capture',
  'internal-link', // Link to a shared resource (previously known as "internal linker")
  'external-link', // Link to an external website (previously known as "external linker")
  'iframe', // Framed website
  'upload', // Filesystem browser + drag'n'drop of files
  'workspace', // Media browser
  'video-embedder', // Link to a hosted video
];

/**
 * Available features exposed by tabs :
 * "workspace" | "upload" | "audio-capture" | ...
 */
export type AvailableTab = (typeof orderedTabs)[number];

/** Additional properties of tabs. */
export type MediaLibraryTabProps = {
  /**
   * Media Library types where this tab should be displayed.
   * "*" for all types.
   */
  availableFor: Array<MediaLibraryType | '*' | null>;

  /** Required checks before using this feature. */
  isEnable: null | (() => boolean);
};

// Typing for an internal or external link properties.
type AnyLinkProps = InternalLinkTabProps | ExternalLinkTabProps | undefined;

//---------------------------------------------------
// Media Library parameters
//---------------------------------------------------
/**
 * Pre-configured types of media libraries.
 * Choosing a type will filter out unwanted tabs.
 */
export type MediaLibraryType =
  /** Audio files */
  | 'audio'
  /** Video files / streams / links */
  | 'video'
  /** Image files */
  | 'image'
  /** Attached files */
  | 'attachment'
  /** Embedded websites */
  | 'embedder'
  /** Hyperlinks */
  | 'hyperlink'
  /** Studio mode for recording audio and video */
  | 'studio';

type MediaLibraryTypeOptions = {
  /** I18n key describing this MediaLibrary type. */
  title: string;
  /** Default tab to display. */
  defaultTab: AvailableTab;
};

export interface MediaLibraryRef {
  /** Open the Media Library on given type. */
  show: (type: MediaLibraryType) => void;

  /** Close the Media Library. */
  hide: () => void;

  /**
   * Open the MediaLibrary on a internal/external link Tab,
   * and prefill the tab with data.
   */
  showLink: (data: InternalLinkTabProps | ExternalLinkTabProps) => void;

  /** Get the Media Libray type currently displayed, or null if hidden. */
  type: MediaLibraryType | null;
}

/** Map of MediaLibrary types and options. */
const mediaLibraryTypes: { none: null } & {
  [key in MediaLibraryType]: MediaLibraryTypeOptions;
} = {
  none: null,
  audio: {
    title: 'bbm.audio.modal.title',
    defaultTab: 'audio-capture',
  },
  video: {
    title: 'bbm.video.modal.title',
    defaultTab: 'video-capture',
  },
  image: { title: 'bbm.image.modal.title', defaultTab: 'workspace' },
  attachment: {
    title: 'bbm.attachment.modal.title',
    defaultTab: 'workspace',
  },
  hyperlink: { title: 'bbm.link.modal.title', defaultTab: 'linker' },
  embedder: { title: 'bbm.embed.modal.title', defaultTab: 'iframe' },
  // Add studio type with video-capture as default tab
  studio: {
    title: 'bbm.studio.modal.title',
    defaultTab: 'audio-capture',
  },
};

/**
 * The resulting type depends on the actual selected Tab when modal is closed.
 */
export type MediaLibraryResult =
  | WorkspaceElement[] // Workspace result
  | WorkspaceElement // Workspace result
  | InternalLinkTabResult // Linker result
  | string
  | /*TODO type des autres résultats ?*/ any;

/**
 * MediaLibrary component properties
 */
export interface MediaLibraryProps {
  /** Application Code (example: "blog"). */
  appCode: string;

  /** Visibility of the uploaded files "protected" | "public" | "external". */
  visibility: WorkspaceVisibility;

  /** Allow selecting / uploading multiple files at once ? */
  multiple?: boolean;
  /**
   * Called when the user validates the modal (Add button).
   * @param result depends on which InnerTab is visible
   */
  onSuccess: (result: MediaLibraryResult) => void;
  /**
   * Called when the user closes the modal.
   * @param uploads uploaded workspace elements to cancel.
   */
  onCancel: (uploads?: WorkspaceElement[]) => void;
  /**
   * Called when the user swith between tabs, without closing the modal.
   * @param tab Props of the newly displayed tab.
   * @param uploads uploaded workspace elements to cancel.
   */
  onTabChange?: (tab: TabsItemProps, uploads?: WorkspaceElement[]) => void;
}

//---------------------------------------------------
// Media Library implementation
//---------------------------------------------------
const MediaLibrary = forwardRef(
  (
    {
      appCode,
      visibility,
      multiple,
      onSuccess,
      onCancel,
      onTabChange,
    }: MediaLibraryProps,
    ref: Ref<MediaLibraryRef>,
  ) => {
    // Props for prefilling the [in|ex]ternal innertab.
    const linkTabProps = useRef<AnyLinkProps>();
    // Local ref will be merged with forwardRef in useImperativeHandle() below
    const refModal = useRef<ModalElement>(null);
    // Methods to control the Media Library from parent component
    useImperativeHandle(ref, () => ({
      show,
      hide,
      showLink,
      type,
      ...refModal.current,
    }));

    const { t } = useTranslation();

    const workspaceCreateWorkflow = useHasWorkflow(
      'org.entcore.workspace.controllers.WorkspaceController|addDocument',
    );
    const videoCaptureWorkflow = useHasWorkflow(
      'com.opendigitaleducation.video.controllers.VideoController|capture',
    );

    const [type, setType] = useState<MediaLibraryType | null>(null);

    // HTTP errors toasts
    useHttpErrorToast({
      active: !!type,
      isDismissible: true,
      duration: Infinity,
    });

    const availableTabs: {
      [tabname in AvailableTab]: TabsItemProps & MediaLibraryTabProps;
    } = {
      'workspace': {
        id: 'workspace',
        icon: <IconFolder />,
        label: t('bbm.workspace'),
        content: <InnerTabs.Workspace />,
        availableFor: ['audio', 'video', 'image', 'attachment'],
        isEnable: null,
      },
      'upload': {
        id: 'upload',
        icon: <IconSmartphone />,
        label: t('bbm.device'),
        content: <InnerTabs.Upload />,
        availableFor: ['audio', 'video', 'image', 'attachment'],
        isEnable: () => (workspaceCreateWorkflow ? true : false),
      },
      'video-capture': {
        id: 'video-capture',
        icon: <IconRecordVideo />,
        label: t('bbm.video'),
        content: <InnerTabs.Video />,
        availableFor: ['video', 'studio'],
        isEnable: () => (videoCaptureWorkflow ? true : false),
      },
      'audio-capture': {
        id: 'audio-capture',
        icon: <IconMic />,
        label: t('bbm.audio'),
        content: <InnerTabs.Audio />,
        availableFor: ['audio', 'studio'],
        isEnable: () => (workspaceCreateWorkflow ? true : false),
      },
      'external-link': {
        id: 'external-link',
        icon: <IconGlobe />,
        label: t('bbm.linker.ext'),
        content: (
          <InnerTabs.ExternalLink
            {...(linkTabProps.current as ExternalLinkTabProps)}
          />
        ),
        availableFor: ['hyperlink'],
        isEnable: null,
      },
      'internal-link': {
        id: 'internal-link',
        icon: <IconApplications />,
        label: t('bbm.linker.int'),
        content: (
          <InnerTabs.InternalLink
            {...(linkTabProps.current as InternalLinkTabProps)}
          />
        ),
        availableFor: ['hyperlink'],
        isEnable: null,
      },
      'iframe': {
        id: 'iframe',
        icon: <IconCode />,
        label: t('bbm.embed'),
        content: <InnerTabs.Iframe />,
        availableFor: ['embedder'],
        isEnable: null,
      },
      'video-embedder': {
        id: 'iframe',
        icon: <IconCode />,
        label: t('bbm.embed'),
        content: <InnerTabs.VideoEmbedder />,
        availableFor: ['video'],
        isEnable: null,
      },
    };

    // --------------- Hooks
    /* Filter out unwanted tabs. */
    const tabs = useMemo(
      () =>
        orderedTabs
          .map((key) => availableTabs[key])
          .filter(
            (tab) =>
              tab.isEnable?.() !== false &&
              (tab.availableFor.length === 0 ||
                tab.availableFor.includes(type)),
          ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [type],
    );

    const [defaultTabId, setDefaultTabId] = useState<
      AvailableTab | undefined
    >();

    /* Compute the index of the displayed tab by default. */
    const defaultTabIdx = useMemo<number>(() => {
      const index = tabs.findIndex((t) => t.id === defaultTabId);
      return 0 > index || index >= tabs.length ? 0 : index;
    }, [tabs, defaultTabId]);

    // Stateful contextual values
    const [resultCounter, setResultCounter] = useState<number | undefined>();
    const [result, setResult] = useState<MediaLibraryResult | undefined>();
    const [deletionsOnCancel, setDeletionsOnCancel] = useState<
      WorkspaceElement[]
    >([]);
    const [onSuccessAction, setPreSuccess] =
      useState<() => Promise<MediaLibraryResult>>();

    function setVisibleTab(tab: AvailableTab) {
      const index = tabs.findIndex((t) => t.id === tab);
      if (index < 0) throw 'tab.not.visible';
      // TODO améliorer le composant Tabs pour pouvoir le piloter depuis le parent.
      throw 'not.implemented.yet';
    }

    function switchType(type: MediaLibraryType) {
      linkTabProps.current = undefined;
      setDefaultTabId(undefined);
      setType(type);
    }

    // --------------- Imperative functions
    const show = (type: MediaLibraryType) => {
      setType(type);
    };

    const hide = () => {
      setType(null);
    };

    const showLink = (props: InternalLinkTabProps | ExternalLinkTabProps) => {
      linkTabProps.current = props;

      if (!('resourceId' in props || 'appPrefix' in props)) {
        setDefaultTabId('external-link');
      }
      setType('hyperlink');
    };

    // If not set before, determine which available tab to display when type change.
    useEffect(() => {
      const typeKey = type || 'none';
      if (
        !defaultTabId &&
        typeof mediaLibraryTypes[typeKey]?.defaultTab === 'string'
      ) {
        setDefaultTabId(mediaLibraryTypes[typeKey]?.defaultTab);
      }
    }, [defaultTabId, type]);

    // --------------- Utility functions
    const modalHeader = t(mediaLibraryTypes[type ?? 'none']?.title ?? 'bbm');

    const resetState = () => {
      linkTabProps.current = undefined;
      setResult(undefined);
      setResultCounter(undefined);
      setDefaultTabId(undefined);
      setPreSuccess(undefined);
      setDeletionsOnCancel([]);
    };

    const handleTabChange = (tab: TabsItemProps) => {
      onTabChange?.(tab, deletionsOnCancel);
      resetState();
    };

    const handleOnSuccess = useCallback(() => {
      const triggerSuccess = async (result: MediaLibraryResult) => {
        // Copy WorkspaceElement from shared/owner folder to protected/public folder
        if (
          result instanceof Array &&
          ['protected', 'public'].findIndex((v) => v === visibility) >= 0
        ) {
          result = await odeServices
            .workspace()
            .transferDocuments(result, appCode ?? 'media-library', visibility);
        }
        onSuccess(result);
      };

      if (onSuccessAction) {
        // First execute the pre-success action, then trigger the onSuccess callback.
        onSuccessAction().then((result) => {
          triggerSuccess(result);
        });
      } else if (result) {
        triggerSuccess(result);
      }
      resetState();
    }, [onSuccessAction, result, onSuccess, visibility, appCode]);

    const handleOnCancel = () => {
      onCancel(deletionsOnCancel);
      resetState();
    };

    return (
      type && (
        <MediaLibraryContext.Provider
          value={{
            appCode,
            visibility,
            multiple,
            type,
            setResultCounter,
            setResult,
            setCancellable: (uploads: WorkspaceElement[]) =>
              setDeletionsOnCancel([...uploads]),
            setVisibleTab,
            switchType,
            setPreSuccess,
          }}
        >
          <Modal
            id="media-library"
            isOpen={type !== null}
            onModalClose={handleOnCancel}
            size="lg"
            viewport
            scrollable
          >
            <Modal.Header onModalClose={handleOnCancel}>
              {modalHeader}
            </Modal.Header>
            <Tabs
              items={tabs}
              defaultId={tabs[defaultTabIdx].id}
              onChange={handleTabChange}
            >
              {(currentItem) => (
                <>
                  {tabs.length > 1 && <Tabs.List className="mt-16" />}
                  <Modal.Body className="d-flex">
                    <Tabs.Panel currentItem={currentItem}>
                      {currentItem?.content}
                    </Tabs.Panel>
                  </Modal.Body>
                </>
              )}
            </Tabs>
            <Modal.Footer>
              <Button
                type="button"
                color="tertiary"
                variant="ghost"
                onClick={handleOnCancel}
              >
                {t('cancel')}
              </Button>
              <Button
                type="button"
                color="primary"
                variant="filled"
                disabled={typeof result === 'undefined'}
                onClick={handleOnSuccess}
              >
                {resultCounter && resultCounter > 1
                  ? t('addMultiple', { number: resultCounter })
                  : t('add')}
              </Button>
            </Modal.Footer>
          </Modal>
        </MediaLibraryContext.Provider>
      )
    );
  },
);

// Add inner tabs implementations to exported component.
Object.assign(MediaLibrary, InnerTabs);

export default MediaLibrary;
