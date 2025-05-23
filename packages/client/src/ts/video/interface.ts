export type VideoEncodeResponse = {
  /** encoding process id, useful for check API */
  processid: string;
  /** encoding API state */
  state: 'running' | 'succeed' | 'error';
};

export type VideoUploadParams = {
  data: {
    device: string | undefined;
    browser: { name: string | undefined; version: string | undefined };
    url: string;
    file: Blob;
    filename: string;
    weight: number;
  };
  appCode: string;
  captation: boolean;
  duration: number;
};

export type VideoUploadResponse = VideoEncodeResponse & {
  /** ID of the video file. */
  videoid?: string;
  /** size of the encoded video, in bytes. */
  videosize?: number;
  /** ID of the video document in Workspace. */
  videoworkspaceid?: string;
  /** Error code (i18n key), when state==="error" */
  code?: string;
};

export type VideoPublicConfResponse = {
  'accept-videoupload-extensions': Array<string>;
  'max-videoduration-minutes': number;
  'max-videosize-mbytes': number;
};

export type VideoConf = {
  acceptVideoUploadExtensions: Array<string>;
  maxDuration: number;
  maxWeight: number;
};
