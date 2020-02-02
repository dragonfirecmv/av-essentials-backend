import { Test, TestingModule } from '@nestjs/testing';
import { FileBucketsService } from './file-buckets.service';

describe('FileBucketsService', () => {
  let service: FileBucketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileBucketsService],
    }).compile();

    service = module.get<FileBucketsService>(FileBucketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
