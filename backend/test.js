import crypto from "crypto";

const bytes = crypto.randomBytes(20);
console.log(bytes);
console.log("base64: " + bytes.toString(`base64`));
console.log("hex: " + bytes.toString(`hex`));
console.log("utf8: " + bytes.toString());
const token = bytes.toString(`hex`);
const restToken = crypto.createHash("sha256").update(token).digest("hex");
console.log("restToken: " + restToken);
