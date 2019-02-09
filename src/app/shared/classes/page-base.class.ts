/**
 * An abstract class name that indicates the base
 * properties that each page needs.
 * So, all the pages should be extended from this
 */

export class PageBase {
  title;

  constructor(title) {
    this.title = title;
  }
}
