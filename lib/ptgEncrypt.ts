import { createCipheriv, createDecipheriv } from "node:crypto";

const DEFAULT_KEY = "GianluigiBuffon";
const IV = Buffer.from([0x32, 0x56, 0xff, 0x78, 0x90, 0xa1, 0xcd, 0x32]);

export class PTGEncrypt {
  public errorMessage = "";
  private readonly key: string;

  constructor(xkey?: string) {
    this.key = xkey === undefined ? DEFAULT_KEY : `${xkey}abcdefgh`;
  }

  encrypt(text: string): string {
    const cipher = createCipheriv("des-ede3-cbc", this.createTripleDesKey(), IV);
    return Buffer.concat([cipher.update(text, "utf8"), cipher.final()]).toString(
      "base64",
    );
  }

  encryptUrlEncoded(text: string): string {
    return encodeURIComponent(this.encrypt(text));
  }

  decrypt(text: string): string {
    try {
      const decipher = createDecipheriv(
        "des-ede3-cbc",
        this.createTripleDesKey(),
        IV,
      );
      return Buffer.concat([
        decipher.update(text, "base64"),
        decipher.final(),
      ]).toString("utf8");
    } catch {
      return "";
    }
  }

  decryptUrlEncoded(text: string): string {
    try {
      return this.decrypt(decodeURIComponent(text));
    } catch {
      return "";
    }
  }

  private createTripleDesKey(): Buffer {
    const desKey = Buffer.from(this.key.slice(0, 8), "utf8");
    return Buffer.concat([desKey, desKey, desKey]);
  }
}
