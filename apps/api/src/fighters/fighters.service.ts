import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface Fighter {
  id: string;
  combatId: string;
  userId: string;
  name: string;
  dateOfBirth: Date;
  countryOfBirth: string;
  currentResidence: string;
  weightClass: string;
  disciplines: string[];
  record: string;
  gym?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  eligibilityStatus: 'eligible' | 'conditional' | 'incomplete' | 'expired' | 'under_review';
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class FightersService {
  // TODO: Replace with Prisma implementation
  private fighters: Fighter[] = [];

  generateCombatId(name: string): string {
    const namePart = name.replace(/\s+/g, '').substring(0, 4).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${namePart}${randomPart}`;
  }

  async create(data: Partial<Fighter>): Promise<Fighter> {
    const fighter: Fighter = {
      id: uuidv4(),
      combatId: this.generateCombatId(data.name || 'UNKNOWN'),
      userId: data.userId!,
      name: data.name!,
      dateOfBirth: data.dateOfBirth!,
      countryOfBirth: data.countryOfBirth!,
      currentResidence: data.currentResidence!,
      weightClass: data.weightClass!,
      disciplines: data.disciplines || [],
      record: '0-0',
      gym: data.gym,
      verificationStatus: 'pending',
      eligibilityStatus: 'incomplete',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.fighters.push(fighter);
    return fighter;
  }

  async findAll(): Promise<Fighter[]> {
    return this.fighters;
  }

  async findById(id: string): Promise<Fighter | null> {
    return this.fighters.find(f => f.id === id) || null;
  }

  async findByCombatId(combatId: string): Promise<Fighter | null> {
    return this.fighters.find(f => f.combatId === combatId) || null;
  }

  async findByUserId(userId: string): Promise<Fighter | null> {
    return this.fighters.find(f => f.userId === userId) || null;
  }

  async update(id: string, data: Partial<Fighter>): Promise<Fighter | null> {
    const index = this.fighters.findIndex(f => f.id === id);
    if (index === -1) return null;

    this.fighters[index] = {
      ...this.fighters[index],
      ...data,
      updatedAt: new Date(),
    };
    return this.fighters[index];
  }

  async search(query: {
    discipline?: string;
    weightClass?: string;
    status?: string;
    q?: string;
  }): Promise<Fighter[]> {
    return this.fighters.filter(f => {
      if (query.discipline && !f.disciplines.includes(query.discipline)) return false;
      if (query.weightClass && f.weightClass !== query.weightClass) return false;
      if (query.status && f.eligibilityStatus !== query.status) return false;
      if (query.q) {
        const searchLower = query.q.toLowerCase();
        if (!f.name.toLowerCase().includes(searchLower) &&
            !f.combatId.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      return true;
    });
  }
}
