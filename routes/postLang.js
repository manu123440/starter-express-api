const express = require('express');

const request = require("request");

const router = express.Router();

const baseUrl = "https://bhaveshnetflix.live/";

let selectFunction = (item) => {
  let options = {
    method: "POST",
    url: baseUrl + "select.php",
    formData: {
      select_query: item,
    },
  };
  return options;
};

router.get('/postLang', async (req, res, next) => {
  return res.redirect('/v1/home?page=1&editing=true');
})

module.exports = router;