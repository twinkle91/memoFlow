import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GreetingBox } from "./GreetingBox";

describe("GreetingBox", () => {
  it("renders without errors", () => {
    const html = renderToStaticMarkup(createElement(GreetingBox));
    expect(html).toBeTruthy();
  });

  it("displays the greeting text", () => {
    const html = renderToStaticMarkup(createElement(GreetingBox));
    expect(html).toContain("Hi Anupam, Good Morning!");
  });

  it("has an accessible aria-label on the section", () => {
    const html = renderToStaticMarkup(createElement(GreetingBox));
    expect(html).toContain('aria-label="Greeting"');
  });
});
