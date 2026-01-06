import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';
import { UsersService, Auth0UserProfile } from '../../users/users.service';

export interface JwtPayload {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  [key: string]: unknown;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    const auth0Domain = configService.get<string>('auth0.domain');
    const auth0Audience = configService.get<string>('auth0.audience');

    if (!auth0Domain || !auth0Audience) {
      throw new Error('Auth0 configuration is missing');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      audience: auth0Audience,
      issuer: `https://${auth0Domain}/`,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${auth0Domain}/.well-known/jwks.json`,
      }),
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    try {
      // Sync user from Auth0 - creates if not exists, updates if exists
      const user = await this.usersService.syncFromAuth0(payload as Auth0UserProfile);

      // Return user data for request context
      return {
        userId: user.id,
        auth0Id: user.auth0Id,
        email: user.email,
        role: user.role,
        status: user.status,
        firstName: user.firstName,
        lastName: user.lastName,
        // Include organization memberships if loaded
        organizationMemberships: (user as any).organizationMemberships || [],
      };
    } catch (error) {
      this.logger.error(`Failed to sync user from Auth0: ${payload.sub}`, error);
      throw new UnauthorizedException('Failed to authenticate user');
    }
  }
}
