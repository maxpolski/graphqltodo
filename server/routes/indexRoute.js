import Promise from 'bluebird';

const fs = Promise.promisifyAll(require('fs'));

export default async (req, res) => {
  const indexHTMLFile = await fs.readFileAsync('static/index.html');
  res
    .set('Content-Type', 'text/html')
    .send(indexHTMLFile);
};
