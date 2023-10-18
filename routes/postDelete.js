const express = require('express');

const request = require("request");

const router = express.Router();

const baseUrl = "https://bhaveshnetflix.live/";

let updateFunction = (item, item2) => {
  let options = {
    method: "POST",
    url: baseUrl + "update.php",
    formData: {
      update_query: item,
      select_query: item2,
    },
  };
  return options;
}

router.post('/deleteItem/:publicId', async (req, res, next) => {
  try {
    const videoId = req.params.publicId;
    const sid = req.query.sid;
    const seasonNumber = req.query.season;
    const title = req.query.title;
    const type = req.query.type;
    const lang = req.body.lang;

    // console.log(req.body);

    // console.log(videoId, req.query);

    // update the database

    const opt1 = updateFunction(
      "update videos set video_url = '', delete_url = '' "
        .concat("where video_id = '")
        .concat(`${videoId}`)
        .concat("' AND lang = '")
        .concat(`${lang}`)
        .concat("'"),
      "select * from videos"
    );

    request(opt1, (error, response) => {
      if (error) throw new Error(error);
      else {
        let x = JSON.parse(response.body);

        // console.log(x);

        if (x.length >= 1) {
          if (type === 'collectionMovie') {
            return res.redirect(`/v1/edit/${sid}/?season=${seasonNumber}&title=${title}&type=collection&lang=${lang}&langArray=[]`);
          }
          else {
            return res.redirect(`/v1/edit/${sid}/?season=${seasonNumber}&title=${title}&type=${type}&lang=${lang}&langArray=[]`);
          }
        }

        else {
          return res.json({
            error: "Failed..."
          })
        }
      }
    })
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete file' });
  }
})

module.exports = router;