import { School } from '@edifice.io/client';
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
  const hasManySchools = schools && schools.length > 1;

  return (
    <div className="school-widget">
      {selectedSchool ? (
        <div className="school-widget__selected">{selectedSchool.name}</div>
      ) : /* 
            hasManySchools ? (
        <ul role="list">
          {schools.map((school) => (
            <li key={school.id}>
              <div>
                <strong>{school.name}</strong>
                {school.UAI && <span>UAI : {school.UAI}</span>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <strong>{selectedSchool.name}</strong>
          {selectedSchool.UAI && <span>UAI : {selectedSchool.UAI}</span>}
        </div>
      )
      */
      null}
    </div>
  );
};

SchoolWidget.displayName = 'SchoolWidget';

export default SchoolWidget;
