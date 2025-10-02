import { ReactNode, useId } from 'react';

import {
  CreateParameters,
  CreateResult,
  ID,
  IFolder,
  UpdateParameters,
  UpdateResult,
  odeServices,
} from '@edifice.io/client';
import { UseMutationResult } from '@tanstack/react-query';
import { createPortal } from 'react-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Button,
  FormControl,
  Heading,
  Input,
  Label,
  LoadingScreen,
  Modal,
  TextArea,
} from '../../../components';
import { useHasWorkflow, useMediaLibrary, useToast } from '../../../hooks';
import { useResource } from '../../../hooks/useResource';
import { useEdificeClient } from '../../../providers';
import { MediaLibrary } from '../../multimedia';
import ImagePicker from '../../multimedia/ImagePicker/ImagePicker';
import { useThumb } from './hooks/useThumb';

export interface FormInputs {
  title: string;
  description: string;
  enablePublic: boolean;
  formSlug: string;
  allowReplies: boolean;
}

/**
 * Custom translations interface for overriding default translations
 */
export interface ResourceModalTranslations {
  title?: string;
  description?: string;
  cancel?: string;
  create?: string;
  save?: string;
  header?: {
    create?: string;
    edit?: string;
  };
  heading?: {
    general?: string;
    access?: string;
  };
  placeholder?: {
    title?: string;
    description?: string;
  };
  imagepicker?: {
    add?: string;
    delete?: string;
  };
  success?: {
    created?: string;
    updated?: string;
  };
}

interface BaseProps {
  /** Controls modal visibility */
  isOpen: boolean;

  /** Custom content to be displayed after the form fields */
  children?: ReactNode | ((...props: any) => ReactNode);

  /** Maximum length for the title input */
  inputMaxLength?: number;

  /** Maximum length for the description textarea */
  textareaMaxLength?: number;

  /** Callback when operation succeeds, with operation result as parameter */
  onSuccess: (
    result: CreateResult | UpdateResult,
    param: CreateParameters | UpdateParameters,
  ) => void;

  /** Callback when operation is cancelled */
  onCancel: () => void;

  /** Override application code (uses EdificeClient context by default) */
  appCode?: string;

  /** Custom translations for the modal */
  translations?: ResourceModalTranslations;
}

interface CreateProps extends BaseProps {
  mode: 'create';
  createResource?: UseMutationResult<
    CreateResult,
    Error,
    CreateParameters,
    unknown
  >;
  currentFolder: Partial<IFolder>;
}

interface UpdateProps extends BaseProps {
  mode: 'update';
  updateResource?: UseMutationResult<
    UpdateResult,
    unknown,
    UpdateParameters,
    unknown
  >;
  resourceId: ID;
}

type Props = CreateProps | UpdateProps;

const DEFAULT_INPUT_MAX_LENGTH = 60;
const DEFAULT_TEXTAREA_MAX_LENGTH = 400;

/**
 * ResourceModal component for creating or updating resources
 *
 * @component
 * @example
 * ```tsx
 * <ResourceModal
 *   mode="create"
 *   isOpen={true}
 *   onCancel={() => setOpen(false)}
 *   onSuccess={(result) => console.log('Resource created:', result)}
 *   currentFolder={{ id: 'default' }}
 * />
 * ```
 */
