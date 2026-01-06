import apiClient from '../client';

export interface Fighter {
  id: string;
  combatId: string;
  userId: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  dateOfBirth: string;
  gender?: string;
  nationality?: string;
  countryOfBirth?: string;
  currentCity?: string;
  currentState?: string;
  currentCountry?: string;
  heightCm?: number;
  reachCm?: number;
  weightClass?: string;
  disciplines: string[];
  stance?: string;
  gymId?: string;
  wins: number;
  losses: number;
  draws: number;
  noContests: number;
  knockouts: number;
  submissions: number;
  status: string;
  verificationStatus: string;
  eligibilityStatus: string;
  bio?: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFighterRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nickname?: string;
  gender?: string;
  nationality?: string;
  countryOfBirth?: string;
  currentCity?: string;
  currentState?: string;
  currentCountry?: string;
  heightCm?: number;
  reachCm?: number;
  weightClass?: string;
  disciplines?: string[];
  stance?: string;
  gymId?: string;
  bio?: string;
}

export interface FighterSearchParams {
  discipline?: string;
  weightClass?: string;
  status?: string;
  eligibilityStatus?: string;
  verificationStatus?: string;
  gymId?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export interface FighterSearchResponse {
  fighters: Fighter[];
  total: number;
  page: number;
  limit: number;
}

export interface ProfileCompletion {
  score: number;
  missingFields: string[];
  completedFields: string[];
}

export const fightersService = {
  async create(data: CreateFighterRequest): Promise<Fighter> {
    const response = await apiClient.post<Fighter>('/fighters', data);
    return response.data;
  },

  async getMyProfile(): Promise<Fighter> {
    const response = await apiClient.get<Fighter>('/fighters/me');
    return response.data;
  },

  async getById(id: string): Promise<Fighter> {
    const response = await apiClient.get<Fighter>(`/fighters/${id}`);
    return response.data;
  },

  async getByCombatId(combatId: string): Promise<Fighter> {
    const response = await apiClient.get<Fighter>(`/fighters/combat-id/${combatId}`);
    return response.data;
  },

  async search(params: FighterSearchParams): Promise<FighterSearchResponse> {
    const response = await apiClient.get<FighterSearchResponse>('/fighters', { params });
    return response.data;
  },

  async update(id: string, data: Partial<CreateFighterRequest>): Promise<Fighter> {
    const response = await apiClient.put<Fighter>(`/fighters/${id}`, data);
    return response.data;
  },

  async getCompletion(id: string): Promise<ProfileCompletion> {
    const response = await apiClient.get<ProfileCompletion>(`/fighters/${id}/completion`);
    return response.data;
  },

  async verifyCombatId(combatId: string): Promise<{
    valid: boolean;
    fighter?: Partial<Fighter>;
    status?: string;
  }> {
    const response = await apiClient.get(`/fighters/verify/${combatId}`);
    return response.data;
  },
};
