import { School } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';
import { Dropdown, Flex, IconButton, useToggle } from '../../../..';
import { getRotateTransitionStyle } from '../../../../utilities';
import { IconRafterUp } from '../../../icons/components';

export interface SchoolSpaceProps {
  selectedSchool: School | undefined;
  onSelectedSchoolChange?: (schoolIndex: number) => void;
  schools?: School[];
}

const SchoolSpace = ({
  schools,
  selectedSchool,
  onSelectedSchoolChange,
}: SchoolSpaceProps) => {
  const [isExpanded, toggleExpanded] = useToggle(false);
  const { t } = useTranslation();

  const hasManySchools = schools && schools.length > 1;

  if (!selectedSchool) return null;

  return (
    <div className="school-space">
      <div className="school-space-container">
        <Flex
          className="school-space-selected"
          justify="center"
          gap="4"
          align="center"
        >
          <b>{selectedSchool.name}</b>
          {hasManySchools && (
            <Dropdown placement={'bottom-end'} onToggle={toggleExpanded}>
              {(
                triggerProps: React.ComponentPropsWithRef<typeof IconButton>,
              ) => (
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
                    {schools.map((school, index) => (
                      <Dropdown.Item
                        key={school.id}
                        onClick={() => onSelectedSchoolChange?.(index)}
                      >
                        <Flex direction="column">
                          <p>{school.name}</p>
                          {school.UAI && <p>UAI : {school.UAI}</p>}
                        </Flex>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </>
              )}
            </Dropdown>
          )}
        </Flex>
      </div>
    </div>
  );
};

SchoolSpace.displayName = 'SchoolSpace';

export default SchoolSpace;
