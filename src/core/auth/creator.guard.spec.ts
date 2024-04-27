import { Reflector } from '@nestjs/core';
import { RepoFindId } from '../../tasks/tasks.module';
import { CreatorGuard } from './creator.guard';

const mockRepoService: RepoFindId = {
  findById: jest.fn().mockResolvedValue({
    creator: { id: 'user_1234' },
  }),
};

const reflector: Reflector = {
  get: jest.fn().mockReturnValue('creator'),
} as unknown as Reflector;

describe('CreatorGuard', () => {
  const creatorGuard = new CreatorGuard(mockRepoService, reflector);

  it('should be defined', () => {
    expect(creatorGuard).toBeDefined();
  });

  describe('When we call canActivate method without previous login (NOT request payload)', () => {
    it('should throw an error', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            params: { id: 'item_1234' },
          }),
        }),
        getHandler: () => 'handler',
      };
      await expect(creatorGuard.canActivate(context as any)).rejects.toThrow(
        'CreatorGuard No Payload',
      );
    });
  });

  describe('When we call canActivate method', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          payload: { id: 'user_1234' },
          params: { id: 'item_1234' },
        }),
      }),
      getHandler: () => 'handler',
    };

    it('should return true if the user is the creator of the task', async () => {
      const result = await creatorGuard.canActivate(context as any);
      expect(result).toBe(true);
    });

    it('should return false if the user is not the creator of the task', async () => {
      (mockRepoService.findById as jest.Mock).mockResolvedValueOnce({
        creator: { id: 'anotherUserId' },
      });
      const result = await creatorGuard.canActivate(context as any);
      expect(result).toBe(false);
    });
  });
});
