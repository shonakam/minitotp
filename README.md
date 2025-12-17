# minitotp

RFC-compliant TOTP (Time-based One-Time Password) implementation

## Overview

miniTOTP is a simple TOTP authentication system implemented in TypeScript. It complies with RFC 6238 (TOTP) and RFC 4226 (HOTP), using SHA-1 based HMAC to generate time-based one-time passwords.

![Demo](sample.gif)

## Features

- TOTP (Time-based One-Time Password) generation and verification
- Base32 encoding/decoding
- SHA-1 hash implementation
- QR code generation (CLI)
- otpauth:// URI generation

## Installation

```bash
npm install
```

## Usage

### Start Server

```bash
npm start
```

### Commands

Once the server is started, you can use the following commands:

- `add <name>` - Register a new account and display QR code
- `verify <name> <code>` - Verify TOTP code
- `code <name>` - Display current TOTP code

### Use as Library

```typescript
import { MiniTOTP } from './lib/minitotp'
import { Base32 } from './lib/base32'

const minitotp = new MiniTOTP()

// Generate 6-digit TOTP code from secret key
const secret = Buffer.from('your-secret-key', 'utf8')
const code = minitotp.generateTOTP(secret)
console.log(code) // e.g., "123456"

// Verify code
const isValid = minitotp.verify(secret, code)
console.log(isValid) // true

// Generate otpauth URI
const uri = minitotp.URI('secret', 'user@example.com', 'YourApp')
console.log(uri)
```

## Testing

```bash
npm test
```

## Specifications

- **Algorithm**: HMAC-SHA1
- **Time Step**: 30 seconds
- **Code Digits**: 6 digits (default)
- **Standards Compliance**:
  - [RFC 6238 - TOTP](https://datatracker.ietf.org/doc/html/rfc6238)
  - [RFC 4226 - HOTP](https://datatracker.ietf.org/doc/html/rfc4226)
  - [RFC 2104 - HMAC](https://datatracker.ietf.org/doc/html/rfc2104)
  - [RFC 3147 - SHA1](https://datatracker.ietf.org/doc/html/rfc3174)

## License

MIT

## Author

shonakam
