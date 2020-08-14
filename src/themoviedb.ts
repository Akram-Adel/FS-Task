/* eslint-disable lines-between-class-members */
interface IConfigApi {
  images:
  {
    base_url: string
    backdrop_sizes: string[]
  }
}

export default class TheMovieDb {
  static readonly API_URL = 'https://api.themoviedb.org/3'
  static readonly API_KEY = '' /* Add you Key here */

  private static img_base_url: string | undefined
  private static img_sizes: number[] | undefined

  /**
   * @description
   * Get IConfigApi from API then sets image base_url
   * and sizes
   * @returns boolean that indicate whether the call
   * succeeded of not
   */
  static async setConfigData(): Promise<boolean> {
    if (this.img_base_url) return true;

    try
    {
      const fetchedConfig = await fetch(`${TheMovieDb.API_URL}/configuration?api_key=${TheMovieDb.API_KEY}`);
      if (!fetchedConfig.ok) throw new Error('Not 2xx response');

      const configApi: IConfigApi = await fetchedConfig.json();
      this.img_base_url = configApi.images.base_url;
      this.img_sizes = configApi.images.backdrop_sizes
        .filter((size) => size.substr(0, 1) === 'w')
        .map((size) => +size.substr(1)).sort((a, b) => a - b);

      return true;
    }
    catch (err)
    {
      return false;
    }
  }
  /**
   * Returns size string from db sizes that is smaller
   * that or equal `size`
   */
  static getSizeClosest(size: number): string {
    if (!this.img_sizes) return '';

    const filteredSizes = (this.img_sizes as number[]).filter((iSize) => iSize <= size);
    const imgSize: number = (filteredSizes.length !== 0)
      ? filteredSizes[filteredSizes.length - 1]
      : (this.img_sizes as number[])[0];

    return `w${imgSize}`;
  }
  /**
   * @description
   * Returns full image url
   */
  static getImage(size: string, link: string): string {
    return (!this.img_base_url)
      ? '404_URL' /* A fallback url goes here */
      : `${this.img_base_url}${size}${link}`;
  }
}
