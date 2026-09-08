import illuGenerationHdf from '@edifice.io/bootstrap/dist/images/homepage/illu-generation-hdf.svg';
import clsx from 'clsx';
import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ButtonBeta,
  FormControl,
  IconButton,
  Image,
  Input,
} from '../../../../components';
import { IconClose } from '../../../icons/components';
import SvgIconExternalLink from '../../../icons/components/IconExternalLink';
import { HomeCard } from '../HomeCard';

export type GenerationHdfStatus = 'idle' | 'loading' | 'error' | 'account';

export interface GenerationHdfWallet {
  label: string;
  amount: string;
}

export interface GenerationHdfProps {
  handleActionClick: () => void;
  status: GenerationHdfStatus;
  cardNumber: string;
  onCardNumberChange: (value: string) => void;
  onClear: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEdit: () => void;
  wallets: GenerationHdfWallet[];
}

export default function GenerationHdf({
  handleActionClick,
  status,
  cardNumber,
  onCardNumberChange,
  onClear,
  onSubmit,
  onEdit,
  wallets,
}: GenerationHdfProps) {
  const { t } = useTranslation();

  const isAccount = status === 'account';
  const isLoading = status === 'loading';
  const isError = status === 'error';
  const canClear = cardNumber.length > 0 && !isAccount;

  return (
    <HomeCard variant="primary">
      <div className="generation-hdf__header">
        <h3 className="generation-hdf__title">
          {t('homepage.widget.generation-hdf.title', 'Génération HDF')}
        </h3>
        <IconButton
          aria-label={t('homepage.widget.generation-hdf.open', 'Ouvrir')}
          onClick={handleActionClick}
          icon={<SvgIconExternalLink />}
          variant="ghost"
          color="tertiary"
        />
      </div>

      <HomeCard.Content>
        <div className="generation-hdf">
          <Image
            src={illuGenerationHdf}
            alt="Génération #HDF"
            className="generation-hdf__logo"
          />

          {isAccount ? (
            <div className="generation-hdf__account">
              <h4 className="generation-hdf__account-title">
                {t(
                  'homepage.widget.generation-hdf.wallets-title',
                  'Mes porte-monnaies',
                )}
              </h4>
              <ul className="generation-hdf__wallets">
                {wallets.map((wallet, index) => (
                  <li className="generation-hdf__wallet" key={index}>
                    <span className="generation-hdf__wallet-label">
                      {wallet.label}
                    </span>
                    <span className="generation-hdf__wallet-amount">
                      {wallet.amount}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="generation-hdf__description">
              {t(
                'homepage.widget.generation-hdf.description',
                'Toutes les aides de la Région pour réussir votre année',
              )}
            </p>
          )}

          <form className="generation-hdf__form" onSubmit={onSubmit}>
            <FormControl
              id="generationHdfCardNumber"
              className="generation-hdf__field"
              status={isError ? 'invalid' : undefined}
            >
              <div
                className={clsx('generation-hdf__input-wrapper', {
                  'generation-hdf__input-wrapper--clearable': canClear,
                })}
              >
                <Input
                  size="md"
                  type="text"
                  inputMode="numeric"
                  placeholder={t(
                    'homepage.widget.generation-hdf.placeholder',
                    'Numéro de carte',
                  )}
                  value={cardNumber}
                  onChange={(event) => onCardNumberChange(event.target.value)}
                  disabled={isAccount}
                  noValidationIcon
                />
                {canClear && (
                  <IconButton
                    type="button"
                    aria-label={t(
                      'homepage.widget.generation-hdf.clear',
                      'Effacer',
                    )}
                    onClick={onClear}
                    icon={<IconClose />}
                    variant="ghost"
                    color="tertiary"
                    className="generation-hdf__input-clear"
                  />
                )}
              </div>
              {isError && (
                <FormControl.Text>
                  {t(
                    'homepage.widget.generation-hdf.error',
                    'Numéro de carte incorrect',
                  )}
                </FormControl.Text>
              )}
            </FormControl>

            {isAccount ? (
              <ButtonBeta
                type="button"
                variant="outline"
                color="default"
                onClick={onEdit}
              >
                {t('homepage.widget.generation-hdf.edit', 'Modifier')}
              </ButtonBeta>
            ) : (
              <ButtonBeta
                type="submit"
                variant="outline"
                color="default"
                isLoading={isLoading}
                disabled={!cardNumber.trim() || isLoading}
              >
                {t('homepage.widget.generation-hdf.submit', 'Valider')}
              </ButtonBeta>
            )}
          </form>
        </div>
      </HomeCard.Content>
    </HomeCard>
  );
}
