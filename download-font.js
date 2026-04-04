const fs = require('fs');
const https = require('https');
const path = require('path');

const fonts = [
  {
    url: 'https://github.com/alif-type/amiri/raw/master/Amiri-Regular.ttf',
    dest: 'public/fonts/Amiri-Regular.ttf'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        download(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

(async () => {
  for (const font of fonts) {
    console.log(`Downloading ${font.url}...`);
    try {
      await download(font.url, font.dest);
      console.log(`Success: ${font.dest}`);
    } catch (err) {
      console.error(`Error downloading ${font.url}:`, err.message);
    }
  }
})();
