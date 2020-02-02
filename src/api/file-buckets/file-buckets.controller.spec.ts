import { Test, TestingModule } from '@nestjs/testing';
import { FileBucketsController } from './file-buckets.controller';

describe('FileBuckets Controller', () => {
  let controller: FileBucketsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileBucketsController],
    }).compile();

    controller = module.get<FileBucketsController>(FileBucketsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
