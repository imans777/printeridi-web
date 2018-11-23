/**
 * This should change the 'src/app/shared/servermatch.ts' to match with the server
 * and also change 'src/app/app.component.css' to match with the server
 */

try {
  const isToServer = process.argv.includes('--server') ? true :
    process.argv.includes('--local') ? false : true;
  require('./lib').changeServerMatchFileBasedOnFlask(isToServer);
  console.log('>>> BEFORE.JS - SUCCESSFULL');
} catch (err) {
  console.error('>>> BEFORE.JS - ERROR OCCURRED -> ', err);
}