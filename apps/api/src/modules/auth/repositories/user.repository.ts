import type { User } from '../entities/user.entity.ts';

export interface CreateUserData {
  username: string;
  email: string;
  passwordHash: string;
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  updatePasswordHash(id: string, passwordHash: string): Promise<void>;
}
