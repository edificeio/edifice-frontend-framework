import { School } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';
import {
  ButtonBeta,
  Dropdown,
  Flex,
  IconButton,
  Skeleton,
  useToggle,
  VisuallyHidden,
} from '../../../..';
import { getRotateTransitionStyle } from '../../../../utilities';
import { IconRafterUp, IconUserSearch } from '../../../icons/components';

const SKELETON_NAME_LINES = 2;

/**
 * SchoolSpace component displays the currently selected school and provides
 * a dropdown menu to switch between multiple schools if available.
 */
export interface SchoolSpaceProps {
  selectedSchool: School | undefined;
  onSelectedSchoolChange?: (school: School) => void;
  schools?: School[];
  isLoading?: boolean;
}

const SchoolSpace = ({
  schools,
  selectedSchool,
  onSelectedSchoolChange,
  isLoading = false,
}: SchoolSpaceProps) => {
  const [isExpanded, toggleExpanded] = useToggle(false);
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div
        className="school-space school-space--skeleton"
        role="status"
        aria-busy="true"
      >
        <VisuallyHidden>{t('homepage.widget.loading')}</VisuallyHidden>
        <div className="school-space-container school-space__name-skeleton">
          {Array.from({ length: SKELETON_NAME_LINES }, (_, index) => (
            <Skeleton key={index} className="school-space__line-skeleton" />
          ))}
        </div>
        <Skeleton
          variant="pill"
          tone="strong"
          className="school-space-directory-button school-space__button-skeleton"
        />
      </div>
    );
  }

  // Do not render anything if no school is selected
  if (!selectedSchool) return null;

  // Only show dropdown if there are multiple schools to choose from
  const hasManySchools = schools && schools.length > 1;

  const directoryUrl = `/userbook/annuaire#/search?${new URLSearchParams({
    structure: selectedSchool.id,
  }).toString()}`;

  return (
    <Flex gap="4" direction="column" className="school-space">
      <Flex
        className="school-space-container"
        justify="center"
        gap="4"
        align="center"
      >
        <b>{selectedSchool.name}</b>
        {hasManySchools && (
          <Dropdown placement={'bottom-end'} onToggle={toggleExpanded}>
            {(triggerProps: React.ComponentPropsWithRef<typeof IconButton>) => (
              <>
                <IconButton
                  {...triggerProps}
                  aria-label={t('show')}
                  color="tertiary"
                  variant="ghost"
                  icon={
                    <IconRafterUp
                      className="w-16 min-w-0"
                      style={getRotateTransitionStyle(isExpanded, {
                        degrees: 180,
                      })}
                    />
                  }
                />
                <Dropdown.Menu>
                  {schools.map((school) => (
                    <Dropdown.Item
                      key={school.id}
                      onClick={() => onSelectedSchoolChange?.(school)}
                    >
                      <Flex direction="column">
                        <p>{school.name}</p>
                      </Flex>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </>
            )}
          </Dropdown>
        )}
      </Flex>
      <ButtonBeta
        variant="outline"
        className="school-space-directory-button"
        leftIcon={<IconUserSearch />}
        onClick={() => (window.location.href = directoryUrl)}
      >
        {t('homepage.school-space.directory')}
      </ButtonBeta>
    </Flex>
  );
};

SchoolSpace.displayName = 'SchoolSpace';

export default SchoolSpace;
