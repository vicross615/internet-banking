import { MaximumAdvanceRoutingModule } from './maximum-advance-routing.module';

describe('MaximumAdvanceRoutingModule', () => {
  let maximumAdvanceRoutingModule: MaximumAdvanceRoutingModule;

  beforeEach(() => {
    maximumAdvanceRoutingModule = new MaximumAdvanceRoutingModule();
  });

  it('should create an instance', () => {
    expect(maximumAdvanceRoutingModule).toBeTruthy();
  });
});
