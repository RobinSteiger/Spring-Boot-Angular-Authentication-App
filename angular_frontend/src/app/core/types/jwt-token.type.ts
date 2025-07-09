export type JwtToken = {
  sub: string;      // username
  iss: string;      // issuer
  role: string[];   // roles array 
  iat: number;      // issued at
  exp: number;      // expiration
}