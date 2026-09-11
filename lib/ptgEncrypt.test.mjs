import assert from "node:assert/strict";
import test from "node:test";
import { PTGEncrypt } from "./ptgEncrypt.ts";

const value = "4570213852_PTG24_5800700033754";

test("encrypts with the VB default key", () => {
  const encryptor = new PTGEncrypt();

  assert.equal(
    encryptor.encrypt(value),
    "VHZlFYGg792LxuVzhqpYqGLc8zhhjlMewajBkrMCXNM=",
  );
  assert.equal(
    encryptor.encryptUrlEncoded(value),
    "VHZlFYGg792LxuVzhqpYqGLc8zhhjlMewajBkrMCXNM%3D",
  );
});

test("decrypts Base64 and URL-encoded Base64", () => {
  const encryptor = new PTGEncrypt();
  const encrypted = encryptor.encrypt(value);

  assert.equal(encryptor.decrypt(encrypted), value);
  assert.equal(encryptor.decryptUrlEncoded(encodeURIComponent(encrypted)), value);
  assert.equal(encryptor.decrypt("invalid"), "");
});

test("matches the VB custom-key constructor behavior", () => {
  const encryptor = new PTGEncrypt("PTG24");

  assert.equal(
    encryptor.encrypt(value),
    "I7AG+3KmUadnttrRbgka3GSOWIfkHCrbWRuI73WkLaA=",
  );
  assert.equal(encryptor.decrypt(encryptor.encrypt(value)), value);
});
