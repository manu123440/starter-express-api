const express = require('express');

const request = require("request-promise-any");

const router = express.Router();

const baseUrl = "https://bhaveshnetflix.live/";
const tmdbUrl = "https://api.themoviedb.org/3";

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

router.get("/edit/:sid", (req, res, next) => {
	const { sid } = req.params;
	const { season } = req.query;
	const { title } = req.query;
	const { type } = req.query;
	const { lang } = req.query;
	const langArray = [{ name: `${lang}` }];

	// console.log(langArray, typeof langArray);

	let url = '';

	// console.log(sid, season, title, type, lang);

	// console.log(req.query, req.params);

	if (type === 'tv') {
		url = `${tmdbUrl}/tv/${sid}/season/${season}?language=en-US`;
	}

	else if (type === 'collection') {
		url = `${tmdbUrl}/collection/${sid}?language=en-US`;
	}

	else {
		url = `${tmdbUrl}/movie/${sid}?language=en-US`;
	}

	// console.log(url);

	const options = {
	  method: 'GET',
	  headers: {
	    accept: 'application/json',
	    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTc3NGEwZDMxOTQzMTg0MmM4YWI4OGVkOTk1YjUxNSIsInN1YiI6IjY0YzUzYTc0Y2FkYjZiMDE0NDBkNTc1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.L-7MHPqHHx0avE_n4Y3kU49FEJ02CsOb54b8Mbp2NCs'
	  }
	};

	try {
		request(url, options)
		  	.then(data => {
			  	// console.log(JSON.parse(data));
			  	const result = JSON.parse(data);

			  	// console.log(result);

			  	let opt1 = selectFunction(
				  	"select * from videos where season_id = '"
				  		.concat(`${sid}`)
				  		.concat("' AND season_number = '")
				  		.concat(`${season}`)
				  		.concat("' AND lang = '")
				  		.concat(`${lang}`)
				  		.concat("' ORDER BY video_id ASC")
				  )

			  	if (result.id && result.hasOwnProperty("episodes")) {
			  		// console.log("seasons");
			  		const episodeName = result.episodes.map(ep => ep.name);
			  		const episodeId = result.episodes.map(ep => ep.id);

			  		// console.log(episodeId, episodeName);

			  		request(opt1, (error, response) => {
					    if (error) throw new Error(error);
					    else {
					    	let x = JSON.parse(response.body);

					    	// console.log(x);

					    	if (x.length >= 1) {
					    		const urlArray = episodeId.map((id, index) => {
									  let matchingData = x.find((item) => item.video_id === id.toString());
									  return {
									    id: id,
									    name: episodeName[index],
									    url: matchingData ? matchingData.video_url : '',
									    delUrl: matchingData ? matchingData.delete_url : '',
									    subUrl: matchingData ? matchingData.sub_url : '',
									    subDelUrl: matchingData ? matchingData.sub_del_url : ''
									  };
									});

						    	// console.log(urlArray);
						    	const sTitle = `${title} Season ${season}`;

						    	return res.render("form3", {
								    editing: true,
								    dataArray: urlArray,
								    season: season,
								    sid: sid,
								    title: sTitle,
								    type: type,
								    langArray: langArray
									});
					    	}

					    	else {
			  					// return res.send("add one?");
			  					return res.render("form4", {
                    editing: false,
                    dataArray: [],
                    season: season,
                    sid: sid,
                    title: title,
                    type: type,
                    langArray: langArray
                	});
						  	}
					    }
					  })
			  	}

			  	else if (result.id && result.hasOwnProperty("parts")) {
			  		// console.log("collections");
			  		const episodeId = result.parts.map(ep => ep.id);
			  		const episodeName = result.parts.map(ep => ep.title);
			  		// console.log(episodeId);

			  		request(opt1, (error, response) => {
					    if (error) throw new Error(error);
					    else {
					    	let x = JSON.parse(response.body);

					    	// console.log(x);

					    	if (x.length >= 1) {
					    		const urlArray = episodeId.map((id, index) => {
									  let matchingData = x.find((item) => item.video_id === id.toString());
									  return {
									    id: id,
									    name: episodeName[index],
									    url: matchingData ? matchingData.video_url : '',
									    delUrl: matchingData ? matchingData.delete_url : '',
									    subUrl: matchingData ? matchingData.sub_url : '',
									    subDelUrl: matchingData ? matchingData.sub_del_url : ''
									  };
									});

						    	// console.log(urlArray);

						    	return res.render("form3", {
								    editing: true,
								    dataArray: urlArray,
								    season: season,
								    sid: sid,
								    title: title,
								    type: 'collectionMovie',
								    langArray: langArray
									});
						  	}

						  	else {
			  					return res.redirect("/v1/add");
						  	}
					    }
					  })
			  	}

			  	else if (result.id) {
			  		// console.log("movie");
			  		request(opt1, (error, response) => {
					    if (error) throw new Error(error);
					    else {
					    	let x = JSON.parse(response.body);

					    	// console.log(x);
					    	if (x.length >= 1) {
					    		const urlArray = [{
					    			id: x[0].video_id,
					    			name: result.title,
					    			url: x[0].video_url,
					    			delUrl: x[0].delete_url,
					    			subUrl: x[0].sub_url,
									  subDelUrl: x[0].sub_del_url
					    		}];
					    		// console.log(urlArray);

					  			return res.render("form3", {
								    editing: true,
								    dataArray: urlArray,
								    season: season,
								    sid: sid,
								    title: title,
								    type: 'movie',
								    langArray: langArray
									});
					    	}

					    	else {
			  					return res.redirect("/v1/add");
					    	}
					    }
				  	})
			  	}

			  	else {
			  		// console.log("none");
			  		return res.json({
			  			'message': "no data found..."
			  		})
			  	}
				})
				
		  	.catch(err => {
		  		// console.log('error:');
		  		return res.json({
					  "message": "no data found..."
					})
		  	});
	}
	catch(error) {
		// console.log(error);
		return res.json({ 'message': 'error' })
	}
})

module.exports = router;