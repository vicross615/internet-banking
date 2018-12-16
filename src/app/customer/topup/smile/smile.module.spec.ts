import { SmileModule } from './smile.module';

describe('MSmileModule', () => {
  let mSmileModule: SmileModule;

  beforeEach(() => {
    mSmileModule = new SmileModule();
  });

  it('should create an instance', () => {
    expect(mSmileModule).toBeTruthy();
  });
});
