import { AbstractBehaviourService } from './AbstractBehaviourService';

type FormulaireData = {
  picture: string;
  id: number;
  title: string;
  owner_name: string;
  owner_id: string;
  date_modification: string | number;
  is_public?: boolean;
  public_key?: string;
  rgpd?: boolean;
  shared?: [];
};

export class FormulaireBehaviour extends AbstractBehaviourService {
  APP = 'formulaire';
  RESOURCE = 'formulaire';

  async loadResources() {
    const data = await this.httpGet<FormulaireData[]>(
      '/formulaire/forms/linker',
    );
    return data.map((data) => {
      if (!data.picture) data.picture = '/formulaire/public/img/logo.svg';
      return this.dataToResource({
        _id: '' + data.id,
        icon: data.picture,
        title: data.title,
        ownerName: data.owner_name,
        owner: data.owner_id,
        path: data.is_public
          ? `${window.location.origin}/formulaire-public#/form/${data.public_key}`
          : `${window.location.origin}/formulaire#/form/${data.id}/${
              data.rgpd ? 'rgpd' : 'new'
            }`,
        shared: data.shared && data.shared.length >= 0 ? true : false,
        modified: '' + data.date_modification,
      });
    });
  }
}
