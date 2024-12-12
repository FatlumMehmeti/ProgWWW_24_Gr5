// Extract fixtureId from URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const fixtureId = urlParams.get("fixtureId");

if (fixtureId) {
  fetchMatchDetails(fixtureId);
} else {
  document.getElementById("matchDetailsContainer").innerHTML =
    "<p>No match selected.</p>";
}

async function fetchMatchDetails(fixtureId) {
  const apiKey = "20f0f4092ddf3663b052ce1061bc2dd5"; 
  const url = `https://v3.football.api-sports.io/fixtures?id=${fixtureId}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-host": "v3.football.api-sports.io",
      "x-rapidapi-key": apiKey,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.response && data.response.length > 0) {
      displayMatchDetails(data.response[0]);
    } else {
      document.getElementById("matchDetailsContainer").innerHTML =
        "<p>Match details not found.</p>";
    }
  } catch (error) {
    console.error("Error fetching match details:", error);
    document.getElementById("matchDetailsContainer").innerHTML =
      "<p>Error loading match details.</p>";
  }
}

function displayMatchDetails(match) {
  const container = document.getElementById("matchDetailsContainer");
  container.innerHTML = `
        <div class="match-detail">
  <div class="team-section">
    <div class="team">
      <img
        src="${match.teams.home.logo}"
        alt="${match.teams.home.name}"
        class="team-logo"
      />
      <span class="team-name">${match.teams.home.name}</span>
    </div>
    <div class="score-section">
      <span class="match-score">${match.goals.home} - ${match.goals.away}</span>
      <span class="match-date">${new Date(
        match.fixture.date
      ).toLocaleString()}</span>
    </div>
    <div class="team">
      <img
        src="${match.teams.away.logo}"
        alt="${match.teams.away.name}"
        class="team-logo"
      />
      <span class="team-name">${match.teams.away.name}</span>
    </div>
  </div>
  <p class="venue"><strong>Venue:</strong> ${match.fixture.venue.name}, ${
    match.fixture.venue.city
  }</p>
  <h3 class="events-heading">Match Events:</h3>
  <ul class="events-list">
    ${match.events
      .map(
        (event) =>
          `<li>${event.time.elapsed}' ${event.player.name} (${event.type})</li>`
      )
      .join("")}
  </ul>
</div>`;
}
