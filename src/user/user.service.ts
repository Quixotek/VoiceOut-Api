import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserInput } from './user.types';
import { hashPassword } from '../utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(input: CreateUserInput) {
    const { password } = input;

    const hashedPass = await hashPassword(password); //TODO research how to mock this kind of function

    const user = await this.userModel.create({
      ...input,
      password: hashedPass,
    });
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findUserById(id: string) {
    const user = await this.userModel.findOne({ id });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
