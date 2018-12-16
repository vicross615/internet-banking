import { MaximumAdvanceModule } from './maximum-advance.module';

describe('MaximumAdvanceModule', () => {
  let maximumAdvanceModule: MaximumAdvanceModule;

  beforeEach(() => {
    maximumAdvanceModule = new MaximumAdvanceModule();
  });

  it('should create an instance', () => {
    expect(maximumAdvanceModule).toBeTruthy();
  });
});
