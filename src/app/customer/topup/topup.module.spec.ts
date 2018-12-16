import { TopupModule } from './topup.module';

describe('TopupModule', () => {
  let topupModule: TopupModule;

  beforeEach(() => {
    topupModule = new TopupModule();
  });

  it('should create an instance', () => {
    expect(topupModule).toBeTruthy();
  });
});
