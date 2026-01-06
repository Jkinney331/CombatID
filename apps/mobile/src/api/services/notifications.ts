import apiClient from '../client';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  channel: string;
  status: string;
  entityType?: string;
  entityId?: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  createdAt: string;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  type: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}

export const notificationsService = {
  async getMyNotifications(params?: {
    type?: string;
    status?: string;
    unreadOnly?: boolean;
    page?: number;
    limit?: number;
  }): Promise<NotificationResponse> {
    const response = await apiClient.get<NotificationResponse>('/notifications', { params });
    return response.data;
  },

  async getUnreadCount(): Promise<{ count: number }> {
    const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
    return response.data;
  },

  async markAsRead(id: string): Promise<Notification> {
    const response = await apiClient.put<Notification>(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead(): Promise<{ count: number }> {
    const response = await apiClient.put<{ count: number }>('/notifications/read-all');
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/notifications/${id}`);
  },

  async deleteAll(): Promise<{ count: number }> {
    const response = await apiClient.delete<{ count: number }>('/notifications');
    return response.data;
  },

  async getPreferences(): Promise<NotificationPreference[]> {
    const response = await apiClient.get<NotificationPreference[]>('/notifications/preferences');
    return response.data;
  },

  async updatePreference(data: {
    type: string;
    inAppEnabled?: boolean;
    emailEnabled?: boolean;
    pushEnabled?: boolean;
    smsEnabled?: boolean;
  }): Promise<NotificationPreference> {
    const response = await apiClient.put<NotificationPreference>('/notifications/preferences', data);
    return response.data;
  },
};
