const clientId = "4094f00116a84ce88d2d392c22d70e0d";
const clientSecret = "4485030920fd463eb2858908ebcf6601";
const accessTokenUrl = "https://accounts.spotify.com/api/token";
const podcastsEndpoint =
  "https://api.spotify.com/v1/search?q=football+podcasts&type=show";

async function getAccessToken() {
  const response = await fetch(accessTokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
  });
  const data = await response.json();
  return data.access_token;
}

async function fetchPodcasts() {
  const accessToken = await getAccessToken();
  const response = await fetch(podcastsEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data.shows.items;
}

async function fetchNewestEpisodes(showId) {
  const accessToken = await getAccessToken();
  const response = await fetch(
    `https://api.spotify.com/v1/shows/${showId}/episodes?limit=1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  return data.items[0];
}

async function displayPodcasts() {
  const podcasts = await fetchPodcasts();
  const container = document.getElementById("podcasts");

  for (const podcast of podcasts) {
    const newestEpisode = await fetchNewestEpisodes(podcast.id);

    const div = document.createElement("div");
    div.classList.add("podcast-item");
    div.innerHTML = `
                        <iframe src="https://open.spotify.com/embed/episode/${newestEpisode.id}" allow="encrypted-media"></iframe>
                  `;
    container.appendChild(div);
  }
}
displayPodcasts();
