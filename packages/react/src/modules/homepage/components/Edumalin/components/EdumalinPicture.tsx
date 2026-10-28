import illuEdumalin from '@edifice.io/bootstrap/dist/images/homepage/illu-edumalin.png';
import { Image } from '../../../../../components';
import { getPictureUrl } from '../utils';

export interface EdumalinPictureProps {
  picture?: string;
}

/** Square picture of an item, the Édumalin logo when missing or broken. */
export default function EdumalinPicture({ picture }: EdumalinPictureProps) {
  return (
    <Image
      src={getPictureUrl(picture) ?? illuEdumalin}
      imgPlaceholder={illuEdumalin}
      alt=""
      className="edumalin-picture"
      data-testid="edumalin-item-picture"
    />
  );
}
