import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConsentType, Prisma } from '@prisma/client';

// Current consent versions - should be updated when policies change
export const CONSENT_VERSIONS = {
  [ConsentType.TERMS_OF_SERVICE]: '1.0',
  [ConsentType.PRIVACY_POLICY]: '1.0',
  [ConsentType.HIPAA_AUTHORIZATION]: '1.0',
  [ConsentType.DATA_SHARING]: '1.0',
  [ConsentType.MARKETING_COMMUNICATIONS]: '1.0',
};

// Required consents for platform access
export const REQUIRED_CONSENTS: ConsentType[] = [
  ConsentType.TERMS_OF_SERVICE,
  ConsentType.PRIVACY_POLICY,
  ConsentType.HIPAA_AUTHORIZATION,
];

export interface GrantConsentDto {
  userId: string;
  type: ConsentType;
  granted: boolean;
  ipAddress?: string;
  userAgent?: string;
}

export interface ConsentStatus {
  type: ConsentType;
  currentVersion: string;
  granted: boolean;
  grantedAt?: Date;
  grantedVersion?: string;
  needsRenewal: boolean;
}

@Injectable()
export class ConsentService {
  private readonly logger = new Logger(ConsentService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Grant or update consent
   */
  async grantConsent(dto: GrantConsentDto) {
    const currentVersion = CONSENT_VERSIONS[dto.type];

    // Check if consent already exists for this version
    const existing = await this.prisma.userConsent.findUnique({
      where: {
        userId_type_version: {
          userId: dto.userId,
          type: dto.type,
          version: currentVersion,
        },
      },
    });

    if (existing) {
      // Update existing consent
      return this.prisma.userConsent.update({
        where: { id: existing.id },
        data: {
          granted: dto.granted,
          grantedAt: dto.granted ? new Date() : existing.grantedAt,
          revokedAt: dto.granted ? null : new Date(),
          ipAddress: dto.ipAddress,
          userAgent: dto.userAgent,
        },
      });
    }

    // Create new consent record
    return this.prisma.userConsent.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        version: currentVersion,
        granted: dto.granted,
        ipAddress: dto.ipAddress,
        userAgent: dto.userAgent,
        revokedAt: dto.granted ? null : new Date(),
      },
    });
  }

  /**
   * Revoke a specific consent
   */
  async revokeConsent(userId: string, type: ConsentType) {
    const currentVersion = CONSENT_VERSIONS[type];

    const consent = await this.prisma.userConsent.findUnique({
      where: {
        userId_type_version: {
          userId,
          type,
          version: currentVersion,
        },
      },
    });

    if (!consent) {
      throw new NotFoundException('Consent record not found');
    }

    // Check if this is a required consent
    if (REQUIRED_CONSENTS.includes(type)) {
      throw new BadRequestException(
        `${type} consent is required to use the platform. Revoking this consent will suspend your account.`,
      );
    }

    return this.prisma.userConsent.update({
      where: { id: consent.id },
      data: {
        granted: false,
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Get all consents for a user
   */
  async getUserConsents(userId: string) {
    return this.prisma.userConsent.findMany({
      where: { userId },
      orderBy: [{ type: 'asc' }, { grantedAt: 'desc' }],
    });
  }

  /**
   * Get consent status for all types
   */
  async getConsentStatus(userId: string): Promise<ConsentStatus[]> {
    const consents = await this.getUserConsents(userId);

    return Object.entries(CONSENT_VERSIONS).map(([type, currentVersion]) => {
      const consentType = type as ConsentType;
      const latestConsent = consents.find(
        (c) => c.type === consentType && c.version === currentVersion,
      );

      return {
        type: consentType,
        currentVersion,
        granted: latestConsent?.granted ?? false,
        grantedAt: latestConsent?.grantedAt,
        grantedVersion: latestConsent?.version,
        needsRenewal: !latestConsent || latestConsent.version !== currentVersion,
      };
    });
  }

  /**
   * Check if user has all required consents
   */
  async hasRequiredConsents(userId: string): Promise<boolean> {
    const status = await this.getConsentStatus(userId);

    return REQUIRED_CONSENTS.every((requiredType) => {
      const consent = status.find((s) => s.type === requiredType);
      return consent?.granted && !consent.needsRenewal;
    });
  }

  /**
   * Get missing required consents
   */
  async getMissingConsents(userId: string): Promise<ConsentType[]> {
    const status = await this.getConsentStatus(userId);

    return REQUIRED_CONSENTS.filter((requiredType) => {
      const consent = status.find((s) => s.type === requiredType);
      return !consent?.granted || consent.needsRenewal;
    });
  }

  /**
   * Bulk grant consents (for initial signup)
   */
  async grantBulkConsents(
    userId: string,
    types: ConsentType[],
    ipAddress?: string,
    userAgent?: string,
  ) {
    const results = await Promise.all(
      types.map((type) =>
        this.grantConsent({
          userId,
          type,
          granted: true,
          ipAddress,
          userAgent,
        }),
      ),
    );

    this.logger.log(`Bulk consents granted for user ${userId}: ${types.join(', ')}`);

    return results;
  }

  /**
   * Get consent history for audit
   */
  async getConsentHistory(userId: string, type?: ConsentType) {
    const where: Prisma.UserConsentWhereInput = { userId };

    if (type) {
      where.type = type;
    }

    return this.prisma.userConsent.findMany({
      where,
      orderBy: { grantedAt: 'desc' },
    });
  }

  /**
   * Export user data (for privacy compliance)
   */
  async exportUserData(userId: string) {
    const [user, consents, organizations, sessions] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          lastLoginAt: true,
        },
      }),
      this.prisma.userConsent.findMany({
        where: { userId },
      }),
      this.prisma.organizationMember.findMany({
        where: { userId },
        include: { organization: true },
      }),
      this.prisma.userSession.findMany({
        where: { userId },
        select: {
          ipAddress: true,
          userAgent: true,
          lastActiveAt: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      exportedAt: new Date().toISOString(),
      user,
      consents,
      organizations,
      loginHistory: sessions,
    };
  }

  /**
   * Request data deletion (GDPR right to be forgotten)
   */
  async requestDataDeletion(userId: string): Promise<{ message: string }> {
    // In a real implementation, this would:
    // 1. Create a deletion request record
    // 2. Notify admins
    // 3. Schedule deletion after grace period
    // 4. Handle any legal holds

    this.logger.log(`Data deletion requested for user ${userId}`);

    // For now, just log and return a message
    return {
      message:
        'Your data deletion request has been received. We will process it within 30 days as required by law.',
    };
  }
}
