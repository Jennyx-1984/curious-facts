export let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
export let lastFact = "";
export let todayFactGlobal = "";
export let currentLang = "en";
export let lastFactIsToday = true;

const mainView = document.getElementById("mainView");
const favView = document.getElementById("favView");
const heartImg = document.getElementById("heart");
const newFactBtn = document.getElementById("newFactBtn");
const showFavBtn = document.getElementById("showFavBtn");
const backBtn = document.getElementById("backBtn");
const favList = document.getElementById("favList");
const subTitle=document.querySelector("h2");
const miniTitle=document.querySelector("h3");
const subTitFav=document.getElementById("subtitle-favorites");

export async function getRandomFact() {
  const h3=document.querySelector("h3");
  if (h3) h3.style.visibility = "hidden";
  const urlBase = "https://uselessfacts.jsph.pl/api/v2/facts/random";
  const url = currentLang === "de" ? `${urlBase}?language=de` : urlBase;

  const res = await fetch(url);
  const data = await res.json();
  return data.text;
}

export async function getToday() {
  const urlBase = "https://uselessfacts.jsph.pl/api/v2/facts/today";
  const url = currentLang === "de" ? `${urlBase}?language=de` : urlBase;

  const res = await fetch(url);
  const data = await res.json();
  return data.text;
}

export function renderCard(factText) {
  lastFact = factText;

  
  const factContainer = document.getElementById("factContainer");
  const saveFavBtn = document.getElementById("saveFavBtn");
  const heartImg = document.getElementById("heart");

  if (factContainer) factContainer.textContent = factText;

  if (heartImg) {
    heartImg.src = favorites.includes(factText)
      ? "assets/images/corazon-full.png"
      : "assets/images/corazon.png";
  }

  if (saveFavBtn) {
    saveFavBtn.onclick = () => {
      if (!favorites.includes(factText)) {
        favorites.push(factText);
      } else {
        const index = favorites.indexOf(factText);
        if (index > -1) favorites.splice(index, 1);
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));

      if (heartImg) {
        heartImg.src = favorites.includes(factText)
          ? "assets/images/corazon-full.png"
          : "assets/images/corazon.png";
      }
      updateShowFavBtnVisibility();
    };
  }
  updateShowFavBtnVisibility();
}

window.renderCard = renderCard;
export function renderFavorites() {
  if (!favList) return;
  favList.innerHTML = "";
  if (favorites.length === 0) {
    favList.innerHTML = "<img class='not-found' src='../assets/images/nofacts.png' alt='facts not found'/>";
    return;
  }
  favorites.forEach(fact => {
    const card = document.createElement("div");
    card.classList.add("mycard", "floating", "rounded-4", "shadow");
    const text = document.createElement("span");
    text.textContent = fact;
    const favBtn = document.createElement("button");
    favBtn.id = "unsavedFavBtn";
    const heart = document.createElement("img");
    heart.src = "assets/images/corazon-full.png";
    heart.alt = "Eliminar favorito";
    heart.style.width = "20px";
    heart.style.height = "20px";
    favBtn.appendChild(heart);
    favBtn.onclick = () => {
      favorites = favorites.filter(f => f !== fact);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      renderFavorites();
      if (fact === lastFact && heartImg) {
        heartImg.src = "assets/images/corazon.png";
      }
      updateShowFavBtnVisibility();
    };
    card.appendChild(favBtn);
    card.appendChild(text);
    favList.appendChild(card);
  });
}

function updateShowFavBtnVisibility() {
  if (!showFavBtn) return;
  showFavBtn.style.display = favorites.length ? "inline-block" : "none";
}

window.addEventListener("DOMContentLoaded", async () => {
  const langSwitch = document.getElementById("lang-switch");
  if (langSwitch) {
    langSwitch.addEventListener("click", async () => {
      currentLang = currentLang === "en" ? "de" : "en";
      langSwitch.textContent = currentLang === "en" ? "🇩🇪" : "🇬🇧";
      subTitle.textContent = currentLang === "de" ? "Generator für Wissenswerte Fakten" : "Fun Facts Generator";
      miniTitle.textContent = currentLang === "de" ? "Fun Fact des Tages" : "Fun Fact of the Day";
      newFactBtn.textContent = currentLang === "de" ? "Neuer Fakt" : "New Fact";
      showFavBtn.textContent = currentLang === "de" ? "Favoritenliste" : "Favorites List";
      backBtn.textContent = currentLang === "de" ? "Zurück" : "Return";
      subTitFav.textContent  = currentLang === "de" ? "Favoritenliste" : "Favorites List";

      const fact = lastFactIsToday ? await getToday() : await getRandomFact();
      lastFactIsToday = lastFactIsToday ? true : false;
      renderCard(fact);
    });
  }

  const todayFact = await getToday();
  renderCard(todayFact);
  if (newFactBtn) {
    newFactBtn.addEventListener("click", async () => {
      const fact = await getRandomFact();
      lastFactIsToday = false;
      renderCard(fact);
    });
  }
  if (showFavBtn) {
    showFavBtn.addEventListener("click", () => {
      if (mainView && favView) {
        mainView.style.display = "none";
        favView.style.display = "block";
        renderFavorites();
      }
    });
  }
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (favView && mainView) {
        favView.style.display = "none";
        mainView.style.display = "block";
      }
    });
  }
});


const upperBtn = document.querySelector('.upper-btn');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) { 
    upperBtn.classList.add('visible');
  } else {
    upperBtn.classList.remove('visible');
  }
});