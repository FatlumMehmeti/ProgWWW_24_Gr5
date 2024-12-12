// Fetch matches from local JSON file
async function fetchLiveMatchesFromLocalFile() {
  const localFilePath = "assets/data/data.json"; 

  try {
    const response = await fetch(localFilePath);
    const data = await response.json();

    if (data.response && data.response.length > 0) {
      displayMatches(data.response);
    } else {
      document.getElementById("liveMatches").innerHTML =
        "<p>No live matches currently available.</p>";
    }
  } catch (error) {
    console.error("Error loading matches from local file:", error);
    document.getElementById("liveMatches").innerHTML =
      "<p>Error loading matches from the local file.</p>";
  }
}

function displayMatches(matches) {
  const container = document.getElementById("liveMatches");
  container.innerHTML = ""; // Clear previous matches

  const leagues = {};

  // Group matches by leagues
  matches.forEach((match) => {
    const leagueName = match.league.name;

    if (!leagues[leagueName]) {
      leagues[leagueName] = [];
    }

    leagues[leagueName].push(match);
  });

  // Render matches grouped by league
  Object.keys(leagues).forEach((leagueName) => {
    const leagueHeader = document.createElement("div");
    leagueHeader.textContent = leagueName;
    leagueHeader.style.fontWeight = "bold";
    leagueHeader.style.marginTop = "20px";
    container.appendChild(leagueHeader);

    leagues[leagueName].forEach((match) => {
      const matchElement = document.createElement("div");
      matchElement.classList.add("match");

      const homeTeam = match.teams.home.name;
      const awayTeam = match.teams.away.name;
      const homeLogo = match.teams.home.logo;
      const awayLogo = match.teams.away.logo;
      const status = match.fixture.status;

      let displayInfo = ""; // To hold game time or score

      // Determine if the match is live or upcoming
      if (status.short === "1H" || status.short === "2H") {
        // Match is being played
        displayInfo = `
              <span class="live-match">LIVE ${status.elapsed}'</span>
              <span class="score">${match.goals.home} - ${match.goals.away}</span>
          `;
      } else if (status.short === "FT") {
        // Match has finished
        displayInfo = `<span class="score">FT ${match.goals.home} - ${match.goals.away}</span>`;
      } else {
        // Match is upcoming
        const matchTime = new Date(match.fixture.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        displayInfo = `<span class="match-time">Starts at: ${matchTime}</span>`;
      }

      // Construct the match HTML
      matchElement.innerHTML = `
       <div class="teams">
                 <div class="team">
                  <div class="tt">${homeTeam}</div>
                  <div class="img"><img src="${homeLogo}" alt="${homeTeam}" class="team-logo"></div>
                 </div>
                 <div class="match-time-container">
                    ${displayInfo}
                 </div>
                 <div class="team">
                  <div class="img"><img src="${awayLogo}" alt="${awayTeam}" class="team-logo"></div>
                  <div class="tt">${awayTeam}</div>
                 </div>
             </div>
      `;

      matchElement.setAttribute("data-fixture-id", match.fixture.id);

      // Add click event listener
      matchElement.addEventListener("click", () => {
        const fixtureId = matchElement.getAttribute("data-fixture-id");
        window.location.href = `match-details.html?fixtureId=${fixtureId}`;
      });

      container.appendChild(matchElement);
    });
  });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("scroll", () => {
  const footer = document.querySelector(".site-footer");
  const backToTopBtn = document.getElementById("backToTop");
  const footerPosition = footer.getBoundingClientRect().top;
  const viewportHeight = window.innerHeight;

  if (footerPosition - viewportHeight < 50) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", fetchLiveMatchesFromLocalFile);
