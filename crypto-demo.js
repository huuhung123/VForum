const crypto = require("crypto");

const hash = crypto.createHash("sha256").update("123").digest("hex");

console.log(hash);

// random bytes
crypto.randomBytes(16, (err, buf) => {});

const iv = crypto.randomBytes(3);

const key = "123456781234567812345678";
const secret_message = ":)";

const enc = crypto
  .createCipheriv("aes-256-ccm", key, iv)
  .update(secret_message, "utf8", "hex");

const dec = crypto
  .createDecipheriv("aes-256-ccm", key, iv)
  .update(enc, "hex", "utf8");

console.log(enc);
console.log(dec);
