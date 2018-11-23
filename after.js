/**
 * This should change the dist/index.html to match with the server
 * and should also change 'servermatch' and 'app.css' to match with the default local
 */

try {
  require('./lib').changeIndexHTMLFileBasedOnFlask();
  console.log('<<< AFTER.JS - SUCCESSFULL');
  require('./lib').changeServerMatchFileBasedOnFlask(false);
} catch (err) {
  console.error('<<< AFTER.JS - ERROR OCCURRED -> ', err);
}

/**
 * IF WANTED TO DO THIS MANUALLY:
 * add 'static/' before all the js source files (often 3)
 * add '/static/' before all the css source files (often 2) and also to imgs (often 1)
 */

/**
 * CAUTION:
 * if you have a link that its href
 * starts with 'h' and it's local (not http, etc.)
 * you need to consider this manually!
 */