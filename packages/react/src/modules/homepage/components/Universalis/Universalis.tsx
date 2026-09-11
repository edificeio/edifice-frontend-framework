import illuUniversalis from '@edifice.io/bootstrap/dist/images/homepage/illu-universalis.png';
import { School } from '@edifice.io/client';
import clsx from 'clsx';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Dropdown,
  FormControl,
  IconButton,
  Image,
  Input,
} from '../../../../components';
import { IconRafterDown, IconSearch } from '../../../icons/components';
import SvgIconExternalLink from '../../../icons/components/IconExternalLink';
import { getRotateTransitionStyle } from '../../../../utilities';
import { HomeCard } from '../HomeCard';

const UNIVERSALIS_ENGINE_PARAM = 'www';

export interface UniversalisProps {
  handleActionClick: () => void;
  selectedSchool?: School;
  onSelectedSchoolChange?: (school: School) => void;
  schools?: School[];
}

interface UniversalisFormValues {
  q: string;
}

export default function Universalis({
  handleActionClick,
  selectedSchool,
  onSelectedSchoolChange,
  schools,
}: UniversalisProps) {
  const { t } = useTranslation();
  const { register } = useForm<UniversalisFormValues>();
  const [isExpanded, setIsExpanded] = useState(false);

  const hasManySchools = Boolean(schools && schools.length > 1);
  const hasUai = Boolean(selectedSchool?.UAI);
  const searchLabel = hasUai
    ? t('search')
    : t('homepage.widget.universalis.noUai', 'UAI non renseigné');

  return (
    <HomeCard variant="primary">
      <div className="universalis__header">
        <h3 className="universalis__title">
          {t('homepage.widget.universalis.title', 'Universalis Éducation')}
        </h3>
        <IconButton
          className="universalis__header-button"
          aria-label={t('homepage.widget.universalis.open', 'Ouvrir')}
          onClick={handleActionClick}
          icon={<SvgIconExternalLink />}
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
              {t(
                'homepage.widget.universalis.description',
                "L'encyclopédie de référence pour réussir vos recherches scolaires",
              )}
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
                      'universalis__school-selector-open': isExpanded,
                    })}
                  >
                    <span className="universalis__school-selector-label">
                      {selectedSchool?.name}
                    </span>
                    <IconRafterDown
                      className="w-16 min-w-0"
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

          <form
            method="GET"
            action="https://www.universalis-edu.com/nomade/precherche/"
            target="_blank"
            className="universalis__search"
          >
            <FormControl
              id="inputUniversalisQuery"
              className="universalis__search-field"
            >
              <FormControl.Label className="visually-hidden">
                {searchLabel}
              </FormControl.Label>
              <Input
                placeholder={searchLabel}
                size="md"
                type="text"
                maxLength={255}
                disabled={!hasUai}
                {...register('q')}
              />
              <input type="hidden" name="r" value={UNIVERSALIS_ENGINE_PARAM} />
              <input type="hidden" name="uai" value={selectedSchool?.UAI} />
              <IconButton
                aria-label={searchLabel}
                type="submit"
                color="primary"
                icon={<IconSearch />}
                variant="filled"
                disabled={!hasUai}
              />
            </FormControl>
          </form>
        </div>
      </HomeCard.Content>
    </HomeCard>
  );
}
