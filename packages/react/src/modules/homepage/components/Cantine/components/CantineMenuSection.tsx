import { useTranslation } from 'react-i18next';
import { Image } from '../../../../../components';
import { CATEGORY_CONFIG, DISH_TAGS } from './cantineLabels';
import { CantineCategory, CantineDish } from '../hooks/useCantineMenu';

export interface CantineMenuSectionProps {
  category: CantineCategory;
  items: CantineDish[];
}

export default function CantineMenuSection({
  category,
  items,
}: CantineMenuSectionProps) {
  const { t } = useTranslation();
  const config = CATEGORY_CONFIG[category];

  return (
    <li className={`cantine__section cantine__section-${category}`}>
      <div className="cantine__section-header">
        <span className="cantine__section-icon">
          <Image src={config.icon} alt="" />
        </span>
        <h4 className="cantine__section-title">
          {t(config.i18nKey, config.defaultLabel)}
        </h4>
      </div>
      <ul className="cantine__items">
        {items.map((item) => (
          <li className="cantine__item" key={item.id}>
            <div className="cantine__item-text">
              <p className="cantine__item-label">{item.label}</p>
              {item.allergens.length > 0 && (
                <p className="cantine__item-allergens">
                  {item.allergens.join(', ')}
                </p>
              )}
            </div>
            <div className="cantine__item-tags">
              {DISH_TAGS.filter((tag) => item[tag.flag]).map((tag) => (
                <Image
                  key={tag.flag}
                  src={tag.icon}
                  alt={t(tag.i18nKey, tag.defaultLabel)}
                  className="cantine__item-tag"
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </li>
  );
}
