import { transport } from '../transport/Framework';

export interface ILastInfosModel {
  date: string; // "2021-03-24T16:36:05.398"
  shared: []; // FIXME typings [{net-atos-entng-actualites-controllers-InfoController|getInfo: true, userId: "toto"}]
  thread_icon: string; // "/workspace/document/36a04526-15a2-4e8f-adb6-cca75630e50d"
  thread_id: number; // 221
  thread_title: string; // "News collège Denis Poisson"
  title: string; // "xx"
  username: string; // "DEVAULX ALAIN"
  _id: number; // 597
}

export class LastInfosWidget {
  loadInfos(maxResults: number): Promise<ILastInfosModel[]> {
    return transport.http.get('/actualites/infos/last/' + maxResults);
  }

  getMaxResults(): Promise<number> {
    return transport.http
      .get('/userbook/preference/maxInfos')
      .then((maxInfos) => {
        return maxInfos.preference ? parseInt(maxInfos.preference) : 4;
      });
  }

  setMaxResults(maxResults: number): Promise<void> {
    return transport.http.putJson(
      '/userbook/preference/maxInfos',
      `"${maxResults}"`,
    );
  }
}
