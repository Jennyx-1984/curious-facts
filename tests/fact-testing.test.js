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
      ok: true,
      json: () => Promise.resolve({ text: "Dato del día" })
    });
  }
  if (url.includes("random")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ text: "Dato aleatorio" })
    });
  }
}));

describe("API de datos curiosos", () => {
  it("La función getToday devuelve 'Dato del día'", async () => {
    const text = await getToday();
    expect(text).toBe("Dato del día");
  });
  it("La función getRandomFact devuelve 'Dato aleatorio'", async () => {
    const text = await getRandomFact();
    expect(text).toBe("Dato aleatorio");
  });
});

describe("Manejo de errores en getToday y getRandomFact", () => {
  it("La función getToday devuelve un error si la API no está disponible o no encuentra datos", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Server Error",
      json: () => Promise.resolve({})
    });
    const text = await getToday();
    expect(text).toBe("No se pudo obtener el dato del día.");
  });
  it("La función getRandomFact devuelve un error si la API no está disponible o no encuentra datos", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: () => Promise.resolve({})
    });
    const text = await getRandomFact();
    expect(text).toBe("No se pudo obtener un dato curioso en este momento.");
  });
  it("La función getToday devuelve respuesta si no existe dato extraido de la API con la propiedad .text", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({})
    });
    const text = await getToday();
    expect(text).toBe("No se pudo obtener el dato del día.");
  });
  it("La función getRandomFact devuelve respuesta si no existe dato extraido de la API con la propiedad .text", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({})
    });
    const text = await getRandomFact();
    expect(text).toBe("No se pudo obtener un dato curioso en este momento.");
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
})
it("Cuenta correctamente los elementos en favoritos", () => {
  renderCard("Dato 1");
  document.getElementById("saveFavBtn").click();
  renderCard("Dato 2");
  document.getElementById("saveFavBtn").click();
  expect(favorites.length).toBe(2);
});
it("Detecta que la galería está vacía al inicio", () => {
  expect(favorites.length).toBe(0);
  expect(JSON.parse(localStorage.getItem("favorites")).length).toBe(0);
});