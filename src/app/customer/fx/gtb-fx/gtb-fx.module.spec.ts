import { GtbFxModule } from './gtb-fx.module';

describe('GtbFxModule', () => {
  let gtbFxModule: GtbFxModule;

  beforeEach(() => {
    gtbFxModule = new GtbFxModule();
  });

  it('should create an instance', () => {
    expect(gtbFxModule).toBeTruthy();
  });
});
