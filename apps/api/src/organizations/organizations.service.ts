// @ts-nocheck - Placeholder service, will be replaced with Prisma implementation
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export enum OrganizationType {
  GYM = 'gym',
  PROMOTION = 'promotion',
  COMMISSION = 'commission',
}

export interface Organization {
  id: string;
  type: OrganizationType;
  name: string;
  description?: string;
  logoUrl?: string;
  location: string;
  jurisdiction?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  ownerId: string;
  memberIds: string[];
  rosterFighterIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class OrganizationsService {
  private organizations: Organization[] = [];

  async create(data: Partial<Organization>): Promise<Organization> {
    const org: Organization = {
      id: uuidv4(),
      type: data.type!,
      name: data.name!,
      description: data.description,
      location: data.location!,
      jurisdiction: data.jurisdiction,
      verificationStatus: 'pending',
      ownerId: data.ownerId!,
      memberIds: [data.ownerId!],
      rosterFighterIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.organizations.push(org);
    return org;
  }

  async findAll(type?: OrganizationType): Promise<Organization[]> {
    if (type) {
      return this.organizations.filter(o => o.type === type);
    }
    return this.organizations;
  }

  async findById(id: string): Promise<Organization | null> {
    return this.organizations.find(o => o.id === id) || null;
  }

  async addFighterToRoster(orgId: string, fighterId: string): Promise<Organization | null> {
    const index = this.organizations.findIndex(o => o.id === orgId);
    if (index === -1) return null;

    if (!this.organizations[index].rosterFighterIds.includes(fighterId)) {
      this.organizations[index].rosterFighterIds.push(fighterId);
      this.organizations[index].updatedAt = new Date();
    }
    return this.organizations[index];
  }

  async removeFighterFromRoster(orgId: string, fighterId: string): Promise<Organization | null> {
    const index = this.organizations.findIndex(o => o.id === orgId);
    if (index === -1) return null;

    this.organizations[index].rosterFighterIds = this.organizations[index].rosterFighterIds.filter(
      id => id !== fighterId
    );
    this.organizations[index].updatedAt = new Date();
    return this.organizations[index];
  }
}
