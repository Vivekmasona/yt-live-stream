#!/usr/bin/env node
const path = require('path')
const express = require('express')
const nofavicon = require('express-no-favicons')
const { yellow, green, gray, blue } = require('chalk')
const youtube = require('./youtube')
const downloader = require('./downloader')
const app = express()

function listen (port, callback = () => {}) {
  app.use(nofavicon())

  app.get('/', (req, res) => {
    log('Sending test page')
    const file = path.resolve(__dirname, 'index.html')
    res.sendFile(file)
  })

  app.get('/chunk/:videoId', (req, res) => {
    const videoId = req.params.videoId

    try {
      log(`Sending chunk ${blue(videoId)}`)
      youtube.download({ id: videoId }, (err, { id, file }) => {
        if (err) return res.sendStatus(500, err)
        res.sendFile(file)
      })
    } catch (e) {
      log(e)
      res.sendStatus(500, e)
    }
  })

  app.get('/:videoId', (req, res) => {
    const videoId = req.params.videoId

    try {
      log(`Streaming ${yellow(videoId)}`)
      youtube.stream(videoId).pipe(res)
    } catch (e) {
      log(e)
      res.sendStatus(500, e)
    }
  })

  app.get('/cache/:videoId', (req, res) => {
    const videoId = req.params.videoId

    try {
      log(`Streaming cached ${green(videoId)}`)
      youtube.stream(videoId, true).pipe(res)
    } catch (e) {
      log(e)
      res.sendStatus(500, e)
    }
  })

  app.get('/search/:query/:page?', (req, res) => {
    const { query, page } = req.params
    const pageStr = page ? gray(` #${page}`) : ''
    log(`Searching ${yellow(query)}`, pageStr)
    youtube.search({ query, page }, (err, data) => {
      if (err) {
        log(err)
        res.sendStatus(500, err)
        return
      }

      res.json(data)
    })
  })

  app.get('/get/:id', (req, res) => {
    const id = req.params.id

    youtube.get(id, (err, data) => {
      if (err) {
        log(err)
        res.sendStatus(500, err)
        return
      }

      res.json(data)
    })
  })

  app.use((req, res) => {
    res.sendStatus(404)
  })

  app.listen(port, callback)
}

function log () {
  const now = new Date()
  console.log(gray(now.toISOString()), ...arguments)
}

module.exports = {
  listen,
  downloader,
  get: (id, callback) => youtube.get(id, callback),
  search: ({ query, page }, callback) =>
    youtube.search({ query, page }, callback),
  setKey: key => youtube.setKey(key)
}


const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const app = express();
// const fs = require("fs");

const corsOptions = {
  origin: "https://vivekfy.netlify.app", // change this origin as your like
  // origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.static("./static"));
const port = process.env.PORT || 5000;

app.get("/", (res) => {
  res.render("index.html");
});

app.get("/hack", async (req, res) => {
  const url = req.query.url;
  console.log(url);
  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title;
  const thumbnail = info.videoDetails.thumbnails[0].url;
  let formats = info.formats;

  const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
  // const format = ytdl.chooseFormat(info.formats, { quality: "249" });
  formats = formats.filter((format) => format.hasAudio === true);

  res.send({ title, thumbnail, audioFormats, formats });
});

app.get("/videodl", async (req, res) => {
  const url = req.query.url;
  const itag = req.query.itag;
  const type = req.query.type;

  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title;

  res.header("Content-Disposition", `attachment;  filename="${title}_vivekmasona"`);
  try {
    ytdl(url, { itag }).pipe(res);
  } catch (err) {
    console.log(err);
  }
});
app.get("/mp3", async (req, res) => {
  const url = req.query.url;
  const itag = req.query.itag;
  const type = req.query.type;

  // const info = await ytdl.getInfo(url);
  // const title = info.videoDetails.title;

  // res.header("Content-Disposition", `attachment;  filename="Download from.vivekmasona"`);
  try {
    ytdl(url, {
            format: 'mp3',
            filter: 'audioonly',
            quality: 'highest'
        }).pipe(res);

    } catch (err) {
        console.error(err);
    }
});
app.get("/audio", async (req, res) => {
  const url = req.query.url;
  const itag = req.query.itag;
  const type = req.query.type;

  // const info = await ytdl.getInfo(url);
  // const title = info.videoDetails.title;

  // res.header("Content-Disposition", `attachment;  filename="Download from.vivekmasona"`);
  try {
    ytdl(url, {
            format: 'mp3',
            filter: 'audioonly',
            quality: 'highest'
        }).pipe(res);

    } catch (err) {
        console.error(err);
    }
});
app.get("/music", async (req, res) => {
  const url = req.query.url;
  const itag = req.query.itag;
  const type = req.query.type;

  // const info = await ytdl.getInfo(url);
  // const title = info.videoDetails.title;

  // res.header("Content-Disposition", `attachment;  filename="Download from.vivekmasona"`);
  try {
    ytdl(url, {
            format: 'mp3',
            filter: 'audioonly',
            quality: 'highest'
        }).pipe(res);

    } catch (err) {
        console.error(err);
    }
});
app.get("/low-audio", async (req, res) => {
  const url = req.query.url;
  const itag = req.query.itag;
  const type = req.query.type;

  // const info = await ytdl.getInfo(url);
  // const title = info.videoDetails.title;

  // res.header("Content-Disposition", `attachment;  filename="Download from.vivekmasona"`);
  try {
    ytdl(url, {
            format: 'mp3',
            filter: 'audioonly',
            quality: 'lowest'
        }).pipe(res);

    } catch (err) {
        console.error(err);
    }
});

app.get("/audiodl", async (req, res) => {
  const url = req.query.url;
  const itag = req.query.itag;
  const type = req.query.type;

  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title;

  res.header("Content-Disposition", `attachment;  filename="${title}_vivekmasona"`);
  try {
    ytdl(url, {
            format: 'mp3',
            filter: 'audioonly',
            quality: 'highest'
        }).pipe(res);

    } catch (err) {
        console.error(err);
    }
});

app.get("/low-audiodl", async (req, res) => {
  const url = req.query.url;
  const itag = req.query.itag;
  const type = req.query.type;

  // const info = await ytdl.getInfo(url);
  // const title = info.videoDetails.title;

  res.header("Content-Disposition", `attachment;  filename="Download from.vivekmasona"`);
  try {
    ytdl(url, {
            format: 'mp3',
            filter: 'audioonly',
            quality: 'lowest'
        }).pipe(res);

    } catch (err) {
        console.error(err);
    }
});


app.get("/video", async (req, res) => {
  const url = req.query.url;
  const itag = req.query.itag;
  const type = req.query.type;

  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title;

  // res.header("Content-Disposition", `attachment;  filename="Download from.vivekmasona"`);
  try {
    ytdl(url, { itag }).pipe(res);
  } catch (err) {
    console.log(err);
  }
});

// app.get('*', (req, res) => {
//   res.render('error')
// })

app.listen(port, () => {
  console.log("Running ...");
});

