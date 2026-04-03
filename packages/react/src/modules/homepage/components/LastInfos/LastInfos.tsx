import { LastInfosModel } from './useLastInfos';

/* TODO */
export interface LastInfosProps {
  info: LastInfosModel;
}

const LastInfos = ({ info }: LastInfosProps) => {
  return info.title;
};

LastInfos.displayName = 'LastInfos';

export default LastInfos;
