export interface LastInfosProps {
  /**
   * URL of the icon to display in the upper left corner.
   * i.e. "/workspace/document/36a04526-15a2-4e8f-adb6-cca75630e50d"
   */
  icon: string;
  /**
   * Name of the thread to be displayed next to the icon.
   * i.e. "Informations importantes"
   */
  thread: string;
  /**
   * Title of the info.
   */
  title: string;
  /**
   * Content of the info.
   */
  content: string;
  /**
   * Name of the user who posted this info.
   */
  username: string;
}

const LastInfos = ({ title }: LastInfosProps) => {
  return title;
};

LastInfos.displayName = 'LastInfos';

export default LastInfos;
