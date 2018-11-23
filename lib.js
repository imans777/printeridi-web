const fs = require('fs');
const readline = require('readline');

const DjangoPlatform = 'Django';
const FlaskPlatform = 'Flask';
const platform = FlaskPlatform;

// DEPRECATED
let changeFile = function (changeToServer = true, cb) {
  const servermatchPath = 'src/app/shared/servermatch.ts';
  const appCSSPath = 'src/app/app.component.css';
  let rs = fs.createReadStream(servermatchPath);
  const rl = readline.createInterface({
    input: rs,
  });

  rs.on('error', (err) => {
    console.log("<<< BEFORE: ERROR OCCURED IN CHANGING SERVERMATCH.ts!", err);
    cb();
  });

  let finalServerMatchTs = '';
  let localStatic = "'../../';", serverStatic = "'/static/';";
  rl.on('line', function (line) {
    let words;
    words = line.trim().split(' ');

    //on the end of the file, to wrap things up
    if (line === '}') {
      finalServerMatchTs += line + '\n';
      rl.close();
      fs.writeFileSync(servermatchPath, finalServerMatchTs, 'utf-8');

      let cssData = changeToServer ? '@import "/static/assets/fonts/iran-fonts/index.css";' : '@import "../assets/fonts/iran-fonts/index.css";';
      fs.writeFileSync(appCSSPath, cssData, 'utf-8');

      if (changeToServer)
        console.log('>>> BEFORE: SERVERMATCH.ts HAS BEEN SET TO SERVER!\n>>> BEFORE: APP.css HAS BEEN SET TO SERVER!');
      else
        console.log('>>> BEFORE: SERVERMATCH.ts HAS BEEN RESET TO LOCAL!\n>>> BEFORE: APP.css HAS BEEN RESET TO LOCAL!');

      cb();
    }

    //this is where the change is made
    if (words && words.length >= 6 && words[2] === 'STATIC:') {
      if (changeToServer)
        words[5] = serverStatic;
      else
        words[5] = localStatic;

      let thisLine = '  ' + words.join(' ');
      finalServerMatchTs += thisLine + '\n';
      return;
    }

    //set local and server statics
    if (words && words.length >= 1 && words[0] === 'SERVER_STATIC:') {
      serverStatic = words[3];
    }
    else if (words && words.length >= 6 && words[2] === 'STATIC:') {
      localStatic = words[5];
    }

    //normal condition, add the line to the file :D
    finalServerMatchTs += line + '\n';
  });
};

// DEPRECATED
let changeIndexHTMLFile = function () {
  const indexHTMLPath = 'dist/index.html';
  let rs = fs.createReadStream(indexHTMLPath);
  const rlt = readline.createInterface({
    input: rs,
  });

  rs.on('error', (err) => {
    changeFile(false, () => {
      console.log("<<< AFTER: ERROR OCCURRED IN CHANGING INDEX FILE!", err);
    })
  });

  let isFirstLine = true;
  let finalIndex = '';
  rlt.on('line', function (line) {
    if (isFirstLine) {
      //DJANGO
      if (platform === DjangoPlatform) {
        finalIndex += '{% load static %}\n';
      }
      isFirstLine = false;
    }

    let words;
    words = line.trim().split(' ');

    //on the end of the file, to wrap things up
    if (line === '</html>') {
      finalIndex += line + '\n';
      rlt.close();
      fs.writeFileSync(indexHTMLPath, finalIndex, 'utf-8');
      changeFile(false, () => {
        console.log('>>> AFTER: INDEX FILE HAS BEEN CHANGED TO MATCH WITH THE SERVER!');
      });
      return;
    }

    //change the necessaries
    if (words && words.length > 0 && words[0] === '<script') {
      //DJANGO
      let scriptLine;
      if (platform == DjangoPlatform) {
        scriptLine = `
        <script type="text/javascript" src="{% static 'inline.bundle.js' %}"></script>
        <script type="text/javascript" src="{% static 'polyfills.bundle.js' %}"></script>
        <script type="text/javascript" src="{% static 'styles.bundle.js' %}"></script>
        <script type="text/javascript" src="{% static 'vendor.bundle.js' %}"></script>
        <script type="text/javascript" src="{% static 'main.bundle.js' %}"></script>
      </body>
      `;
      }
      //FLASK
      else if (platform == FlaskPlatform) {
        scriptLine = `
        <script type="text/javascript" src="static/inline.bundle.js"></script>
        <script type="text/javascript" src="static/polyfills.bundle.js"></script>
        <script type="text/javascript" src="static/styles.bundle.js"></script>
        <script type="text/javascript" src="static/vendor.bundle.js"></script>
        <script type="text/javascript" src="static/main.bundle.js"></script>
      </body>`;
      }
      finalIndex += scriptLine + '\n';
      return;
    }
    else if (words && words.length > 0 &&
      words[0] === '<img' && words[1] === 'src="assets/loader.gif"') {
      let scriptLine;
      //DJANGO
      if (platform === DjangoPlatform) {
        scriptLine = `        <img src="{% static 'assets/loader.gif' %}" alt="Loading..."/>`;
      }
      //FLASK
      else if (platform === FlaskPlatform) {
        scriptLine = `        <img src="/static/assets/loader.gif" alt="Loading..."/>`;
      }
      finalIndex += scriptLine + '\n';
      return;
    }

    finalIndex += line + '\n';
  });
};

changeServerMatchFileBasedOnFlask = function (isToServer) {
  const serverMatchPath = 'src/app/shared/servermatch.ts';
  const appCSSPath = 'src/app/app.component.css';
  let sdata = fs.readFileSync(serverMatchPath).toString('utf-8'),
    adata = fs.readFileSync(appCSSPath).toString('utf-8');

  const sTexts = [
    {
      local: '../../',
      server: '/static/'
    }
  ], aTexts = [
    {
      local: '../assets',
      server: '/static/assets'
    }
  ];

  let from = isToServer ? 'local' : 'server',
    to = isToServer ? 'server' : 'local';

  sTexts.forEach(el => {
    const match = new RegExp(el[from], 'g');
    sdata = sdata.replace(match, el[to]);
  });

  aTexts.forEach(el => {
    const match = new RegExp(el[from], 'g');
    adata = adata.replace(match, el[to]);
  });

  fs.writeFileSync(serverMatchPath, sdata);
  fs.writeFileSync(appCSSPath, adata);
}

changeIndexHTMLFileBasedOnFlask = function () {
  const indexHTMLPath = 'dist/index.html';
  let data = fs.readFileSync(indexHTMLPath).toString('utf-8');

  const texts = [
    'static/',
    '/static/',
  ];

  let checkers = [
    {
      address: 'link href="',
      textUse: 1,
      matcher: '(?!http)',
      flags: 'gm',
    },
    {
      address: 'img src="',
      textUse: 1,
      matcher: '',
      flags: 'g',
    },
    {
      address: 'javascript" src="',
      textUse: 0,
      matcher: '',
      flags: 'g',
    },
  ];

  checkers.forEach(el => {
    const match = new RegExp(el.address + (el.matcher || ''), el.flags || 'g');
    data = data.replace(match, `${el.address}${texts[el.textUse]}`);
  });

  fs.writeFileSync(indexHTMLPath, data);
};

let deprecated = {
  changeFile,
  changeIndexHTMLFile
};

module.exports = {
  deprecated,
  changeIndexHTMLFileBasedOnFlask,
  changeServerMatchFileBasedOnFlask,
};
