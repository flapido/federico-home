import { describe, expect, it } from "vitest";
import { guideSteps } from "../data/guideTour";
import { eventTypes, normalisePath, normaliseSource } from "../../functions/_lib/analytics";

describe("guided portal tour", () => {
  it("uses the intended seven-step evidence route and never includes Quiniela", () => {
    expect(guideSteps.map((step) => step.id)).toEqual(["home", "projects", "legacy", "subastas", "avatar", "soluciones", "contacto"]);
    expect(JSON.stringify(guideSteps).toLowerCase()).not.toContain("quiniela");
  });

  it("keeps tour analytics allowlisted and path/source normalized", () => {
    expect(eventTypes).toContain("guide_started");
    expect(eventTypes).toContain("tour_avatar_view");
    expect(normalisePath("/proyectos/legacy-web")).toBe("/proyectos/legacy-web");
    expect(normaliseSource("avatar")).toBe("avatar");
  });
});
