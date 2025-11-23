import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/CreateUser.dto';
import { HttpException } from '@nestjs/common';
import mongoose from 'mongoose';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    CreateUser: jest.fn(),
    GetUsers: jest.fn(),
    GetUserByEmail: jest.fn(),
    GetUserByEmailWithReserves: jest.fn(),
    GetUserById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = { name: 'User1', email: 'user1@mail.com' };
    const result = { ...dto, _id: '1' };
    mockUserService.CreateUser.mockResolvedValue(result);

    expect(await controller.CreateUser(dto)).toEqual(result);
    expect(mockUserService.CreateUser).toHaveBeenCalledWith(dto);
  });

  it('should get all users', async () => {
    const result = [{ _id: '1', name: 'User1' }];
    mockUserService.GetUsers.mockResolvedValue(result);

    expect(await controller.GetUsers()).toEqual(result);
  });

  it('should get user by email if exists', async () => {
    const email = 'user1@mail.com';
    const user = { _id: '1', email };
    mockUserService.GetUserByEmail.mockResolvedValue(user);

    expect(await controller.GetUserByEmail(email)).toEqual(user);
  });

  it('should throw HttpException if user by email not found', async () => {
    const email = 'notfound@mail.com';
    mockUserService.GetUserByEmail.mockResolvedValue(null);

    await expect(controller.GetUserByEmail(email)).rejects.toThrow(HttpException);
  });

  it('should get user by email with reserves if exists', async () => {
    const email = 'user1@mail.com';
    const user = { _id: '1', email, reserves: [] };
    mockUserService.GetUserByEmailWithReserves.mockResolvedValue(user);

    expect(await controller.GetUserByEmailWithReserves(email)).toEqual(user);
  });

  it('should throw HttpException if user by email with reserves not found', async () => {
    const email = 'notfound@mail.com';
    mockUserService.GetUserByEmailWithReserves.mockResolvedValue(null);

    await expect(controller.GetUserByEmailWithReserves(email)).rejects.toThrow(HttpException);
  });

  it('should get user by valid id', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const user = { _id: id, name: 'User1' };
    mockUserService.GetUserById.mockResolvedValue(user);

    expect(await controller.GetUserById(id)).toEqual(user);
  });

  it('should throw HttpException for invalid id', async () => {
    await expect(controller.GetUserById('123')).rejects.toThrow(HttpException);
  });

  it('should throw HttpException if user by id not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    mockUserService.GetUserById.mockResolvedValue(null);

    await expect(controller.GetUserById(id)).rejects.toThrow(HttpException);
  });
});
