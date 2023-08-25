type Header = {
  alg: string;
  typ: string;
};

export type UserOptions = {
  id: number;
  email: string;
  type: string;
};

type Signature = string;

export type JwtPayload = {
  header: Header;
  payload: UserOptions;
  signature: Signature;
};