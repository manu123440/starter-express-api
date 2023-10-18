const express = require('express');

const request = require('request');

const router = express.Router();

const baseUrl = "https://bhaveshnetflix.live/";

let insertFunction = (item, item2) => {
  let options = {
    method: "POST",
    url: baseUrl + "insert.php",
    formData: {
      insert_query: item,
      select_query: item2,
    },
  };
  return options;
};

router.post('/upload',
    async (req, res, next) => {
        // console.log(req.body);

        const type = req.body.selectedMediaType;

        const lang = req.body.lang;

        // console.log(type);

        if (type === 'tv') {
            const seasonId = req.body.selectedMovieId;

            const seasonNumber = req.body.seasonNumber[0];

            const episodeId = req.body.episodeId;

            const episodeVal = req.body.episodeVal;

            const episodeDeleteVal = req.body.episodeDeleteVal;

            const episodeSubVal = req.body.episode_Sub_Val;

            const episodeSubDeleteVal = req.body.episode_Sub_DeleteVal;

            const combinedData = episodeVal.map((val, index) => {
                return {
                    id: episodeId[index],
                    url: episodeVal[index],
                    delUrl: episodeDeleteVal[index],
                    subUrl: episodeSubVal[index],
                    subDelUrl: episodeSubDeleteVal[index]
                };
            });

            // console.log(combinedData);

            try {
                if (combinedData.length >= 1) {
                    combinedData.forEach(i => {
                        const url = (i.url === '') ? '' : i.url;

                        let values1 = `\'${seasonId}\', '${seasonNumber}\', '${type}\', '${lang}\', '${i.id}\', '${url}\', '${i.delUrl}\', '${i.subUrl}\', '${i.subDelUrl}\'`;

                        // console.log(values1);

                        let opt1 = insertFunction(
                            "insert into videos (season_id, season_number, season_type, lang, video_id, video_url, delete_url, sub_url, sub_del_url) values("
                                .concat(`${values1}`)
                                .concat(")"),
                            "select * from videos"
                        );

                        // console.log(opt1);

                        request(opt1, (error, response) => {
                            if (error) throw new Error(error);
                            else {
                                let x = JSON.parse(response.body);
                                // console.log(x);
                            }
                        })
                    })
                }
                else {
                    return res.json({
                        isSuccess: false
                    })
                }
            }

            catch(error) {
                console.log(error);
                return res.json({
                    isSuccess: false
                })
            }

            return res.redirect("/v1/home");           
        }

        else if (type === 'movie') {
            // console.log(type);
            const selectedMovieName = req.body.selectedMovieName;
            const selectedMovieId = req.body.selectedMovieId;

            const movieId = req.body.movieId;
            const movieVal = req.body.movieVal;
            const movieName = req.body.movieName;
            const movieDelVal = req.body.movieDelVal;
            const movieSubVal = req.body.episode_Sub_Val;
            const movieSubDeleteVal = req.body.episode_Sub_DeleteVal;

            // console.log(typeof movieId, typeof movieVal, typeof movieName);

            if (typeof movieId === 'object' 
                && typeof movieVal === 'object' 
                && typeof movieName === 'object'
            ) {
                const combinedData = movieVal.map((val, index) => {
                    return {
                        id: movieId[index],
                        url: movieVal[index],
                        delUrl: movieDelVal[index],
                        subUrl: movieSubVal[index],
                        subDelUrl: movieSubDeleteVal[index]
                    };
                });

                // console.log(combinedData);

                combinedData.forEach(i => {
                    const url = (i.url === '') ? '' : i.url;

                    let values1 = `\'${selectedMovieId}\', 'null\', 'collectionMovie\', '${lang}\', '${i.id}\', '${url}\', '${i.delUrl}\', '${i.subUrl}\', '${i.subDelUrl}\'`;

                    // console.log(values1);

                    let opt1 = insertFunction(
                        "insert into videos (season_id, season_number, season_type, lang, video_id, video_url, delete_url, sub_url, sub_del_url) values("
                            .concat(`${values1}`)
                            .concat(")"),
                        "select * from videos"
                    );

                    // console.log(opt1);

                    request(opt1, (error, response) => {
                        if (error) throw new Error(error);
                        else {
                            let x = JSON.parse(response.body);
                            // console.log(x);
                        }
                    })
                })
            }

            else {
                let values1 = `\'${movieId}\', 'null\', '${type}\', '${lang}\', '${movieId}\', '${movieVal}\', '${movieDelVal}\', '${movieSubVal}\', '${movieSubDeleteVal}\'`;

                // console.log(values1);

                let opt1 = insertFunction(
                    "insert into videos (season_id, season_number, season_type, lang, video_id, video_url, delete_url, sub_url, sub_del_url) values("                   
                        .concat(`${values1}`)
                        .concat(")"),
                    "select * from videos"
                );

                request(opt1, (error, response) => {
                    if (error) throw new Error(error);
                    else {
                        let x = JSON.parse(response.body);
                        // console.log(x);
                    }
                })
            }

            return res.redirect("/v1/home");           
        }
});

module.exports = router;