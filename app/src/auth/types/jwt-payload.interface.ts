export interface JwtPayload {
  email: string;
  sub: string;
  exp?: number;
  iat?: number;
}

export interface JwtPayloadWithUser extends JwtPayload {
  id: string;
}
