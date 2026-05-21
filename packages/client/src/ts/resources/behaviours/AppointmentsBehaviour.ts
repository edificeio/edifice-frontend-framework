import { AbstractBehaviourService } from './AbstractBehaviourService';

type GridData = {
  id: number;
  name: string;
  ownerId: string;  
  ownerName: string;  
  updatingDate: string;
  color: string;
};

const hexToDataUrl = (hex: string, width: number = 1, height: number = 1) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return "";
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, width, height);
  return canvas.toDataURL('image/png');
}

export class AppointmentsBehaviour extends AbstractBehaviourService {
  APP = 'appointments';
  RESOURCE = 'appointments';

  async loadResources() {
    const data = await this.httpGet<GridData[]>('/appointments/grids/linker',);
    return data.map((grid) => {
      return this.dataToResource({
        _id: grid.id.toString(),
        icon: hexToDataUrl(grid.color, 100, 100),
        title: grid.name,
        ownerName: grid.ownerName,
        owner: grid.ownerId,
        path: `${window.location.origin}/appointments#?gridId=${grid.id}`,
        shared: false,
        modified: grid.updatingDate,
      });
    });
  }
}
