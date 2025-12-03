import { describe, it, expect, vi,beforeEach } from "vitest";
import { getRandomFact, getToday } from "../js/api.js";

beforeEach(() => {
  document.body.innerHTML = `<button id="lang-switch"></button>`;
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

describe("getToday", () => {
  it("devuelve 'Dato del día'", async () => {
    const text = await getToday();
    expect(text).toBe("Dato del día");
  });
});

describe("getRandomFact", () => {
  it("devuelve 'Dato aleatorio'", async () => {
    const text = await getRandomFact();
    expect(text).toBe("Dato aleatorio");
  });
});

