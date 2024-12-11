/**
 * ImageResizer is a utility class that provides methods to resize and compress images.
 */
export default class ImageResizer {
  /**
   * Adjusts the dimensions of an image to fit within the specified maximum width and height,
   * preserving the aspect ratio.
   *
   * @param height - The original height of the image.
   * @param maxHeight - The maximum allowed height for the image.
   * @param width - The original width of the image.
   * @param maxWidth - The maximum allowed width for the image.
   * @returns An object containing the adjusted height and width of the image.
   */
  private static changeDimension(
    height: number,
    maxHeight: number,
    width: number,
    maxWidth: number,
  ): { height: number; width: number } {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
    return { height, width };
  }

  /**
   * Renames the file extension of a given filename.
   *
   * @param filename - The original filename whose extension needs to be changed.
   * @param newExtension - The new extension to be applied to the filename.
   * @returns The filename with the new extension.
   */
  private static renameFileNameExtension(
    filename: string,
    newExtension: string,
  ): string {
    const filenameParts = filename.split('.');
    filenameParts.pop();
    return filenameParts.join('.') + '.' + newExtension;
  }

  /**
   * Resizes an image to the specified dimensions and compresses it to the specified format and quality.
   *
   * @param image - The HTMLImageElement to be resized.
   * @param fileName - The name of the output file.
   * @param maxWidth - The maximum width of the resized image.
   * @param maxHeight - The maximum height of the resized image.
   * @param compressFormat - The format to compress the image to (default is "jpeg").
   * @param quality - The quality of the compressed image, as a percentage (default is 80).
   * @returns A Promise that resolves to a File object containing the resized and compressed image.
   */
  private static resizeImage(
    image: HTMLImageElement,
    fileName: string,
    maxWidth: number,
    maxHeight: number,
    compressFormat = 'jpeg',
    quality = 80,
  ): Promise<File> {
    const qualityDecimal = quality / 100;
    const canvas = document.createElement('canvas');
    const contentType = `image/${compressFormat}`;

    let width = image.width;
    let height = image.height;

    const newHeightWidth = this.changeDimension(
      height,
      maxHeight,
      width,
      maxWidth,
    );

    width = newHeightWidth.width;
    height = newHeightWidth.height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = width;
      canvas.height = height;

      // Fill the canvas with white color to avoid black background on transparent images
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (ctx.imageSmoothingEnabled && ctx.imageSmoothingQuality) {
        ctx.imageSmoothingQuality = 'high';
      }

      ctx.drawImage(image, 0, 0, width, height);
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(
              new File([blob], fileName, {
                type: contentType,
                lastModified: new Date().getTime(),
              }),
            );
          } else {
            reject();
          }
        },
        contentType,
        qualityDecimal,
      );
    });
  }

  /**
   * Resize and compress Image File in JPEG format (other format don't work well with canvas.toBlob() with quality parameter)
   * @param file  The image file to resize
   * @param maxWidth  The maximum width of the resized image
   * @param maxHeight   The maximum height of the resized image
   * @param quality   The quality of the compressed image
   * @returns   The resized image file
   */
  static async resizeImageFile(
    file: File,
    maxWidth: number = 1440,
    maxHeight: number = 1440,
    quality: number = 80,
  ): Promise<File> {
    if (!file) throw Error('Image resizer: file not found!');

    if (!file.type || !file.type.startsWith('image/'))
      throw Error('Image resizer: the file given is not an image.');

    const compressFormat = 'jpeg';

    return new Promise((resolve) => {
      const image = new Image();
      image.setAttribute('style', 'max-width: none;');
      image.src = URL.createObjectURL(file);
      image.onload = async () => {
        const resizedFile = await this.resizeImage(
          image,
          this.renameFileNameExtension(file.name, compressFormat),
          maxWidth,
          maxHeight,
          compressFormat,
          quality,
        );
        resolve(resizedFile);
      };
      image.onerror = (error) => {
        throw Error('Image Loading Error: ' + error);
      };
    });
  }
}
