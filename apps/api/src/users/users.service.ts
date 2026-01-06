import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  // TODO: Implement with Prisma
  async findById(id: string) {
    return { id, email: 'user@example.com' };
  }

  async findByEmail(email: string) {
    return { id: '1', email };
  }
}
