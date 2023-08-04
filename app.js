const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser'); 
const shortid = require('shortid'); // acak moment
const app = express();
const port = 1000; //ganti port default website adalah 80
const dbFile = 'database.json'; //database json

app.use(bodyParser.urlencoded({ extended: true }));
function readData() {
  try {
    const data = fs.readFileSync(dbFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { urls: {} };
  }
}
function saveData(data) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(dbFile, jsonData, 'utf8');
  } catch (err) {
    console.error('Gagal save data:', err);
  }
}

// file html gua taruh sini karena mager
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Short URL Generator</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;">
      </head>
      <body>
        <div class="container mt-5">
          <h1>Short URL Generator</h1>
          <form action="/shorten" method="post" class="mt-3">
            <input type="url" name="longUrl" placeholder="URL Awal" class="form-control mb-3" required>
            <input type="text" name="shortUrl" placeholder="Custom path" class="form-control mb-3">
            <button type="submit" class="btn btn-primary">Shorten URL</button>
          </form>
        </div>
      </body>
    </html>
  `);
});
app.post('/shorten', (req, res) => {
  const longUrl = req.body.longUrl;
  const shortUrl = req.body.shortUrl || shortid.generate();

  const data = readData();
  if (data.urls[shortUrl]) {
    return res.send(`Custom URL ${shortUrl} ganti path lain`);
  }

  data.urls[shortUrl] = longUrl;
  saveData(data);
  const shortenedUrl = `http://localhost:${port}/${shortUrl}`;
  res.send(`Hasil Short url: <a href="${shortenedUrl}">${shortenedUrl}</a>`);
});

app.get('/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  const data = readData();
  const longUrl = data.urls[shortUrl];

  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).send('Gagal Bos');
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
