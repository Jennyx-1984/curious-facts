let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let lastFact = "";

const mainView = document.getElementById("mainView");
const favView = document.getElementById("favView");
const mainCard = document.getElementById("mainCard");
const factContainer = document.getElementById("factContainer");
const saveFavBtn = document.getElementById("saveFavBtn");
const heartImg = document.getElementById("heart");
const newFactBtn = document.getElementById("newFactBtn");
const showFavBtn = document.getElementById("showFavBtn");
const backBtn = document.getElementById("backBtn");
const favList = document.getElementById("favList");

export async function getRandomFact() {
  const h3=document.querySelector("h3");
  if (h3) h3.style.visibility = "hidden";
  const res = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random');
  const data = await res.json();
  return data.text;
}

export async function getToday() {
  const res = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/today');
  const data = await res.json();
  return data.text;
}

window.addEventListener("DOMContentLoaded", async () => {
  const todayFact = await getToday();
  renderCard(todayFact);
  updateShowFavBtnVisibility();
});

export function renderCard(factText) {
  lastFact = factText;
  if (factContainer) {
    factContainer.textContent = factText;
  }
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
        favorites = favorites.filter(f => f !== factText);
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));

      if (heartImg) {
        heartImg.src = favorites.includes(factText)
          ? "assets/images/corazon-full.png"
          : "assets/images/corazon.png";
      }

      renderFavorites();
      updateShowFavBtnVisibility();
    };
  }
  updateShowFavBtnVisibility();
}
window.renderCard = renderCard;


function renderFavorites() {
  favList.innerHTML = "";
  if (favorites.length === 0) {
    favList.innerHTML = "<p>No tienes favoritos guardados.</p>";
    return;
  }

  favorites.forEach(fact => {
    const card = document.createElement("div");
    card.classList.add("mycard");
    card.classList.add("floating");
    card.classList.add("rounded-4");
    card.classList.add("shadow");

    const text = document.createElement("span");
    text.textContent = fact;

    const favBtn = document.createElement("button");
    favBtn.id="unsavedFavBtn";
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

      if (fact === lastFact) {
        heartImg.src = "assets/images/corazon.png";
      }
      updateShowFavBtnVisibility();
    };

    card.appendChild(favBtn);
    card.appendChild(text);
    favList.appendChild(card);
    favView.appendChild(favList);
  });
}

function updateShowFavBtnVisibility() {
  if (!showFavBtn) return;
  showFavBtn.style.display = favorites.length ? "inline-block" : "none";
}


if (newFactBtn) {
newFactBtn?.addEventListener("click", async () => {
  const fact = await getRandomFact();
  renderCard(fact);
});
}
showFavBtn?.addEventListener("click", () => {
  if (mainView && favView) {
    mainView.style.display = "none";
    favView.style.display = "block";
    renderFavorites();
  }
});
backBtn?.addEventListener("click", () => {
  if (favView && mainView) {
    favView.style.display = "none";
    mainView.style.display = "block";
  }
});

const upperBtn = document.querySelector('.upper-btn');

window.addEventListener('scroll', () => {
  if (!upperBtn) return;
  if (window.scrollY > 200) { 
    upperBtn.classList.add('visible');
  } else {
    upperBtn.classList.remove('visible');
  }
});


