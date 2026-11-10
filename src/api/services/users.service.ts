import type { ApiClient } from '../api-client';

export interface NewUser {
  username: string;
  name: string;
  email: string;
  password: string;
}

export interface User {
  _id: string;
  username: string;
  name: string;
}

export class UsersService {
  constructor(private readonly admin: ApiClient) {}

  async create(user: NewUser): Promise<User> {
    const { user: created } = await this.admin.post<{ user: User }>('users.create', {
      ...user,
      verified: true,
      requirePasswordChange: false,
      sendWelcomeEmail: false,
    });
    return created;
  }

  async setActive(userId: string, active: boolean): Promise<void> {
    await this.admin.post('users.setActiveStatus', { userId, activeStatus: active });
  }

  async delete(userId: string): Promise<void> {
    await this.admin.post('users.delete', { userId, confirmRelinquish: true });
  }

  async listByPrefix(prefix: string): Promise<User[]> {
    const pageSize = 100;
    const matches: User[] = [];
    for (let offset = 0; ; offset += pageSize) {
      const page = await this.admin.get<{ users: User[]; total: number }>('users.list', { count: pageSize, offset });
      matches.push(...page.users.filter(user => user.username?.startsWith(prefix)));
      if (offset + pageSize >= page.total) return matches;
    }
  }
}
