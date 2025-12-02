import { expect, test } from "vitest";
import { getRandomFact } from "./api.js";

test("la API devuelve un hecho curioso", async () => {
  const fact = await getRandomFact();
  expect(typeof fact).toBe("string");
});