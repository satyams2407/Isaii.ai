const crypto = require("crypto")

const DEFAULT_EXPIRY_SECONDS = 60 * 60 * 24

function getSecret() {
  return process.env.JWT_SECRET || "development-secret"
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.pbkdf2Sync(password, salt, 310000, 32, "sha256").toString("hex")

  return `${salt}:${hash}`
}

function comparePassword(password, storedValue) {
  const [salt, storedHash] = storedValue.split(":")
  const computedHash = crypto.pbkdf2Sync(password, salt, 310000, 32, "sha256")
  const referenceHash = Buffer.from(storedHash, "hex")

  if (computedHash.length !== referenceHash.length) {
    return false
  }

  return crypto.timingSafeEqual(computedHash, referenceHash)
}

function encodePart(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url")
}

function decodePart(value) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8"))
}

function signToken(payload) {
  const header = encodePart({ alg: "HS256", typ: "JWT" })
  const body = encodePart({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + DEFAULT_EXPIRY_SECONDS,
  })

  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(`${header}.${body}`)
    .digest("base64url")

  return `${header}.${body}.${signature}`
}

function verifyToken(token) {
  const [header, body, signature] = token.split(".")

  if (!header || !body || !signature) {
    throw new Error("Malformed token")
  }

  const expectedSignature = crypto
    .createHmac("sha256", getSecret())
    .update(`${header}.${body}`)
    .digest("base64url")

  const expected = Buffer.from(expectedSignature)
  const received = Buffer.from(signature)

  if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
    throw new Error("Invalid token signature")
  }

  const payload = decodePart(body)

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token has expired")
  }

  return payload
}

module.exports = {
  comparePassword,
  hashPassword,
  signToken,
  verifyToken,
}
