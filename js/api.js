async function getRandomFact() {
  try {
    const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random');
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error obteniendo el hecho curioso:", error);
  }
}

async function initToday() {
  try {
    const responseToday = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/today');
    const dataToday = await responseToday.json();
    return dataToday.text;
  } catch (error) {
    console.error("Error obteniendo el hecho curioso (today):", error);
  }
}

const factContainer = document.getElementById("factContainer");
const newFactBtn = document.getElementById("newFactBtn");
const showFavBtn = document.getElementById("showFavBtn");
const backBtn = document.getElementById("backBtn");
const favList = document.getElementById("favList");

// ---------- FAVORITOS ----------
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function renderFavorites() {
  favList.innerHTML = "";

  favorites.forEach((fact, index) => {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = fact;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.addEventListener("click", () => {
      favorites.splice(index, 1);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      renderFavorites();
      //updateShowFavBtnVisibility()
    });

    li.appendChild(text);
    li.appendChild(deleteBtn);
    favList.appendChild(li);
    
  });
}


function updateShowFavBtnVisibility() {
  if (favorites.length === 0) {
    showFavBtn.style.display = "none";
    saveFavBtn.style.display = "inline-block";
  } else {
    showFavBtn.style.display = "inline-block";
    saveFavBtn.style.display = "inline-block";
  }
}
// ---------- GUARDAR FAVORITOS ----------
document.getElementById("saveFavBtn").addEventListener("click", () => {
  const currentFact = factContainer.textContent;

  if (currentFact && !favorites.includes(currentFact)) {
    favorites.push(currentFact);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
    updateShowFavBtnVisibility();
  }
});

// ---------- RANDOM ----------
newFactBtn.addEventListener("click", async () => {
  const fact = await getRandomFact();
  factContainer.textContent = fact;
});

// ---------- MOSTRAR FAVORITOS ----------
showFavBtn.addEventListener("click", () => {
  factContainer.style.display = "none";
  newFactBtn.style.display = "none";
  showFavBtn.style.display = "none";
  saveFavBtn.style.display = "none"; 

  favList.style.display = "block";
  backBtn.style.display = "inline-block";

  renderFavorites();
  
});

// ---------- VOLVER A LA VISTA NORMAL ----------
backBtn.addEventListener("click", () => {
  favList.style.display = "none";
  backBtn.style.display = "none";

  factContainer.style.display = "block";
  newFactBtn.style.display = "inline-block";

  updateShowFavBtnVisibility()
});

// ---------- MOSTRAR EL “TODAY” AL INICIAR ----------
window.addEventListener("DOMContentLoaded", async () => {
  const todayFact = await initToday();
  factContainer.textContent = todayFact;
  renderFavorites();
  updateShowFavBtnVisibility();
});


