import apiClient from '../client';

export interface EligibilityCheck {
  id: string;
  fighterId: string;
  rulesetId: string;
  status: string;
  overallScore?: number;
  isOverridden: boolean;
  overriddenById?: string;
  overrideReason?: string;
  overriddenAt?: string;
  validFrom: string;
  validUntil?: string;
  checkedAt: string;
  requirementResults: RequirementResult[];
}

export interface RequirementResult {
  id: string;
  eligibilityCheckId: string;
  requirementName: string;
  documentType: string;
  isFulfilled: boolean;
  isRequired: boolean;
  documentId?: string;
  documentExpiresAt?: string;
  notes?: string;
}

export interface Ruleset {
  id: string;
  commissionId: string;
  discipline: string;
  name: string;
  description?: string;
  version: number;
  isActive: boolean;
  requirements: RulesetRequirement[];
}

export interface RulesetRequirement {
  id: string;
  rulesetId: string;
  name: string;
  description?: string;
  documentType: string;
  isRequired: boolean;
  expirationDays?: number;
  condition?: string;
  conditionDescription?: string;
  sortOrder: number;
}

export const eligibilityService = {
  async checkEligibility(fighterId: string, rulesetId: string): Promise<EligibilityCheck> {
    const response = await apiClient.post<EligibilityCheck>(
      `/eligibility/check/${fighterId}/${rulesetId}`
    );
    return response.data;
  },

  async getLatestCheck(fighterId: string, rulesetId: string): Promise<EligibilityCheck> {
    const response = await apiClient.get<EligibilityCheck>(
      `/eligibility/latest/${fighterId}/${rulesetId}`
    );
    return response.data;
  },

  async getHistory(fighterId: string): Promise<EligibilityCheck[]> {
    const response = await apiClient.get<EligibilityCheck[]>(`/eligibility/history/${fighterId}`);
    return response.data;
  },

  async getRulesets(commissionId: string, discipline?: string): Promise<Ruleset[]> {
    const response = await apiClient.get<Ruleset[]>(`/eligibility/rulesets/${commissionId}`, {
      params: { discipline },
    });
    return response.data;
  },

  async getMissingRequirements(fighterId: string, rulesetId: string): Promise<RulesetRequirement[]> {
    const response = await apiClient.get<RulesetRequirement[]>(
      `/eligibility/missing/${fighterId}/${rulesetId}`
    );
    return response.data;
  },
};
