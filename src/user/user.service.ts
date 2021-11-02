import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createUserInput: CreateUserInput): Promise<User> {
    try {
      const hashedPassword = await argon2.hash(createUserInput.password);
      const user = await this.userRepository.create({
        ...createUserInput,
        password: hashedPassword,
      });

      return await this.userRepository.save(user);
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.preload({
      userId: id,
      ...updateUserInput,
    });
    return user;
  }

  async remove(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    await this.userRepository.delete(user);
    return {
      userId: id,
      userName: '',
      email: '',
      password: '',
    };
  }

  async getUserByName(userName: string): Promise<User> {
    return await this.userRepository.findOne({ where: { userName } });
  }
}
