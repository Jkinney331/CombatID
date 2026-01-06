import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface Bout {
  id: string;
  eventId: string;
  fighterAId: string;
  fighterBId: string;
  weightClass: string;
  rounds: number;
  position: number;
  status: 'pending' | 'signed' | 'approved' | 'completed' | 'cancelled';
  fighterASignedAt?: Date;
  fighterBSignedAt?: Date;
  result?: {
    winner?: string;
    method: string;
    round?: number;
    time?: string;
  };
}

export interface Event {
  id: string;
  promotionId: string;
  commissionId?: string;
  name: string;
  eventName: string;
  date: Date;
  location: string;
  type: string;
  status: 'draft' | 'submitted' | 'approved' | 'completed' | 'cancelled';
  bouts: Bout[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class EventsService {
  private events: Event[] = [];

  async create(data: Partial<Event>): Promise<Event> {
    const event: Event = {
      id: uuidv4(),
      promotionId: data.promotionId!,
      commissionId: data.commissionId,
      name: data.name!,
      eventName: data.eventName!,
      date: new Date(data.date!),
      location: data.location!,
      type: data.type!,
      status: 'draft',
      bouts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.events.push(event);
    return event;
  }

  async findAll(): Promise<Event[]> {
    return this.events;
  }

  async findById(id: string): Promise<Event | null> {
    return this.events.find(e => e.id === id) || null;
  }

  async findByCommission(commissionId: string): Promise<Event[]> {
    return this.events.filter(e => e.commissionId === commissionId);
  }

  async findByPromotion(promotionId: string): Promise<Event[]> {
    return this.events.filter(e => e.promotionId === promotionId);
  }

  async addBout(eventId: string, boutData: Partial<Bout>): Promise<Event | null> {
    const index = this.events.findIndex(e => e.id === eventId);
    if (index === -1) return null;

    const bout: Bout = {
      id: uuidv4(),
      eventId,
      fighterAId: boutData.fighterAId!,
      fighterBId: boutData.fighterBId!,
      weightClass: boutData.weightClass!,
      rounds: boutData.rounds || 3,
      position: this.events[index].bouts.length + 1,
      status: 'pending',
    };

    this.events[index].bouts.push(bout);
    this.events[index].updatedAt = new Date();
    return this.events[index];
  }

  async updateEventStatus(id: string, status: Event['status']): Promise<Event | null> {
    const index = this.events.findIndex(e => e.id === id);
    if (index === -1) return null;

    this.events[index].status = status;
    this.events[index].updatedAt = new Date();
    return this.events[index];
  }

  async signBout(eventId: string, boutId: string, fighterId: string): Promise<Bout | null> {
    const eventIndex = this.events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) return null;

    const boutIndex = this.events[eventIndex].bouts.findIndex(b => b.id === boutId);
    if (boutIndex === -1) return null;

    const bout = this.events[eventIndex].bouts[boutIndex];
    if (bout.fighterAId === fighterId) {
      bout.fighterASignedAt = new Date();
    } else if (bout.fighterBId === fighterId) {
      bout.fighterBSignedAt = new Date();
    }

    if (bout.fighterASignedAt && bout.fighterBSignedAt) {
      bout.status = 'signed';
    }

    this.events[eventIndex].updatedAt = new Date();
    return bout;
  }
}
