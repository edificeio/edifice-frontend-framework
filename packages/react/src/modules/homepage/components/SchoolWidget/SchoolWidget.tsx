import { School } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';
import { Dropdown, Flex, IconButton, useToggle } from '../../../..';
import { IconRafterDown } from '../../../../modules/icons/components';
import './SchoolWidget.css';

export interface SchoolWidgetProps {
  selectedSchool: School | undefined;
  onSelectedSchoolChange?: (schoolIndex: number) => void;
  schools?: School[];
}

const SchoolWidget = ({
  schools,
  selectedSchool,
  onSelectedSchoolChange,
}: SchoolWidgetProps) => {
  const [isExpanded, toggleExpanded] = useToggle(false);
  const { t } = useTranslation();

  const hasManySchools = schools && schools.length > 1;

  const widgetStyle = { padding: '1.4rem 0.4rem' };
  const containerStyle = { padding: '0.8rem' };
  const selectedSchoolStyle = {
    padding: '.4rem 2.9rem',
    fontSize: '1.6rem',
    lineHeight: '2.2rem',
    color: 'var(--school-widget-selected-color)',
  };

  if (!selectedSchool) return null;

  return (
    <div className="school-widget" style={widgetStyle}>
      <div style={containerStyle}>
        <Flex
          style={selectedSchoolStyle}
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
                      <IconRafterDown
                        className="w-16 min-w-0"
                        style={{
                          transition: 'rotate 0.2s ease-out',
                          rotate: isExpanded ? '0deg' : '-180deg',
                        }}
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

SchoolWidget.displayName = 'SchoolWidget';

export default SchoolWidget;
