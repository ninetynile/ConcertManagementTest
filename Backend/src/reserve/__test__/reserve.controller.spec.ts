import { Test, TestingModule } from '@nestjs/testing';
import { ReserveController } from '../reserve.controller';
import { ReserveService } from '../reserve.service';
import { ConcertService } from '../../concert/concert.service';
import { UserService } from '../../user/user.service';
import { HttpException } from '@nestjs/common';
import mongoose from 'mongoose';
import { CreateReserveDto } from '../dto/CreateReserve.dto';
import { CancelReserveDto } from '../dto/CancelReserve.dto';

describe('ReserveController', () => {
  let controller: ReserveController;
  let reserveService: ReserveService;
  let concertService: ConcertService;
  let userService: UserService;

  const mockReserveService = {
    createReserve: jest.fn(),
    cancelReserve: jest.fn(),
    getReserveTrn: jest.fn(),
    getReserveTrnByUserId: jest.fn(),
    getReserveByUserId: jest.fn(),
  };

  const mockConcertService = {
    GetConcetById: jest.fn(),
  };

  const mockUserService = {
    GetUserById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReserveController],
      providers: [
        { provide: ReserveService, useValue: mockReserveService },
        { provide: ConcertService, useValue: mockConcertService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    controller = module.get<ReserveController>(ReserveController);
    reserveService = module.get<ReserveService>(ReserveService);
    concertService = module.get<ConcertService>(ConcertService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a reserve when concert exists', async () => {
    const dto: CreateReserveDto = { userId: '1', concertId: '1' };
    const concert = { _id: '1', title: 'Concert1' };
    const result = { ...dto, _id: 'r1' };

    mockConcertService.GetConcetById.mockResolvedValue(concert);
    mockReserveService.createReserve.mockResolvedValue(result);

    expect(await controller.createReserve(dto)).toEqual(result);
    expect(mockReserveService.createReserve).toHaveBeenCalledWith(dto);
  });

  it('should throw HttpException if concert not found on create', async () => {
    const dto: CreateReserveDto = { userId: '1', concertId: '1' };
    mockConcertService.GetConcetById.mockResolvedValue(null);

    await expect(controller.createReserve(dto)).rejects.toThrow(HttpException);
  });

  it('should cancel a reserve when concert exists', async () => {
    const dto: CancelReserveDto = { userId: '1', concertId: '1' };
    const concert = { _id: '1', title: 'Concert1' };
    const result = { success: true };

    mockConcertService.GetConcetById.mockResolvedValue(concert);
    mockReserveService.cancelReserve.mockResolvedValue(result);

    expect(await controller.cancelReserve(dto)).toEqual(result);
  });

  it('should throw HttpException if concert not found on cancel', async () => {
    const dto: CancelReserveDto = { userId: '1', concertId: '1' };
    mockConcertService.GetConcetById.mockResolvedValue(null);

    await expect(controller.cancelReserve(dto)).rejects.toThrow(HttpException);
  });

  it('should return reserveTrn', () => {
    const result = [{ id: '1' }];
    mockReserveService.getReserveTrn.mockReturnValue(result);

    expect(controller.getReserveTrn()).toEqual(result);
  });

  it('should get reserveTrn by valid userId', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const user = { _id: userId, name: 'User1' };
    const result = [{ id: 'r1' }];

    mockUserService.GetUserById.mockResolvedValue(user);
    mockReserveService.getReserveTrnByUserId.mockResolvedValue(result);

    expect(await controller.getReserveTrnByUserId(userId)).toEqual(result);
  });

  it('should throw HttpException if invalid userId for getReserveTrnByUserId', async () => {
    await expect(controller.getReserveTrnByUserId('123')).rejects.toThrow(HttpException);
  });

  it('should throw HttpException if user not found for getReserveTrnByUserId', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    mockUserService.GetUserById.mockResolvedValue(null);

    await expect(controller.getReserveTrnByUserId(userId)).rejects.toThrow(HttpException);
  });

  it('should get reserve by valid userId', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const user = { _id: userId, name: 'User1' };
    const result = [{ id: 'r1' }];

    mockUserService.GetUserById.mockResolvedValue(user);
    mockReserveService.getReserveByUserId.mockResolvedValue(result);

    expect(await controller.getReserveByUserId(userId)).toEqual(result);
  });

  it('should throw HttpException if invalid userId for getReserveByUserId', async () => {
    await expect(controller.getReserveByUserId('123')).rejects.toThrow(HttpException);
  });

  it('should throw HttpException if user not found for getReserveByUserId', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    mockUserService.GetUserById.mockResolvedValue(null);

    await expect(controller.getReserveByUserId(userId)).rejects.toThrow(HttpException);
  });
});
