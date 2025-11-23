import { Test, TestingModule } from '@nestjs/testing';
import { ConcertController } from '../concert.controller';
import { ConcertService } from '../concert.service';
import { HttpException } from '@nestjs/common';
import mongoose from 'mongoose';
import { CreateConcertDto } from '../dto/CreateConcert.dto';
import { UpdateConcertDto } from '../dto/UpdateConcert.dto';

describe('ConcertController', () => {
  let controller: ConcertController;
  let service: ConcertService;

  const mockConcertService = {
    CreateConcert: jest.fn(),
    GetConcerts: jest.fn(),
    GetConcertsWithReserves: jest.fn(),
    GetConcertsWithReserveCount: jest.fn(),
    GetConcetById: jest.fn(),
    UpdateConcert: jest.fn(),
    DeleteConcert: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertController],
      providers: [
        {
          provide: ConcertService,
          useValue: mockConcertService,
        },
      ],
    }).compile();

    controller = module.get<ConcertController>(ConcertController);
    service = module.get<ConcertService>(ConcertService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a concert', async () => {
    const dto: CreateConcertDto = { title: 'Test', description: 'Desc', ticket: 100 };
    const result = { ...dto, _id: '1' };
    mockConcertService.CreateConcert.mockResolvedValue(result);

    expect(await controller.CreateConcert(dto)).toEqual(result);
    expect(mockConcertService.CreateConcert).toHaveBeenCalledWith(dto);
  });

  it('should get all concerts', async () => {
    const result = [{ title: 'Concert1' }];
    mockConcertService.GetConcerts.mockResolvedValue(result);

    expect(await controller.GetConcerts()).toEqual(result);
  });

  it('should get concerts with reserves', async () => {
    const result = [{ title: 'Concert1', reserveData: [] }];
    mockConcertService.GetConcertsWithReserves.mockResolvedValue(result);

    expect(await controller.GetConcertsWithReserves()).toEqual(result);
  });

  it('should get concerts with reserve count', async () => {
    const result = [{ title: 'Concert1', reserveCount: 5 }];
    mockConcertService.GetConcertsWithReserveCount.mockResolvedValue(result);

    expect(await controller.GetConcertsWithReserveCount()).toEqual(result);
  });

  it('should get concert by valid id', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const result = { _id: id, title: 'Concert1' };
    mockConcertService.GetConcetById.mockResolvedValue(result);

    expect(await controller.GetConcertById(id)).toEqual(result);
  });

  it('should throw HttpException for invalid id in GetConcertById', async () => {
    const invalidId = '123';
    await expect(controller.GetConcertById(invalidId)).rejects.toThrow(HttpException);
  });

  it('should update a concert with valid id', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const dto: UpdateConcertDto = { title: 'Updated' };
    const result = { _id: id, ...dto };
    mockConcertService.UpdateConcert.mockResolvedValue(result);

    expect(await controller.UpdateConcert(id, dto)).toEqual(result);
  });

  it('should throw HttpException for invalid id in UpdateConcert', async () => {
    const invalidId = '123';
    const dto: UpdateConcertDto = { title: 'Updated' };
    await expect(controller.UpdateConcert(invalidId, dto)).rejects.toThrow(HttpException);
  });

  it('should delete a concert with valid id', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const result = { _id: id, title: 'Concert1' };
    mockConcertService.DeleteConcert.mockResolvedValue(result);

    expect(await controller.DeleteConcert(id)).toEqual(result);
  });

  it('should throw HttpException for invalid id in DeleteConcert', async () => {
    const invalidId = '123';
    await expect(controller.DeleteConcert(invalidId)).rejects.toThrow(HttpException);
  });
});
