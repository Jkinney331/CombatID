import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './dto/create-user.dto';
import { User, UserRole, UserStatus, Prisma } from '@prisma/client';

export interface Auth0UserProfile {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  [key: string]: unknown;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Sync user from Auth0 - creates if not exists, updates if exists
   * Called after successful authentication
   */
  async syncFromAuth0(profile: Auth0UserProfile, defaultRole?: UserRole): Promise<User> {
    const auth0Id = profile.sub;
    const email = profile.email;

    const existingUser = await this.prisma.user.findUnique({
      where: { auth0Id },
    });

    if (existingUser) {
      // Update last login and any changed profile data
      return this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          email: email,
          emailVerified: profile.email_verified ?? false,
          firstName: profile.given_name ?? existingUser.firstName,
          lastName: profile.family_name ?? existingUser.lastName,
          avatarUrl: profile.picture ?? existingUser.avatarUrl,
          lastLoginAt: new Date(),
        },
      });
    }

    // Create new user
    this.logger.log(`Creating new user from Auth0: ${email}`);
    return this.prisma.user.create({
      data: {
        auth0Id,
        email,
        emailVerified: profile.email_verified ?? false,
        firstName: profile.given_name,
        lastName: profile.family_name,
        avatarUrl: profile.picture,
        role: defaultRole ?? UserRole.FIGHTER,
        status: UserStatus.PENDING_VERIFICATION,
        lastLoginAt: new Date(),
      },
    });
  }

  async create(dto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { auth0Id: dto.auth0Id },
        ],
      },
    });

    if (existing) {
      throw new ConflictException('User with this email or Auth0 ID already exists');
    }

    return this.prisma.user.create({
      data: {
        email: dto.email,
        auth0Id: dto.auth0Id,
        role: dto.role,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        avatarUrl: dto.avatarUrl,
        emailVerified: dto.emailVerified ?? false,
        status: UserStatus.PENDING_VERIFICATION,
      },
    });
  }

  async findAll(query: UserQueryDto): Promise<{ users: User[]; total: number }> {
    const { role, status, search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          organizationMemberships: {
            include: {
              organization: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        organizationMemberships: {
          include: {
            organization: true,
          },
        },
        consents: {
          orderBy: { grantedAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByAuth0Id(auth0Id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { auth0Id },
      include: {
        organizationMemberships: {
          include: {
            organization: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    // Verify user exists
    await this.findById(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        avatarUrl: dto.avatarUrl,
        status: dto.status,
        role: dto.role,
      },
    });
  }

  async updateStatus(id: string, status: UserStatus): Promise<User> {
    await this.findById(id);

    return this.prisma.user.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);

    await this.prisma.user.delete({
      where: { id },
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }
}
