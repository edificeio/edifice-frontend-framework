import illuUniversalis from '@edifice.io/bootstrap/dist/images/homepage/illu-universalis.png';
import { School } from '@edifice.io/client';
import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ButtonBeta as Button,
  Dropdown,
  Image,
  SearchBar,
} from '../../../../components';
import { IconRafterDown } from '../../../icons/components';
import SvgIconExternalLink from '../../../icons/components/IconExternalLink';
import { getRotateTransitionStyle } from '../../../../utilities';
import { HomeCard } from '../HomeCard';

export interface UniversalisProps {
  handleActionClick: () => void;
  onSearch?: (query: string) => void;
  selectedSchool?: School;
  onSelectedSchoolChange?: (school: School) => void;
  schools?: School[];
}

export default function Universalis({
  handleActionClick,
  onSearch,
  selectedSchool,
  onSelectedSchoolChange,
  schools,
}: UniversalisProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const hasManySchools = Boolean(schools && schools.length > 1);
  const hasUai = Boolean(selectedSchool?.UAI);
  const searchLabel = hasUai
    ? t('search')
    : t('homepage.widget.universalis.noUai');

  const handleSearch = () => {
    if (!query.trim()) return;
    onSearch?.(query.trim());
  };

  return (
    <HomeCard variant="primary">
      <div className="universalis__header">
        <h3 className="universalis__title">
          {t('homepage.widget.universalis.title')}
        </h3>
        <Button
          className="universalis__header-button"
          data-testid="universalis-button-open"
          aria-label={t('homepage.widget.universalis.open')}
          onClick={handleActionClick}
          leftIcon={<SvgIconExternalLink />}
          variant="ghost"
          color="tertiary"
        />
      </div>

      <HomeCard.Content>
        <div className="universalis">
          <div className="universalis__intro">
            <Image
              src={illuUniversalis}
              alt="Universalis Éducation"
              className="universalis__logo"
            />
            <p className="universalis__description">
              {t('homepage.widget.universalis.description')}
            </p>
          </div>

          {hasManySchools && (
            <Dropdown placement="bottom-start" onToggle={setIsExpanded}>
              {(triggerProps: React.ComponentPropsWithRef<'button'>) => (
                <>
                  <button
                    {...triggerProps}
                    type="button"
                    aria-expanded={isExpanded}
                    className={clsx('universalis__school-selector', {
                      'universalis__school-selector--open': isExpanded,
                    })}
                  >
                    <span className="universalis__school-selector-label">
                      {selectedSchool?.name}
                    </span>
                    <IconRafterDown
                      className="universalis__school-selector-icon"
                      style={getRotateTransitionStyle(isExpanded, {
                        degrees: 180,
                      })}
                    />
                  </button>
                  <Dropdown.Menu>
                    {schools?.map((school) => (
                      <Dropdown.Item
                        key={school.id}
                        onClick={() => onSelectedSchoolChange?.(school)}
                      >
                        {school.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </>
              )}
            </Dropdown>
          )}

          <SearchBar
            isVariant={false}
            id="universalis-search-input"
            className="universalis__search"
            placeholder={searchLabel}
            aria-label={searchLabel}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={handleSearch}
            disabled={!hasUai}
            maxLength={255}
            data-testid="universalis-search-input"
          />
        </div>
      </HomeCard.Content>
    </HomeCard>
  );
}
