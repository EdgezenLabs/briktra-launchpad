import { describe, expect, it } from "vitest";
import { invitationDestinations, invitationTokenFromLocation } from "@/lib/invitation-link";

describe("invitation handoff links", () => {
  it("prefers fragment tokens and supports legacy query links", () => {
    expect(invitationTokenFromLocation({ hash: "#token=secure", search: "?token=legacy" } as Location))
      .toBe("secure");
    expect(invitationTokenFromLocation({ hash: "", search: "?token=legacy" } as Location))
      .toBe("legacy");
  });

  it("encodes tokens for native and Flutter web destinations", () => {
    expect(invitationDestinations("a token")).toEqual({
      app: "briktra://invite?token=a%20token",
      web: "/app/index.html#/invite?token=a%20token",
    });
  });
});
