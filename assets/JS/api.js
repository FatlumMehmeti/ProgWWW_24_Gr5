const apiKey = "b4ae8bd44077f03f8c89736d7c2fe142"; // Replace with your actual API key

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Initializing...");
  generateDateSelector();
  await populatePinnedLeagues(); // Fetch active leagues dynamically
  await fetchLiveMatches();

  // Set up search functionality
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
      searchMatches(query);
    } else {
      document.getElementById("liveMatches").innerHTML = "<p>Please enter a search term.</p>";
    }
  });
});

async function searchMatches(query) {
  console.log(`Searching for: ${query}`);
  const url = `https://v3.football.api-sports.io/fixtures?search=${query}`;
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
      console.log(`${data.response.length} results found for search query: ${query}`);
      displayMatches(data.response);
    } else {
      document.getElementById("liveMatches").innerHTML = `<p>No matches found for "${query}".</p>`;
    }
  } catch (error) {
    console.error("Error searching matches:", error);
    document.getElementById("liveMatches").innerHTML = `<p>Error searching for matches.</p>`;
  }
}


// Generate Date Selector for navigation
function generateDateSelector() {
const navbar = document.querySelector(".scoresnav");
const today = new Date();
const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// Only generate yesterday, today, and tomorrow
for (let i = -1; i <= 1; i++) {
  const date = new Date(today);
  date.setDate(today.getDate() + i);

  const dayName = dayNames[date.getDay()];
  const dayDate =
    date.getDate().toString().padStart(2, "0") +
    " " +
    date.toLocaleString("default", { month: "short" }).toUpperCase();

  const div = document.createElement("div");
  div.classList.add("scoresnav-item");

  if (i === 0) {
    div.classList.add("today");
    div.innerHTML = `<div>${dayName}</div><div class="date">TODAY<br>${dayDate}</div>`;
  } else if (i === -1) {
    div.innerHTML = `<div>${dayName}</div><div class="date">${dayDate}</div>`;
  } else if (i === 1) {
    div.innerHTML = `<div>${dayName}</div><div class="date">${dayDate}</div>`;
  }

  navbar.appendChild(div);
  div.onclick = () => fetchLiveMatches(null, date.toISOString().split("T")[0]);
}
}

// Fetch all active leagues and populate Pinned Leagues
async function populatePinnedLeagues() {
console.log("Fetching active leagues...");
const url = `https://v3.football.api-sports.io/leagues`;
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
    const activeLeagues = data.response.filter((league) => league.seasons.some((season) => season.current));
    console.log(`Found ${activeLeagues.length} active leagues`);

    const pinnedLeagues = document.getElementById("pinnedLeagues");
    pinnedLeagues.innerHTML = ""; // Clear previous entries

    activeLeagues.forEach((league) => {
      const leagueItem = document.createElement("li");
      leagueItem.textContent = league.league.name;
      leagueItem.onclick = () => fetchLiveMatches(league.league.id);
      pinnedLeagues.appendChild(leagueItem);
    });
  } else {
    console.warn("No active leagues found.");
  }
} catch (error) {
  console.error("Error fetching leagues:", error);
}
}
async function fetchLiveMatches(leagueId = null, date = "live") {
const cacheKey = `matches_${leagueId || "all"}_${date}`;
const cachedData = localStorage.getItem(cacheKey);

// If data exists in local storage and it's not outdated, use it
if (cachedData) {
  console.log("Using cached data for:", cacheKey);
  displayMatches(JSON.parse(cachedData));
  return;
}

console.log("Fetching data from API for:", cacheKey);

const url = `https://v3.football.api-sports.io/fixtures?${
  leagueId ? `league=${leagueId}&` : ""
}${date === "live" ? "live=all" : `date=${date}`}`;
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
    // Save data to local storage for caching
    localStorage.setItem(cacheKey, JSON.stringify(data.response));
    displayMatches(data.response);
  } else {
    document.getElementById("liveMatches").innerHTML =
      "<p>No live matches currently available.</p>";
  }
} catch (error) {
  console.error("Error fetching live matches:", error);
  document.getElementById("liveMatches").innerHTML =
    "<p>Error loading live matches.</p>";
}
}

// Display matches grouped by leagues
function displayMatches(matches) {
const container = document.getElementById("liveMatches");
container.innerHTML = "";

const leagues = {};

matches.forEach((match) => {
  const leagueName = match.league.name;

  if (!leagues[leagueName]) {
    leagues[leagueName] = [];
  }

  leagues[leagueName].push(match);
});

Object.keys(leagues).forEach((leagueName) => {
  const leagueHeader = document.createElement("h4");
  leagueHeader.textContent = leagueName;
  container.appendChild(leagueHeader);

  leagues[leagueName].forEach((match) => {
    const matchElement = document.createElement("div");
    matchElement.classList.add("match");

    const homeTeam = match.teams.home.name;
    const awayTeam = match.teams.away.name;
    const homeLogo = match.teams.home.logo;
    const awayLogo = match.teams.away.logo;
    const score = `${match.goals.home || 0} - ${match.goals.away || 0}`;
    const time = match.fixture.date
      ? new Date(match.fixture.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

    matchElement.innerHTML = `
      <div class="teams">
        <div class="team">
          <div class="tt">${homeTeam}</div>
          <div class="img"><img src="${homeLogo}" alt="${homeTeam}" class="team-logo" /></div>
        </div>
        <div class="match-time-container">
          <span class="match-time">${time}</span>
          <span class="score">${score}</span>
        </div>
        <div class="team">
          <div class="img"><img src="${awayLogo}" alt="${awayTeam}" class="team-logo" /></div>
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
  

