import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRandomFact, getToday, renderCard, favorites } from "../js/api.js";

beforeEach(() => {
  document.body.innerHTML = `
    <div id="factContainer"></div>
    <button id="saveFavBtn"><img id="heart" /></button>`;
  localStorage.setItem("favorites", JSON.stringify([]));
  favorites.length = 0;
});
vi.stubGlobal("fetch", vi.fn((url) => {
  if (url.includes("today")) {
    return Promise.resolve({
      json: () => Promise.resolve({ text: "Dato del día" })
    });
  }
  if (url.includes("random")) {
    return Promise.resolve({
      json: () => Promise.resolve({ text: "Dato aleatorio" })
    });
  }
}));
describe("API de datos curiosos", () => {
  it("getToday devuelve 'Dato del día'", async () => {
    const text = await getToday();
    expect(text).toBe("Dato del día");
  });

  it("getRandomFact devuelve 'Dato aleatorio'", async () => {
    const text = await getRandomFact();
    expect(text).toBe("Dato aleatorio");
  });
});
describe("Muestra 'Galería de favoritos' y agrega/elimina un dato dandole al corazón", () => {
  it("Agrega un dato a favoritos al hacer clic en el botón del corazón", () => {
    const factText = "Dato Favorito";
    renderCard(factText);
    const saveBtn = document.getElementById("saveFavBtn");
    saveBtn.click();
    expect(favorites).toContain(factText);
    expect(JSON.parse(localStorage.getItem("favorites"))).toContain(factText);
    const heart = document.getElementById("heart");
    expect(heart.src).toContain("corazon-full.png");
  });
  it("Elimina un dato de favoritos al hacer clic de nuevo en el corazón", () => {
    const factText = "Dato Favorito";
    renderCard(factText);
    const saveBtn = document.getElementById("saveFavBtn");
    saveBtn.click();
    saveBtn.click(); 
    expect(favorites).not.toContain(factText);
    expect(JSON.parse(localStorage.getItem("favorites"))).not.toContain(factText);
    const heart = document.getElementById("heart");
    expect(heart.src).toContain("corazon.png");
  });
});
