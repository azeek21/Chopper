export function encode(str: string): string {
  return Buffer.from(str).toString("base64url");
}

export function decode(encoding: string): string {
  return Buffer.from(encoding, "base64url").toString();
}
