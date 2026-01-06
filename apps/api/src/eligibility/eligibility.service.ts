import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export enum EligibilityStatus {
  ELIGIBLE = 'eligible',
  CONDITIONAL = 'conditional',
  INCOMPLETE = 'incomplete',
  EXPIRED = 'expired',
  UNDER_REVIEW = 'under_review',
  SUSPENDED = 'suspended',
}

export interface Requirement {
  id: string;
  name: string;
  description?: string;
  required: boolean;
  documentType: string;
  expirationDays?: number;
}

export interface Ruleset {
  id: string;
  commissionId: string;
  discipline: string;
  requirements: Requirement[];
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EligibilityCheck {
  fighterId: string;
  commissionId: string;
  discipline: string;
  status: EligibilityStatus;
  requirements: {
    requirement: Requirement;
    fulfilled: boolean;
    documentId?: string;
    expiresAt?: Date;
    notes?: string;
  }[];
  overrideBy?: string;
  overrideReason?: string;
  checkedAt: Date;
}

@Injectable()
export class EligibilityService {
  private rulesets: Ruleset[] = [];

  // Default MMA ruleset for Nevada
  constructor() {
    this.rulesets.push({
      id: uuidv4(),
      commissionId: 'nevada',
      discipline: 'Pro MMA',
      requirements: [
        { id: '1', name: 'Valid Licensing Physical', required: true, documentType: 'physical', expirationDays: 365 },
        { id: '2', name: 'Negative HIV Test', required: true, documentType: 'blood_test', expirationDays: 180 },
        { id: '3', name: 'Negative Hepatitis B Test', required: true, documentType: 'blood_test', expirationDays: 365 },
        { id: '4', name: 'Negative Hepatitis C Test', required: true, documentType: 'blood_test', expirationDays: 365 },
        { id: '5', name: 'Eye Examination', required: true, documentType: 'eye_exam', expirationDays: 365 },
        { id: '6', name: 'EKG (35+)', required: false, documentType: 'ekg', expirationDays: 365, description: 'Required for fighters over 35' },
      ],
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async getRuleset(commissionId: string, discipline: string): Promise<Ruleset | null> {
    return this.rulesets.find(r =>
      r.commissionId === commissionId && r.discipline === discipline
    ) || null;
  }

  async getRulesets(commissionId: string): Promise<Ruleset[]> {
    return this.rulesets.filter(r => r.commissionId === commissionId);
  }

  async createRuleset(data: Partial<Ruleset>): Promise<Ruleset> {
    const ruleset: Ruleset = {
      id: uuidv4(),
      commissionId: data.commissionId!,
      discipline: data.discipline!,
      requirements: data.requirements || [],
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.rulesets.push(ruleset);
    return ruleset;
  }

  async updateRuleset(id: string, requirements: Requirement[]): Promise<Ruleset | null> {
    const index = this.rulesets.findIndex(r => r.id === id);
    if (index === -1) return null;

    this.rulesets[index].requirements = requirements;
    this.rulesets[index].version += 1;
    this.rulesets[index].updatedAt = new Date();
    return this.rulesets[index];
  }

  async checkEligibility(
    fighterId: string,
    commissionId: string,
    discipline: string,
    fighterDocuments: { type: string; expiresAt?: Date; verified: boolean }[],
  ): Promise<EligibilityCheck> {
    const ruleset = await this.getRuleset(commissionId, discipline);
    if (!ruleset) {
      return {
        fighterId,
        commissionId,
        discipline,
        status: EligibilityStatus.INCOMPLETE,
        requirements: [],
        checkedAt: new Date(),
      };
    }

    const now = new Date();
    const requirementResults = ruleset.requirements.map(req => {
      const matchingDoc = fighterDocuments.find(d =>
        d.type === req.documentType && d.verified
      );

      const fulfilled = matchingDoc
        ? (!matchingDoc.expiresAt || matchingDoc.expiresAt > now)
        : false;

      return {
        requirement: req,
        fulfilled,
        expiresAt: matchingDoc?.expiresAt,
      };
    });

    const requiredFulfilled = requirementResults
      .filter(r => r.requirement.required)
      .every(r => r.fulfilled);

    const anyExpiringSoon = requirementResults.some(r => {
      if (!r.expiresAt) return false;
      const daysUntilExpiry = (r.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry <= 30;
    });

    let status: EligibilityStatus;
    if (!requiredFulfilled) {
      status = EligibilityStatus.INCOMPLETE;
    } else if (anyExpiringSoon) {
      status = EligibilityStatus.CONDITIONAL;
    } else {
      status = EligibilityStatus.ELIGIBLE;
    }

    return {
      fighterId,
      commissionId,
      discipline,
      status,
      requirements: requirementResults,
      checkedAt: new Date(),
    };
  }

  async overrideEligibility(
    fighterId: string,
    status: EligibilityStatus,
    overrideBy: string,
    reason: string,
  ): Promise<{ fighterId: string; status: EligibilityStatus; overrideBy: string; overrideReason: string }> {
    // TODO: Store override in database
    return {
      fighterId,
      status,
      overrideBy,
      overrideReason: reason,
    };
  }
}
