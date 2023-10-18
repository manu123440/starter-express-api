    globalThis.document.addEventListener('DOMContentLoaded', () => {
      const searchInput = globalThis.document.getElementById('searchInput');
      const searchResults = globalThis.document.getElementById('searchResults');
      const searchSeasons = globalThis.document.getElementById('seasons');
      const selectedMovieIdInput = globalThis.document.getElementById('selectedMovieId');
      const selectedMediaType = globalThis.document.getElementById('selectedMediaType');
      const form = globalThis.document.getElementById('searchForm');
      const tvButton = globalThis.document.getElementById('tvButton');
      const movieButton = globalThis.document.getElementById('movieButton');
      const searchTypeContainer = globalThis.document.getElementById('searchTypeContainer');
      const searchMovieContainer = globalThis.document.getElementById('searchMovieContainer');
      const clearButton = globalThis.document.getElementById('clearButton');
      const episodeList = globalThis.document.getElementById('episodeList');
      const submitButton = document.getElementById('subBtn');
      const spinner = document.getElementById('spinner-border');

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTc3NGEwZDMxOTQzMTg0MmM4YWI4OGVkOTk1YjUxNSIsInN1YiI6IjY0YzUzYTc0Y2FkYjZiMDE0NDBkNTc1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.L-7MHPqHHx0avE_n4Y3kU49FEJ02CsOb54b8Mbp2NCs',
        }
      };

      Cookies.set('name', 'value', {
        sameSite: 'none',
        secure: true
      });

      let baseUrl = 'https://api.themoviedb.org/3';
      let uploadedVideos = 0;

      // Function to fetch data from the API
      const fetchDataFromAPI = async (searchTerm) => {
        try {
          const url = `${baseUrl}/search/multi?query=${searchTerm}&include_adult=false&language=en-US&page=1`;
          // console.log(url);
          const response = await fetch(url, options);
          const data = await response.json();
          // console.log(data);
          return data.results;
        } catch (error) {
          console.error('Error fetching data:', error);
          return [];
        }
      };

      const fetchDataFromTVAPI = async (searchTerm, mediaType, id) => {
        try {
          let url;
          if (mediaType === 'tv') {
            url = `${baseUrl}/tv/${id}?language=en-US`;
          }
          // console.log(url, id);
          const response = await fetch(url, options);
          const data = await response.json();
          // console.log(data);
          return data.seasons;
        } catch (error) {
          console.error('Error fetching data:', error);
          return [];
        }
      };

      const fetchDataFromMovieAPI = async (id) => {
        try {
          const url = `${baseUrl}/movie/${id}?language=en-US`;
          const response = await fetch(url, options);
          const data = await response.json();
          // console.log(data);
          return data;
        } catch (error) {
          console.error('Error fetching data:', error);
          return [];
        }
      }

      const fetchDataFromCollectionsAPI = async (id) => {
        try {
          const url = `${baseUrl}/collection/${id}?language=en-US`;
          const response = await fetch(url, options);
          const data = await response.json();
          // console.log(data);
          return data.parts;
        } catch (error) {
          console.error('Error fetching data:', error);
          return [];
        }
      }

      const fetchSeasonData = async (tvId, seasonNumber) => {
        try {
          const url = `https://api.themoviedb.org/3/tv/${tvId}?language=en-US&append_to_response=season/${seasonNumber}`;
          const response = await fetch(url, options);
          const data = await response.json();
          // console.log(data['season/'+seasonNumber].episodes);
          return data['season/'+seasonNumber].episodes;
        } catch (error) {
          console.error('Error fetching season data:', error);
          return null;
        }
      };

      // Function to update the search results
      const updateSearchResults = async () => {
        const searchTerm = searchInput.value.trim();

        if (searchTerm === '') {
          searchResults.innerHTML = '';
          return;
        }

        const data = await fetchDataFromAPI(searchTerm);
        // console.log(data);

        const resultsHTML = data.map((movie) => {
            return `<li class="list-group-item" data-id="${movie.id}" data-type="${movie.media_type}" data-value="${movie.name || movie.title}">${movie.name || movie.title}</li>`;
        }).join('');
        searchResults.innerHTML = resultsHTML;

        if (data.some(movie => movie.media_type === 'tv')) {
          searchTypeContainer.style.display = 'block';
          searchMovieContainer.style.display = 'none';
        } else {
          searchMovieContainer.style.display = 'block';
          searchTypeContainer.style.display = 'none';
        }
      };

      // Function to handle the click event on search results
      const handleResultClick = (event) => {
        const selectedId = event.target.dataset.id;
        const selectedTitle = event.target.dataset.value;
        const selectedType = event.target.dataset.type;
        // console.log(selectedId, selectedTitle, selectedType);
        selectedMovieIdInput.value = selectedId;
        searchInput.value = selectedTitle;
        selectedMediaType.value = selectedType;
        searchResults.innerHTML = '';

        // console.log(selectedType);

        if (selectedType === 'tv') {
          tvButton.setAttribute('data-id', selectedId);
        }
        else if (selectedType === 'movie') {
          movieButton.setAttribute('data-id', selectedId);
        }
      };

      // Function to handle the click event on episodes results
      const handleSeasonClick = (event) => {
        const searchTerm = searchInput.value.trim();
        const selectedId = event.target.dataset.id;
        const selectedTitle = event.target.dataset.value;
        const selectedType = event.target.dataset.type;
        // console.log(searchTerm, selectedId, selectedTitle, selectedType);
        selectedMovieIdInput.value = selectedId;
        searchInput.value = searchTerm + ' ' + selectedTitle;
        selectedMediaType.value = selectedType;
        searchSeasons.innerHTML = '';
      };

      // Function to handle the click event on the TV button
      tvButton.addEventListener('click', async (event) => {
        const searchTerm = searchInput.value.trim();
        const tvID = event.target.dataset.id;

        // console.log(event.target);

        // console.log(searchTerm, tvID);
        const data = await fetchDataFromTVAPI(searchTerm, 'tv', tvID);

        const resultsHTML = data.map((tvShow) => {
          return `<li class="list-group-item" data-id="${tvID}" data-type="tv" data-season="${tvShow.season_number}" data-value="${searchTerm} ${tvShow.name}">${searchTerm} ${tvShow.name}</li>`;
        }).join('');
        searchResults.innerHTML = resultsHTML;
        searchTypeContainer.style.display = 'none';

        // searchResults.innerHTML = '';
        searchSeasons.innerHTML = '';

        // console.log(tvID);
      });

      movieButton.addEventListener('click', async (event) => {
        const searchTerm = searchInput.value.trim();
        const movieID = event.target.dataset.id;

        // console.log(searchTerm, movieID);

        const movieData = await fetchDataFromMovieAPI(movieID);
        // console.log(movieData['belongs_to_collection'] !== null);

        if (movieData['belongs_to_collection'] !== null) {
          const collectionID = movieData['belongs_to_collection'].id;
          // console.log(collectionID);

          selectedMovieIdInput.value = collectionID;

          const data = await fetchDataFromCollectionsAPI(collectionID);

          // console.log(data);

          const resultsHTML = data.map((movieParts) => {
            return `
              <div class="row border mb-4">
                <div class="col-12 col-sm-6 col-md-8 col-lg-5 border text-sm-center p-0" id="embed-responsive_${movieParts.id}" style="display: none;">
                  <div class="embed-responsive embed-responsive-16by9">
                    <iframe class="embed-responsive-item" src="" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                  </div>
                </div>
                <div class="col-12 col-sm-6 col-md-8 col-lg-5 video-uploader" id="video-uploader_${movieParts.id}">
                  <label class="file-label" for="movieFile_${movieParts.id}" id="fileLabel_${movieParts.id}">
                    <i class="fa-solid fa-file-video"></i> Choose Video
                  </label>
                  <input type="file" id="movieFile_${movieParts.id}" class="file-input" />
                  <input type="hidden" class="border-0" id="movieId_${movieParts.id}" name="movieId" value="${movieParts.id}">
                  <input type="hidden" id="movieVal_${movieParts.id}" name="movieVal" class="custom-file-input">
                  <input type="hidden" id="movieDelVal_${movieParts.id}" name="movieDelVal" class="custom-file-input">
                  <span id="file_name_${movieParts.id}" name="file_name_${movieParts.id}" class="file-name">No file chosen</span>
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-5 text-start" style="word-wrap: break-word;">
                  <p class="text-break">${movieParts.title}</p>
                  <input type="hidden" class="border-0" id="movieName_${movieParts.id}" name="movieName" value="${movieParts.title}">
                  <input type="hidden" name="seasonNumber" value="null" />
                </div>
                <div class="col-12 col-sm-12 col-md-12 col-lg-2 d-flex justify-content-between">
                  <div id="spinner_${movieParts.id}" class="spinner-border" role="status" style="display: none;">
                    <span class="sr-only">Loading...</span>
                  </div>
                  <button type="button" class="btn upload-button border-0" data-movieshow-id="${movieParts.id}">
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                  </button>
                </div>
            </div>`;
          }).join('');
          episodeList.innerHTML = resultsHTML;
        }

        else {
          episodeList.innerHTML = `
            <div class="row border mb-4">
              <div class="col-12 col-sm-6 col-md-8 col-lg-5 border text-sm-center p-0" id="embed-responsive_${movieData.id}" style="display: none;">
                <div class="embed-responsive embed-responsive-16by9">
                  <iframe class="embed-responsive-item" src="" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
              </div>
              <div class="col-12 col-sm-6 col-md-8 col-lg-5 video-uploader" id="video-uploader_${movieData.id}">
                <label class="file-label" for="movieFile_${movieData.id}" id="fileLabel_${movieData.id}">
                  <i class="fa-solid fa-file-video"></i> Choose Video
                </label>
                <input type="file" id="movieFile_${movieData.id}" class="file-input" />
                <input type="hidden" class="border-0" id="movieId_${movieData.id}" name="movieId" value="${movieData.id}">
                <input type="hidden" id="movieVal_${movieData.id}" name="movieVal" class="custom-file-input">
                <input type="hidden" id="movieDelVal_${movieData.id}" name="movieDelVal" class="custom-file-input">
                <span id="file_name_${movieData.id}" name="file_name_${movieData.id}" class="file-name">No file chosen</span>
              </div>
              <div class="col-12 col-sm-6 col-md-4 col-lg-5 text-start" style="word-wrap: break-word;">
                <p class="text-break">${movieData.title}</p>
                <input type="hidden" class="border-0" id="movieName_${movieData.id}" name="movieName" value="${movieData.title}">
                <input type="hidden" name="seasonNumber" value="null" />
              </div>
              <div class="col-12 col-sm-12 col-md-12 col-lg-2 d-flex justify-content-between">
                <div id="spinner_${movieData.id}" class="spinner-border" role="status" style="display: none;">
                  <span class="sr-only">Loading...</span>
                </div>
                <button type="button" class="btn upload-button border-0" data-movieshow-id="${movieData.id}">
                  <i class="fa-solid fa-cloud-arrow-up"></i>
                </button>
              </div>
            </div>`;
        }

        searchTypeContainer.style.display = 'none';
        searchMovieContainer.style.display = 'none';
        movieButton.style.display = 'none';
        searchSeasons.innerHTML = '';

        // Attach event listener to all buttons with the class "upload-button"
        globalThis.document.querySelectorAll('.upload-button').forEach(button => {
          button.addEventListener('click', function(e) {
            const movieShowId = this.getAttribute('data-movieshow-id');
            // console.log(movieShowId, e.target);
            uploadVideo(movieShowId, this);
          });
        });

        // Add the click event listener to the document and delegate it to file-input elements
        document.addEventListener("change", function (event) {
          if (event.target.matches(".file-input")) {
            const fileInput = event.target;
            const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span

            // console.log(fileInput, fileNameDisplay);

            const file = fileInput.files[0];
            // console.log(file);
            if (file) {
              fileNameDisplay.textContent = file.name;
            } else {
              fileNameDisplay.textContent = "No file chosen";
            }
          }
        });

        function uploadVideo(movieShowId, btn) {
          submitButton.style.display = 'none';
          btn.disabled = true;

          // console.log(movieShowId);

          const videoIframe = document.querySelector(`#embed-responsive_${movieShowId}`);
          const fileInput = document.querySelector(`#movieFile_${movieShowId}`);
          const videoUploader = document.querySelector(`#video-uploader_${movieShowId}`);

          // console.log(videoIframe);

          videoIframe.style.display = "none";              

          if (fileInput.files.length === 0) {
            alert('Please select a video to upload.');
            btn.disabled = false;
            return;
          }
          const file = fileInput.files[0];
          // console.log(file);

          const spinner = document.getElementById(`spinner_${movieShowId}`);
          spinner.style.display = 'block';

          // const date = new Date().getTime().toString();
          // const publicId = movieShowId + '_' + date;

          const baseUri = 'https://uptobox.com';
          // console.log(publicId);

          const requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };

          fetch("https://uptobox.com/api/upload?token=45701da784b02110e845cb7b8a8872577d32q", requestOptions)
            .then(response => response.json())
            .then(result => {
              // console.log(result, result.data.uploadLink);

              const uploadUrl = result.data.uploadLink;

              const formdata = new FormData();
              formdata.append("files", file);
              // console.log(uploadUrl);

              const requestOptions2 = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
              };

              fetch(`https:${uploadUrl}`, requestOptions2)
                .then(response => response.json())
                .then(result => {
                  // console.log(result.files[0]);

                  const parsedData = result.files[0];

                  const url = parsedData.url;
                  const delUrl = parsedData.deleteUrl;

                  // console.log(url, delUrl);

                  document.getElementById(`movieVal_${movieShowId}`).value = url;
                  document.getElementById(`movieDelVal_${movieShowId}`).value = delUrl;

                  if(url) {
                    videoUploader.style.display = 'none';
                    videoIframe.style.display = "block";
                    // Get a reference to the <iframe> element inside the <div>

                    // Set the src attribute of the <iframe> to the fetched video 
                    const iframeElement = videoIframe.querySelector("iframe");
                    // iframeElement.src = url;
                    // console.log(iframeElement);
                    // document.getElementById(`file_name_${tvShowId}`).value = url;

                    submitButton.style.display = 'block';
                    spinner.style.display = 'none';

                    // console.log(btn);
                    // btn.disabled = true;
                  }
                  else {
                    submitButton.style.display = 'none';
                    spinner.style.display = 'none';
                    btn.disabled = false;
                  }
                })
                .catch(error => {
                  console.log('error', error);
                  btn.disabled = false;
                  spinner.style.display = 'none';
                });
            })
            .catch(error => {
              console.log('error', error);
              btn.disabled = false;
              spinner.style.display = 'none';
            });
        }
      });

      searchResults.addEventListener('click', async (event) => {
        if (event.target.tagName === 'LI' && event.target.dataset.season) {
          submitButton.style.display = 'none';
          const selectedSeason = event.target.dataset.season;
          const selectedTVId = event.target.dataset.id;

          // console.log('Fetching Episodes for Season:', selectedSeason);
          // console.log('TV Show ID:', selectedTVId);

          const seasonData = await fetchSeasonData(selectedTVId, selectedSeason);

          // console.log('Season Data:', seasonData);

          if (seasonData && seasonData.length >= 1) {
            const resultsHTML = seasonData.map((tvShow) => {
              return `<div class="row border mb-4">
                    <div class="col-12 col-sm-6 col-md-8 col-lg-5 border text-sm-center p-0" id="embed-responsive_${tvShow.id}" style="display: none;">
                      <div class="embed-responsive embed-responsive-16by9">
                        <iframe class="embed-responsive-item" src="" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                      </div>
                    </div>
                    <div class="col-12 col-sm-6 col-md-8 col-lg-5 video-uploader" id="video-uploader_${tvShow.id}">
                      <label class="file-label" for="episodeFile_${tvShow.id}" id="fileLabel_${tvShow.id}">
                        <i class="fa-solid fa-file-video"></i> Choose Video
                      </label>
                      <input type="file" id="episodeFile_${tvShow.id}" class="file-input" />
                      <input type="hidden" class="border-0" id="episodeId_${tvShow.id}" name="episodeId" value="${tvShow.id}">
                      <input type="hidden" id="episodeVal_${tvShow.id}" name="episodeVal" class="custom-file-input">
                      <input type="hidden" id="episodeDeleteVal_${tvShow.id}" name="episodeDeleteVal" class="custom-file-input">
                      <span id="file_name_${tvShow.id}" name="file_name_${tvShow.id}" class="file-name">No file chosen</span>
                    </div>
                    <div class="col-12 col-sm-6 col-md-4 col-lg-5 text-center" style="word-wrap: break-word;">
                      <p class="text-break">${tvShow.name}</p>
                      <input type="hidden" class="border-0" id="episodeName_${tvShow.id}" value="${tvShow.name}">
                      <input type="hidden" name="seasonNumber" value="${selectedSeason}" />
                    </div>
                    <div class="col-12 col-sm-12 col-md-12 col-lg-2 d-flex justify-content-between">
                      <div id="spinner_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                          <span class="sr-only">Loading...</span>
                      </div>
                      <button type="button" class="btn upload-button border-0" data-tvshow-id="${tvShow.id}">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                      </button>
                    </div>
                  </div>`
            }).join('');
            episodeList.innerHTML = resultsHTML;

            // Attach event listener to all buttons with the class "upload-button"
            globalThis.document.querySelectorAll('.upload-button').forEach(button => {
              button.addEventListener('click', function(e) {
                const tvShowId = this.getAttribute('data-tvshow-id');
                // console.log(tvShowId, e.target);
                uploadVideo(tvShowId, this);
              });
            });

            // Add the click event listener to the document and delegate it to file-input elements
            document.addEventListener("change", function (event) {
              if (event.target.matches(".file-input")) {
                const fileInput = event.target;
                const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span

                // console.log(fileInput, fileNameDisplay);

                const file = fileInput.files[0];
                // console.log(file);
                if (file) {
                  fileNameDisplay.textContent = file.name;
                } else {
                  fileNameDisplay.textContent = "No file chosen";
                }
              }
            });

            function uploadVideo(tvShowId, btn) {
              submitButton.style.display = 'none';
              btn.disabled = true;

              // console.log(tvShowId);

              const videoIframe = document.querySelector(`#embed-responsive_${tvShowId}`);
              const fileInput = document.querySelector(`#episodeFile_${tvShowId}`);
              const videoUploader = document.querySelector(`#video-uploader_${tvShowId}`);

              // console.log(videoIframe);

              videoIframe.style.display = "none";              

              if (fileInput.files.length === 0) {
                alert('Please select a video to upload.');
                btn.disabled = false;
                return;
              }
              const file = fileInput.files[0];
              // console.log(file);

              const spinner = document.getElementById(`spinner_${tvShowId}`);
              spinner.style.display = 'block';

              // const date = new Date().getTime().toString();
              // const publicId = tvShowId + '_' + date;

              const baseUri = 'https://uptobox.com';
              // console.log(publicId);

              const requestOptions = {
                method: 'GET',
                redirect: 'follow'
              };

              fetch("https://uptobox.com/api/upload?token=45701da784b02110e845cb7b8a8872577d32q", requestOptions)
                .then(response => response.json())
                .then(result => {
                  // console.log(result, result.data.uploadLink);

                  const uploadUrl = result.data.uploadLink;

                  const formdata = new FormData();
                  formdata.append("files", file);
                  // console.log(uploadUrl);

                  const requestOptions2 = {
                    method: 'POST',
                    body: formdata,
                    redirect: 'follow'
                  };

                  fetch(`https:${uploadUrl}`, requestOptions2)
                    .then(response => response.json())
                    .then(result => {
                      // console.log(result.files[0]);

                      const parsedData = result.files[0];

                      const url = parsedData.url;
                      const delUrl = parsedData.deleteUrl;

                      // console.log(url, delUrl);

                      document.getElementById(`episodeVal_${tvShowId}`).value = url;
                      document.getElementById(`episodeDeleteVal_${tvShowId}`).value = delUrl;

                      if(url) {
                        videoUploader.style.display = 'none';
                        videoIframe.style.display = "block";
                        // Get a reference to the <iframe> element inside the <div>

                        // Set the src attribute of the <iframe> to the fetched video 
                        const iframeElement = videoIframe.querySelector("iframe");
                        // iframeElement.src = url;
                        // console.log(iframeElement);
                        // document.getElementById(`file_name_${tvShowId}`).value = url;

                        submitButton.style.display = 'block';
                        spinner.style.display = 'none';

                        // console.log(btn);
                        // btn.disabled = true;
                      }
                      else {
                        submitButton.style.display = 'none';
                        spinner.style.display = 'none';
                        btn.disabled = false;
                      }
                    })
                    .catch(error => {
                      console.log('error', error);
                      btn.disabled = false;
                      spinner.style.display = 'none';
                    });
                })
                .catch(error => {
                  console.log('error', error);
                  btn.disabled = false;
                  spinner.style.display = 'none';
                });
            }
          }
          else {
            // console.log('No seasons data found for the selected TV show.');
            searchSeasons.innerHTML = `<li>No Episode data found for the selected TV show.</li>`
          }
        }
        else if(event.target.tagName === 'LI' && event.target.dataset.type === 'movie') {
          // searchMovieContainer.style.display = 'none';
          const searchTerm = searchInput.value.trim();
          searchTypeContainer.style.display = 'none';
          searchMovieContainer.style.display = 'block';
          // console.log("hii", event.target.tagName);

          const movieData = await fetchDataFromAPI(searchTerm);
          // console.log(movieData);
        }
      });

      // Add event listeners to the search input and search results
      searchInput.addEventListener('input', updateSearchResults);
      searchResults.addEventListener('click', handleResultClick);
      searchSeasons.addEventListener('click', handleSeasonClick);

      // Function to clear the input text
      const clearInput = () => {
        searchInput.value = '';
      };

      // Add click event listener to the clear button
      clearButton.addEventListener('click', clearInput);
    });