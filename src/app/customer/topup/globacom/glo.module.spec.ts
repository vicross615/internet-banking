import { GloModule } from './glo.module';

describe('GloModule', () => {
  let gloModule: GloModule;

  beforeEach(() => {
    gloModule = new GloModule();
  });

  it('should create an instance', () => {
    expect(gloModule).toBeTruthy();
  });
});