export const ResourceModal = ({
  isOpen,
  onCancel,
  onSuccess,
  children,
  appCode: customAppCode,
  translations: customT = {},
  inputMaxLength = DEFAULT_INPUT_MAX_LENGTH,
  textareaMaxLength = DEFAULT_TEXTAREA_MAX_LENGTH,
  ...props
}: Props) => {
  const { appCode: contextAppCode, currentApp } = useEdificeClient();
  // Use custom app code if provided, otherwise use the one from context
  const application = customAppCode || contextAppCode;
  const hasOptionalCommentRepliesWorkflow = useHasWorkflow(
    'org.entcore.blog.controllers.BlogController|optionalCommentReplies',
  );

  const { t } = useTranslation();
  const { mode } = props;

  const toast = useToast();
  const formId = useId();

  const isCreating = mode === 'create';
  const isUpdating = mode === 'update';

  const resource = useResource(application, isUpdating ? props.resourceId : '');

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, isValid },
  } = useForm<FormInputs>({
    mode: 'onChange',
    defaultValues: {
      description: isUpdating ? resource?.description : '',
      enablePublic: isUpdating ? resource?.public : false,
      title: isUpdating ? resource?.name : '',
      formSlug: isUpdating ? resource?.slug : '',
      allowReplies: isUpdating ? resource?.allowReplies : true,
    },
  });

  const {
    ref: mediaLibraryRef,
    libraryMedia,
    ...mediaLibraryHandlers
  } = useMediaLibrary();

  const { thumbnail, handleDeleteImage, handleUploadImage } = useThumb({
    isUpdating,
    selectedResource: isUpdating ? resource : undefined,
  });

  const onSubmit: SubmitHandler<FormInputs> = async function (
    formData: FormInputs,
  ) {
    try {
      const data = {
        description: formData.description || '',
        name: formData.title,
        public: formData.enablePublic,
        slug: formData.enablePublic ? formData.formSlug || '' : '',
        thumbnail,
        allowReplies: formData.allowReplies,
      };

      let result: CreateResult | UpdateResult;
      let param: CreateParameters | UpdateParameters;
      if (isCreating) {
        const createParams = {
          ...data,
          folder:
            props.currentFolder === undefined || // Fix #WB2-1296: when searching, currentFolder is undefined
            props.currentFolder?.id === 'default'
              ? undefined
              : parseInt(props.currentFolder?.id || ''),
          application,
        };
        param = createParams;
        if (props.createResource) {
          result = await props.createResource.mutateAsync(createParams);
        } else {
          result = await odeServices.resource(application).create(createParams);
        }
      } else {
        const updateParams = {
          ...data,
          entId: resource.assetId,
          trashed: resource.trashed,
        };
        param = updateParams;
        if (props.updateResource) {
          result = await props.updateResource.mutateAsync(updateParams);
        } else {
          result = await odeServices.resource(application).update(updateParams);
        }
      }

      toast.success(
        <>
          <strong>
            {t(
              isCreating
                ? 'explorer.resource.created'
                : 'explorer.resource.updated',
            )}
          </strong>
          <p>
            {t('title')} : {formData.title}
          </p>
          <p>
            {t('description')} : {formData.description}
          </p>
          {application === 'blog' && (
            <p>
              Public:
              {formData.enablePublic
                ? t('explorer.enable.public.yes')
                : t('explorer.enable.public.no')}
            </p>
          )}
        </>,
      );

      // Pass the operation result to the onSuccess callback
      onSuccess(result, param);
    } catch (e) {
      console.error(e);
    }
  };

  if (isUpdating && !resource) return <LoadingScreen />;

  return createPortal(
    <Modal
      id={`${mode}-resource`}
      size="lg"
      isOpen={isOpen}
      onModalClose={onCancel}
    >
      <Modal.Header onModalClose={onCancel}>
        {customT.header?.[isCreating ? 'create' : 'edit'] ??
          t(
            `explorer.resource.editModal.header.${isCreating ? 'create' : 'edit'}`,
          )}
      </Modal.Header>

      <Modal.Body>
        <Heading headingStyle="h4" level="h3" className="mb-16">
          {customT.heading?.general ??
            t('explorer.resource.editModal.heading.general')}
        </Heading>

        <form id={formId} onSubmit={handleSubmit(onSubmit)}>
          <div className="d-block d-md-flex gap-16 mb-24">
            <div>
              <ImagePicker
                app={currentApp}
                src={isUpdating ? resource?.thumbnail || '' : ''}
                addButtonLabel={
                  customT.imagepicker?.add ??
                  t('explorer.imagepicker.button.add')
                }
                deleteButtonLabel={
                  customT.imagepicker?.delete ??
                  t('explorer.imagepicker.button.delete')
                }
                onUploadImage={handleUploadImage}
                onDeleteImage={handleDeleteImage}
                className="align-self-center mt-8"
                libraryMedia={libraryMedia}
                mediaLibraryRef={mediaLibraryRef}
              />
            </div>
            <div className="col">
              <FormControl id="title" className="mb-16" isRequired>
                <Label>{customT.title ?? t('title')}</Label>
                <Input
                  type="text"
                  defaultValue={isUpdating ? resource?.name : ''}
                  {...register('title', {
                    required: true,
                    maxLength: inputMaxLength,
                    pattern: {
                      value: /[^ ]/,
                      message: 'invalid title',
                    },
                  })}
                  placeholder={
                    customT.placeholder?.title ??
                    t('explorer.resource.editModal.title.placeholder')
                  }
                  size="md"
                  aria-required={true}
                  maxLength={inputMaxLength}
                  showCounter
                />
              </FormControl>
              <FormControl id="description" isOptional>
                <Label>{customT.description ?? t('description')}</Label>
                <TextArea
                  defaultValue={resource?.description || ''}
                  {...register('description', {
                    required: false,
                    maxLength: textareaMaxLength,
                  })}
                  placeholder={
                    customT.placeholder?.description ??
                    t('explorer.resource.editModal.description.placeholder')
                  }
                  size="md"
                  maxLength={textareaMaxLength}
                  showCounter
                />
              </FormControl>
              {application === 'blog' &&
                hasOptionalCommentRepliesWorkflow === true && (
                  <FormControl
                    id="allowReplies"
                    className="d-flex gap-8 mt-16 mb-8"
                  >
                    <FormControl.Input
                      type="checkbox"
                      defaultChecked={isUpdating ? resource.allowReplies : true}
                      {...register('allowReplies')}
                      className="form-check-input mt-0"
                      size="sm"
                    />
                    <FormControl.Label className="form-check-label mb-0">
                      {t('explorer.resource.editModal.comments.allowReplies')}
                    </FormControl.Label>
                  </FormControl>
                )}
            </div>
          </div>

          {typeof children === 'function'
            ? children(resource, isUpdating, watch, setValue, register)
            : children}
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          color="tertiary"
          onClick={onCancel}
          type="button"
          variant="ghost"
        >
          {customT.cancel ?? t('explorer.cancel')}
        </Button>
        <Button
          form={formId}
          type="submit"
          color="primary"
          isLoading={isSubmitting}
          variant="filled"
          disabled={!isValid || isSubmitting}
        >
          {isCreating
            ? (customT.create ?? t('explorer.create'))
            : (customT.save ?? t('save'))}
        </Button>
      </Modal.Footer>
      <MediaLibrary
        appCode={application}
        ref={mediaLibraryRef}
        multiple={false}
        visibility="protected"
        {...mediaLibraryHandlers}
      />
    </Modal>,
    document.getElementById('portal') as HTMLElement,
  );
};

export default ResourceModal;
