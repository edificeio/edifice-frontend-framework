import illuQwant from '@edifice.io/bootstrap/dist/images/homepage/illu-qwant.png';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ButtonBeta, FormControl, Image, Input } from '../../../../components';
import { IconSearch } from '../../../../modules/icons/components';
import SvgIconExternalLink from '../../../../modules/icons/components/IconExternalLink';
import { HomeCard } from '../HomeCard';

export interface QwantProps {
  handleActionClick: () => void;
}

interface QwantFormValues {
  q: string;
}

export default function Qwant({ handleActionClick }: QwantProps) {
  const { t } = useTranslation();
  const { register } = useForm<QwantFormValues>();

  return (
    <HomeCard variant="primary">
      <div className="qwant__header">
        <h3 className="qwant__title">
          {t('homepage.widget.qwant.title', 'Qwant')}
        </h3>
        <ButtonBeta
          className="qwant__header-button"
          aria-label={t('homepage.widget.qwant.open', 'Ouvrir')}
          onClick={handleActionClick}
          leftIcon={<SvgIconExternalLink />}
          variant="ghost"
          color="tertiary"
        />
      </div>

      <HomeCard.Content>
        <div className="qwant">
          <div className="qwant__intro">
            <Image src={illuQwant} alt="Qwant" className="qwant__logo" />
            <p className="qwant__description">
              {t(
                'homepage.widget.qwant.description',
                'Le moteur de recherche européen qui respecte votre vie privée',
              )}
            </p>
          </div>
          <form
            method="GET"
            action="https://www.qwant.com"
            target="_blank"
            className="qwant__search"
          >
            <FormControl id="inputQwantQuery" className="qwant__search-field">
              <FormControl.Label className="visually-hidden">
                {t('search')}
              </FormControl.Label>
              <Input
                data-testid="qwant-search-input"
                placeholder={(t('search'), 'Rechercher')}
                size="md"
                type="text"
                maxLength={255}
                {...register('q')}
              />
              <input type="hidden" name="l" value="fr" />
              <ButtonBeta
                leftIcon={<IconSearch />}
                type="submit"
                aria-label={t('search')}
                variant="filled"
                color="secondary"
              />
            </FormControl>
          </form>
        </div>
      </HomeCard.Content>
    </HomeCard>
  );
}
