import { APP } from '../globals';
import { IOdeServices } from '../services/OdeServices';
import {
  VideoConf,
  VideoEncodeResponse,
  VideoPublicConfResponse,
  VideoUploadParams,
  VideoUploadResponse,
} from './interface';

export class VideoService {
  private static MAX_WEIGHT = 50; // in Mbytes. Applies to uploaded videos.
  private static MAX_DURATION = 3; // in minutes. Applies to recorded videos.

  constructor(private context: IOdeServices) {}

  private get http() {
    return this.context.http();
  }

  private get conf() {
    return this.context.conf();
  }

  /**
   * Returns the video app public conf (maxWeight, maxDuration and accepted extensions)
   * @returns the Video app public conf
   */
  public async getVideoConf(): Promise<VideoConf> {
    const publicConf: VideoPublicConfResponse = await this.conf.getPublicConf(
      APP.VIDEO,
    );
    return {
      maxWeight:
        publicConf?.['max-videosize-mbytes'] ?? VideoService.MAX_WEIGHT,
      maxDuration:
        publicConf?.['max-videoduration-minutes'] ?? VideoService.MAX_DURATION,
      acceptVideoUploadExtensions:
        publicConf?.['accept-videoupload-extensions']?.map((ext) =>
          ext.toUpperCase(),
        ) ?? [],
    };
  }

  /**
   * Starts the encoding process and check when video is fully processed.
   * @param params cf VideoUploadParams
   * @returns a VideoCheckResponse
   */
  public async upload({
    data,
    appCode,
    captation,
    duration,
  }: VideoUploadParams): Promise<VideoUploadResponse> {
    if (!data.file) {
      throw new Error('Invalid video file.');
    }

    if (!data.filename) {
      throw new Error('Invalid video filename');
    }

    const browser = `${data.browser.name} ${data.browser.version}`;

    const formData = new FormData();
    formData.append('device', data.device || '');
    formData.append('browser', browser);
    formData.append('url', data.url);
    formData.append('app', appCode);
    formData.append('file', data.file, data.filename);
    formData.append('weight', '' + data.file.size);
    formData.append('captation', '' + captation);

    let encodeUrl = `/video/encode?captation=${captation}`;
    if (duration) {
      encodeUrl += `&duration=${duration}`;
    }

    // post video to /video/encode API
    const encodeResponse = await this.http.post<VideoEncodeResponse>(
      encodeUrl,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );

    // if encoding request is pending then get /video/status API to get final result
    if (encodeResponse.state == 'running') {
      let previous = 0;
      let seconds = 1;
      do {
        // Wait then check status
        const waitDuration = seconds + previous;
        await new Promise((resolve) =>
          setTimeout(resolve, waitDuration * 1000),
        );
        previous = seconds;
        seconds = Math.min(8, waitDuration); // Fibonacci limited to 8
        const checkResponse = await this.http.get<VideoUploadResponse>(
          `/video/status/${encodeResponse.processid}`,
        );
        if (checkResponse.state == 'succeed') {
          if (checkResponse.videoworkspaceid && checkResponse.videosize) {
            // Track a VIDEO_SAVE event
            this.context
              .data()
              .trackVideoSave(
                checkResponse.videoworkspaceid,
                Math.round(duration),
                checkResponse.videosize,
                captation,
                data.url,
                browser,
                data.device,
              );
          }
          return checkResponse;
        }
        if (checkResponse.state == 'error') {
          break;
        }
        // eslint-disable-next-line no-constant-condition
      } while (true);
    }
    throw new Error('Video cannot be uploaded.');
  }
}
