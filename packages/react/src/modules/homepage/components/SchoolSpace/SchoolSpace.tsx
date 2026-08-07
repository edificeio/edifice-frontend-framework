import { School } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';
import { ButtonBeta, Dropdown, Flex, IconButton, useToggle } from '../../../..';
import { getRotateTransitionStyle } from '../../../../utilities';
import { IconRafterUp, IconUserSearch } from '../../../icons/components';

/**
 * SchoolSpace component displays the currently selected school and provides
 * a dropdown menu to switch between multiple schools if available.
 */
export interface SchoolSpaceProps {
  selectedSchool: School | undefined;
  onSelectedSchoolChange?: (school: School) => void;
  schools?: School[];
}

const SchoolSpace = ({
  schools,
  selectedSchool,
  onSelectedSchoolChange,
}: SchoolSpaceProps) => {
  const [isExpanded, toggleExpanded] = useToggle(false);
  const { t } = useTranslation();

  // Only show dropdown if there are multiple schools to choose from
  const hasManySchools = schools && schools.length > 1;

  // Do not render anything if no school is selected
  if (!selectedSchool) return null;

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
