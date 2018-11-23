export class ServerMatch {

  public static STATIC: string = '../../';

  /**
   * STATIC is for development-mode
   * But for the server, it's input should be changed to a server static value, which for flask is '/static/'
   * For every image urls, local links, etc. in the application, this must be used before the url
   * e.g.
   *  let imageUrl = ServerMatch.STATIC + 'assets/custom_image.png';
   * 
   * 
   * CHANGING THIS FOR LOCAL AND SERVER IS DONE AUTOMATICALLY
   */

  constructor() {}

}
