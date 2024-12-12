const API_KEY = "8c8ed8fe2e304904b90602c79d250237"; 
const newsContainer = document.querySelector(".news-container");
const tabs = document.querySelectorAll(".tab");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    fetchNews(tab.dataset.category);
  });
});

async function fetchNews(category = "football") {
  const url = `https://newsapi.org/v2/everything?q=${category}&apiKey=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === "ok") {
      displayNews(data.articles);
    } else {
      newsContainer.innerHTML = "<p>Error fetching news.</p>";
    }
  } catch (error) {
    console.error("Error:", error);
    newsContainer.innerHTML = "<p>Error fetching news.</p>";
  }
}

function displayNews(articles) {
  newsContainer.innerHTML = ""; // Clear previous articles
  articles.forEach((article) => {
    const newsItem = document.createElement("div");
    newsItem.classList.add("news-item");

    newsItem.innerHTML = `
            <img src="${article.urlToImage || "placeholder.jpg"}" alt="${
      article.title
    }">
            <h3><a href="${article.url}" target="_blank">${
      article.title
    }</a></h3>
            <p>${article.description || "No description available."}</p>
        `;

    newsContainer.appendChild(newsItem);
  });
}

// Fetch initial news for the default tab
fetchNews();
