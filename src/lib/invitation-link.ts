export const invitationTokenFromLocation = (
  location: Pick<Location, "hash" | "search">,
): string | null => {
  const hash = location.hash.replace(/^#/, "");
  const hashToken = new URLSearchParams(hash).get("token")?.trim();
  if (hashToken) return hashToken;
  return new URLSearchParams(location.search).get("token")?.trim() || null;
};

export const invitationDestinations = (token: string) => {
  const encoded = encodeURIComponent(token);
  return {
    app: `briktra://invite?token=${encoded}`,
    web: `/app/index.html#/invite?token=${encoded}`,
  };
};
