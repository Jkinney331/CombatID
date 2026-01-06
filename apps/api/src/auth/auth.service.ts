import { Injectable } from '@nestjs/common';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  combatId?: string;
}

@Injectable()
export class AuthService {
  constructor() {}

  // Auth0 handles token generation and validation
  // This service is a placeholder for future auth-related business logic

  async refreshToken(_token: string): Promise<string> {
    // In a real Auth0 setup, you would use Auth0's refresh token flow
    // This is a placeholder implementation
    throw new Error('Token refresh should be handled by Auth0');
  }
}
