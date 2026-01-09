import { ConflictException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.exists({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword: string = await bcrypt.hash(
      createUserDto.password,
      10,
    );
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    const saved = await createdUser.save();

    const result = saved.toObject() as unknown as Omit<User, 'password'>;
    return result;
  }

  async findByEmail(email: string) {
    return (await this.userModel.findOne({ email }).exec()) || null;
  }
}
