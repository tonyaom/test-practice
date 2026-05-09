import Nat8 "mo:core/Nat8";
import Nat32 "mo:core/Nat32";
import Nat64 "mo:core/Nat64";
import Int "mo:core/Int";
import Text "mo:core/Text";
import List "mo:core/List";
import Nat "mo:core/Nat";

/// Pure-Motoko TOTP implementation (RFC 6238 / RFC 4226)
/// HMAC-SHA1 based, 6-digit codes, 30-second window, ±1 step tolerance.
module {

  // ── SHA-1 round constants (4 values, one per round group)
  let K : [Nat32] = [0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6];

  // ── Low-level 32-bit helpers ─────────────────────────────────────────────────────

  func rotl32(x : Nat32, n : Nat32) : Nat32 {
    (x << n) | (x >> (32 - n))
  };

  func n8toN32(b : Nat8) : Nat32 { Nat32.fromNat(b.toNat()) };
  func n32toN8(x : Nat32) : Nat8 { Nat8.fromNat((x & 0xFF).toNat()) };

  func b4toWord(a : Nat8, b : Nat8, c : Nat8, d : Nat8) : Nat32 {
    (n8toN32(a) << 24) | (n8toN32(b) << 16) | (n8toN32(c) << 8) | n8toN32(d)
  };

  func wordToB4(x : Nat32) : (Nat8, Nat8, Nat8, Nat8) {
    (n32toN8(x >> 24), n32toN8(x >> 16), n32toN8(x >> 8), n32toN8(x))
  };

  // ── SHA-1 ──────────────────────────────────────────────────────────────────

  /// SHA-1 digest of msg bytes, returns 20 bytes.
  public func sha1(msg : [Nat8]) : [Nat8] {
    let msgLen : Nat = msg.size();
    let bitLen64 : Nat64 = Nat64.fromNat(msgLen) << 3;  // * 8

    // Padded byte length: smallest multiple of 64 >= msgLen + 9
    let base = msgLen + 1;
    let rem = base % 64;
    let paddedBytes : Nat = if (rem <= 56) base + (56 - rem) + 8
                            else base + (64 - rem + 56) + 8;

    // Build padded byte buffer
    let buf = Array.tabulate<Nat8>(paddedBytes, func(i) {
      if (i < msgLen) { msg[i] }
      else if (i == msgLen) { 0x80 }
      else if (i < paddedBytes - 8) { 0x00 }
      else {
        // 8 bytes big-endian bit-length at end
        let shift = Nat64.fromNat((paddedBytes - 1 - i) * 8);
        Nat8.fromNat(((bitLen64 >> shift) & 0xFF).toNat())
      }
    });

    // Build 32-bit word array from buf
    let numWords = paddedBytes / 4;
    let blockWords = Array.tabulate(numWords, func(j : Nat) : Nat32 {
      b4toWord(buf[j*4], buf[j*4+1], buf[j*4+2], buf[j*4+3])
    });

    // Initial hash values
    var h0 : Nat32 = 0x67452301;
    var h1 : Nat32 = 0xEFCDAB89;
    var h2 : Nat32 = 0x98BADCFE;
    var h3 : Nat32 = 0x10325476;
    var h4 : Nat32 = 0xC3D2E1F0;

    let numBlocks = numWords / 16;
    let w = Array.toVarArray(Array.tabulate(80, func(_ : Nat) : Nat32 = 0));

    var blk = 0;
    while (blk < numBlocks) {
      // Load 16 message words
      var t = 0;
      while (t < 16) { w[t] := blockWords[blk * 16 + t]; t += 1 };
      // Expand to 80 words
      while (t < 80) {
        w[t] := rotl32(w[t-3] ^ w[t-8] ^ w[t-14] ^ w[t-16], 1);
        t += 1;
      };

      var a = h0; var b = h1; var c = h2; var d = h3; var e = h4;

      t := 0;
      while (t < 80) {
        let (f, k) : (Nat32, Nat32) =
          if (t < 20)      ((b & c) | ((^ b) & d), K[0])
          else if (t < 40) (b ^ c ^ d,              K[1])
          else if (t < 60) ((b & c) | (b & d) | (c & d), K[2])
          else             (b ^ c ^ d,              K[3]);
        let tmp = rotl32(a, 5) +% f +% e +% k +% w[t];
        e := d; d := c; c := rotl32(b, 30); b := a; a := tmp;
        t += 1;
      };

      h0 +%= a; h1 +%= b; h2 +%= c; h3 +%= d; h4 +%= e;
      blk += 1;
    };

    let (a0,a1,a2,a3) = wordToB4(h0);
    let (b0,b1,b2,b3) = wordToB4(h1);
    let (c0,c1,c2,c3) = wordToB4(h2);
    let (d0,d1,d2,d3) = wordToB4(h3);
    let (e0,e1,e2,e3) = wordToB4(h4);
    [a0,a1,a2,a3, b0,b1,b2,b3, c0,c1,c2,c3, d0,d1,d2,d3, e0,e1,e2,e3]
  };

  // ── HMAC-SHA1 ────────────────────────────────────────────────────────────

  public func hmacSha1(key : [Nat8], msg : [Nat8]) : [Nat8] {
    let normKey : [Nat8] = if (key.size() > 64) sha1(key) else key;
    let klen = normKey.size();
    let mlen = msg.size();

    let ipad = Array.tabulate(64, func(i : Nat) : Nat8 {
      (if (i < klen) normKey[i] else 0x00) ^ 0x36
    });
    let opad = Array.tabulate(64, func(i : Nat) : Nat8 {
      (if (i < klen) normKey[i] else 0x00) ^ 0x5C
    });

    let innerInput = Array.tabulate(64 + mlen, func(i : Nat) : Nat8 {
      if (i < 64) ipad[i] else msg[i - 64]
    });
    let inner = sha1(innerInput);
    let outerInput = Array.tabulate(84, func(i : Nat) : Nat8 {
      if (i < 64) opad[i] else inner[i - 64]
    });
    sha1(outerInput)
  };

  // ── Base32 ────────────────────────────────────────────────────────────────────

  let BASE32_CHARS : [Char] = [
    'A','B','C','D','E','F','G','H',
    'I','J','K','L','M','N','O','P',
    'Q','R','S','T','U','V','W','X',
    'Y','Z','2','3','4','5','6','7',
  ];

  func base32CharVal(c : Char) : ?Nat {
    let n = Char.toNat32(c);
    if (n >= 65 and n <= 90) { ?(n - 65).toNat() }     // A-Z -> 0-25
    else if (n >= 97 and n <= 122) { ?(n - 97).toNat() } // a-z -> 0-25
    else if (n >= 50 and n <= 55) { ?(n - 24).toNat() }  // '2'-'7' -> 26-31
    else null
  };

  public func base32Decode(input : Text) : [Nat8] {
    // Two-pass: first count valid chars to size output, then decode
    var validCount : Nat = 0;
    for (c in input.toIter()) {
      switch (base32CharVal(c)) {
        case null {};
        case (?_) { validCount += 1 };
      };
    };
    let outLen = (validCount * 5) / 8;
    if (outLen == 0) return [];

    // Decode into a List, then convert
    var bits : Nat = 0;
    var bitBuf : Nat32 = 0;
    let collected = List.empty<Nat8>();
    for (c in input.toIter()) {
      switch (base32CharVal(c)) {
        case null {};
        case (?v) {
          bitBuf := (bitBuf << 5) | Nat32.fromNat(v);
          bits += 5;
          if (bits >= 8) {
            bits -= 8;
            collected.add(n32toN8(bitBuf >> Nat32.fromNat(bits)));
          };
        };
      };
    };
    collected.toArray()
  };

  public func base32Encode(data : [Nat8]) : Text {
    var bits : Nat = 0;
    var bitBuf : Nat32 = 0;
    var result = "";
    for (byte in data.vals()) {
      bitBuf := (bitBuf << 8) | n8toN32(byte);
      bits += 8;
      while (bits >= 5) {
        bits -= 5;
        let idx : Nat32 = (bitBuf >> Nat32.fromNat(bits)) & 0x1F;
        result := result # Text.fromChar(BASE32_CHARS[idx.toNat()]);
      };
    };
    if (bits > 0) {
      let idx : Nat32 = (bitBuf << Nat32.fromNat(5 - bits)) & 0x1F;
      result := result # Text.fromChar(BASE32_CHARS[idx.toNat()]);
    };
    result
  };

  // ── TOTP secret generation ────────────────────────────────────────────────

  /// Generates a deterministic 20-byte TOTP secret from username + counter.
  public func generateSecret(username : Text, counter : Nat) : Text {
    let usernameChars = username.toArray();
    let ulen = usernameChars.size();
    let seed = Array.tabulate(ulen + 8, func(i : Nat) : Nat8 {
      if (i < ulen) {
        Nat8.fromNat(Char.toNat32(usernameChars[i]).toNat() % 256)
      } else {
        // big-endian 8-byte counter: byte at position (i - ulen) from MSB
        let bytePos = ulen + 7 - i; // 7 for first byte (MSB), 0 for last
        Nat8.fromNat((counter / Nat.pow(256, bytePos)) % 256)
      }
    });
    base32Encode(sha1(seed))
  };

  // ── HOTP / TOTP ─────────────────────────────────────────────────────

  /// HOTP: compute 6-digit code for a key (raw bytes) and 64-bit counter.
  public func hotp(keyBytes : [Nat8], counter : Nat64) : Nat {
    let counterBytes = Array.tabulate(8, func(i : Nat) : Nat8 {
      Nat8.fromNat(((counter >> Nat64.fromNat((7 - i) * 8)) & 0xFF).toNat())
    });
    let mac = hmacSha1(keyBytes, counterBytes);
    let offset : Nat = mac[19].toNat() % 16;           // & 0x0F
    let p : Nat =
      (mac[offset].toNat()     % 128) * 16777216  // bit 31 cleared (& 0x7F), << 24
    + (mac[offset + 1].toNat() % 256) * 65536      // & 0xFF, << 16
    + (mac[offset + 2].toNat() % 256) * 256        // & 0xFF, << 8
    + (mac[offset + 3].toNat() % 256);             // & 0xFF
    p % 1_000_000
  };

  /// Convert IC time (nanoseconds) to a 30-second TOTP time step.
  public func timeStep(timeNs : Int) : Nat64 {
    let secs : Nat = Int.abs(timeNs) / 1_000_000_000;
    Nat64.fromNat(secs / 30)
  };

  /// Validate a 6-digit code against a base32 secret. Accepts current ±1 step.
  public func verifyCode(secret : Text, code : Text, timeNs : Int) : Bool {
    let keyBytes = base32Decode(secret);
    let step = timeStep(timeNs);
    let prev : Nat64 = if (step > 0) step - 1 else step;
    let steps : [Nat64] = [prev, step, step + 1];
    for (s in steps.vals()) {
      if (padLeft6(hotp(keyBytes, s)) == code) return true;
    };
    false
  };

  func padLeft6(n : Nat) : Text {
    var s = n.toText();
    while (s.size() < 6) { s := "0" # s };
    s
  };

  /// Build otpauth URI for QR code display.
  public func makeOtpAuthUri(secret : Text, username : Text, issuer : Text) : Text {
    "otpauth://totp/" # issuer # ":" # username
    # "?secret=" # secret
    # "&issuer=" # issuer
    # "&algorithm=SHA1&digits=6&period=30"
  };
};
