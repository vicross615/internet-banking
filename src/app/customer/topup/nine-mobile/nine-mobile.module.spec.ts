import { NineMobileModule } from './nine-mobile.module';

describe('NineMobileModule', () => {
  let NinemobileModule: NineMobileModule;

  beforeEach(() => {
    NinemobileModule = new NineMobileModule();
  });

  it('should create an instance', () => {
    expect(NinemobileModule).toBeTruthy();
  });
});
