export interface LoginResult {
    token: string;
    user: {
        _id: string;
        username: string;
        role: string;
        status: string;
    };
}

export interface LoginInput {
    username: string;
    password: string;
    ipAddress?: string;
}

export interface JwtPayload {
    id: string;
    role: string;
    iat?: number;
    exp?: number;
  }