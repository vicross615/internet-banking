import { MtnModule } from './mtn.module';

describe('MtnModule', () => {
  let mtnModule: MtnModule;

  beforeEach(() => {
    mtnModule = new MtnModule();
  });

  it('should create an instance', () => {
    expect(mtnModule).toBeTruthy();
  });
});
