import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GreetingBox } from "./GreetingBox";

describe("GreetingBox", () => {
  it("renders without errors", () => {
    render(<GreetingBox />);
  });

  it("displays the greeting text", () => {
    render(<GreetingBox />);
    expect(screen.getByText("Hi Anupam, Good Morning!")).toBeDefined();
  });

  it("has an accessible aria-label on the section", () => {
    render(<GreetingBox />);
    expect(screen.getByRole("region", { name: "Greeting" })).toBeDefined();
  });
});
