const blacklistedTokens = new Map();

export const blacklistToken = (token) => {
  if (!token) return;
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
    const expiresAt = Number(payload.exp) * 1000;
    if (expiresAt > Date.now()) blacklistedTokens.set(token, expiresAt);
  } catch {
    // Invalid tokens are rejected by JWT verification and do not need storage.
  }
};

export const isTokenBlacklisted = (token) => {
  const expiresAt = blacklistedTokens.get(token);
  if (!expiresAt) return false;
  if (expiresAt <= Date.now()) {
    blacklistedTokens.delete(token);
    return false;
  }
  return true;
};