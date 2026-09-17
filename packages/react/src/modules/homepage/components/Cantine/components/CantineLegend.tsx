import { useTranslation } from 'react-i18next';
import { Image } from '../../../../../components';
import { DISH_TAGS } from './cantineLabels';

/**
 * Meaning of the quality pictograms displayed next to the dishes, plus the
 * legal notice required by the canteen provider.
 */
export default function CantineLegend() {
  const { t } = useTranslation();

  return (
    <div className="cantine-modal__legend">
      <div className="cantine-modal__legend-list">
        <h3 className="cantine-modal__legend-title">
          {t('homepage.widget.cantine.legend.title', 'Légende')}
        </h3>
        {DISH_TAGS.map((tag) => (
          <p className="cantine-modal__legend-item" key={tag.flag}>
            <Image
              src={tag.icon}
              alt=""
              className="cantine-modal__legend-icon"
            />
            {t(tag.i18nKey, tag.defaultLabel)}
          </p>
        ))}
      </div>
      <p className="cantine-modal__notice">
        {t(
          'homepage.widget.cantine.legend.notice',
          '"Les informations figurant dans ces menus peuvent être modifiées en fonction des approvisionnements ; les mises à jour seront effectuées en conséquence"',
        )}
      </p>
    </div>
  );
}
