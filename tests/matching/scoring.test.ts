import { describe, expect, it } from "vitest";
import {
  scoreSkillsMatch,
  scoreExperienceMatch,
  scoreLocationMatch,
  scoreCompensationMatch,
  scoreDomainMatch,
  computeOverallScore
} from "@/services/matching/scoring";

describe("scoreSkillsMatch", () => {
  it("returns 100 when there are no required skills", () => {
    expect(scoreSkillsMatch([], ["AWS"])).toBe(100);
  });

  it("is case-insensitive on skill matching", () => {
    expect(scoreSkillsMatch(["AWS", "Kubernetes"], ["aws", "KUBERNETES"])).toBe(100);
  });

  it("returns the proportion matched", () => {
    expect(scoreSkillsMatch(["AWS", "Kubernetes", "Terraform", "CI/CD"], ["AWS", "Kubernetes"])).toBe(50);
  });

  it("returns 0 when nothing matches", () => {
    expect(scoreSkillsMatch(["AWS"], ["Python"])).toBe(0);
  });
});

describe("scoreExperienceMatch", () => {
  it("returns a neutral score when experience is unknown", () => {
    expect(scoreExperienceMatch(null)).toBe(50);
  });

  it("rewards mid-senior experience most", () => {
    expect(scoreExperienceMatch(8)).toBe(100);
  });

  it("does not over-penalize very senior candidates", () => {
    expect(scoreExperienceMatch(20)).toBe(90);
  });
});

describe("scoreLocationMatch", () => {
  it("returns 100 for remote roles regardless of candidate location", () => {
    expect(scoreLocationMatch("Atlanta, GA", "remote", "Chicago, IL")).toBe(100);
  });

  it("returns 100 for a same-city onsite match", () => {
    expect(scoreLocationMatch("Atlanta, GA", "onsite", "Atlanta, GA")).toBe(100);
  });

  it("penalizes a far onsite mismatch more than a hybrid one", () => {
    const onsite = scoreLocationMatch("Atlanta, GA", "onsite", "Chicago, IL");
    const hybrid = scoreLocationMatch("Atlanta, GA", "hybrid", "Chicago, IL");
    expect(onsite).toBeLessThan(hybrid);
  });
});

describe("scoreCompensationMatch", () => {
  it("returns 100 when expectation is within the band", () => {
    expect(scoreCompensationMatch(120000, 160000, 145000)).toBe(100);
  });

  it("does not penalize a candidate under budget", () => {
    expect(scoreCompensationMatch(120000, 160000, 110000)).toBe(90);
  });

  it("penalizes a candidate well over budget", () => {
    expect(scoreCompensationMatch(120000, 160000, 220000)).toBeLessThan(30);
  });
});

describe("scoreDomainMatch", () => {
  it("rewards multiple title-word overlaps", () => {
    expect(scoreDomainMatch("Senior DevOps Engineer", "Senior DevOps Engineer")).toBe(100);
  });

  it("gives a low score when titles do not overlap", () => {
    expect(scoreDomainMatch("Accountant", "Senior DevOps Engineer")).toBe(40);
  });
});

describe("computeOverallScore", () => {
  it("weights the six components per the documented formula", () => {
    // All perfect -> 100
    expect(
      computeOverallScore({
        skillsScore: 100,
        experienceScore: 100,
        locationScore: 100,
        compensationScore: 100,
        domainScore: 100,
        aiScore: 100
      })
    ).toBe(100);
  });

  it("falls back to the domain score when the AI component is absent", () => {
    // With aiScore null, the AI weight is filled by domainScore, so an
    // all-80 deterministic profile still yields 80, not a dip from a zeroed
    // AI component.
    expect(
      computeOverallScore({
        skillsScore: 80,
        experienceScore: 80,
        locationScore: 80,
        compensationScore: 80,
        domainScore: 80,
        aiScore: null
      })
    ).toBe(80);
  });

  it("respects the 35% skills weight", () => {
    // Only skills perfect, everything else zero -> 35.
    expect(
      computeOverallScore({
        skillsScore: 100,
        experienceScore: 0,
        locationScore: 0,
        compensationScore: 0,
        domainScore: 0,
        aiScore: 0
      })
    ).toBe(35);
  });
});
