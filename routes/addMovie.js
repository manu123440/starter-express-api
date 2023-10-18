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

router.get('/add', async (req, res, next) => {
    try {
        let opt1 = selectFunction(
            "select * from languages"
        );

        request(opt1, (error, response) => {
            if (error) throw new Error(error);
            else {
                let x = JSON.parse(response.body);

                // console.log(x);

                return res.render("form3", {
                    editing: false,
                    dataArray: [],
                    season: '',
                    sid: '',
                    title: '',
                    type: '',
                    langArray: x
                });
            }
        })
    }
    catch(error) {
        // console.log(error);
        return res.redirect('/v1/home');
    }
})

module.exports = router;