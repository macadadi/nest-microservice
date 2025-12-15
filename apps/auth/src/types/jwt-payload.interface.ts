export interface JwtPayload {
  email: string;
  sub: string;
  exp?: number;
  iat?: number;
}

export interface JwtPayloadWithUser extends JwtPayload {
  _id: string;
}
