import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { beforeEach, describe, expect, it } from "vitest";
import InvitationHandoff from "@/pages/InvitationHandoff";

const setLocation = (search: string, hash: string) => {
  window.history.replaceState(null, "", `/invite${search}${hash}`);
};

const renderPage = () =>
  render(
    <HelmetProvider>
      <InvitationHandoff />
    </HelmetProvider>,
  );

describe("InvitationHandoff", () => {
  beforeEach(() => {
    setLocation("", "");
  });

  it("renders the app/browser CTAs for a valid hash token", () => {
    setLocation("", "#token=secure-token");
    renderPage();

    expect(screen.getByRole("link", { name: /open briktra/i })).toHaveAttribute(
      "href",
      "briktra://invite?token=secure-token",
    );
    expect(screen.getByRole("link", { name: /continue in browser/i })).toHaveAttribute(
      "href",
      "/app/index.html#/invite?token=secure-token",
    );
    expect(screen.queryByText(/incomplete/i)).not.toBeInTheDocument();
  });

  it("shows the incomplete-link fallback when no token is present", () => {
    renderPage();

    expect(screen.getByText(/incomplete/i)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /open briktra/i })).not.toBeInTheDocument();
  });

  it("rewrites a legacy query-string token onto the hash, preserving other params", () => {
    setLocation("?token=legacy-token&utm_source=email", "");
    renderPage();

    expect(window.location.search).toBe("?utm_source=email");
    expect(window.location.hash).toBe("#token=legacy-token");
    expect(screen.getByRole("link", { name: /open briktra/i })).toHaveAttribute(
      "href",
      "briktra://invite?token=legacy-token",
    );
  });

  it("does not touch the URL when the token already arrived via hash", () => {
    setLocation("", "#token=secure-token");
    renderPage();

    expect(window.location.search).toBe("");
    expect(window.location.hash).toBe("#token=secure-token");
  });
});
