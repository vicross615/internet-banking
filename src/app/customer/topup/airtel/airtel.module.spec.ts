import { AirtelModule } from './airtel.module';

describe('AirtelModule', () => {
  let airtelModule: AirtelModule;

  beforeEach(() => {
    airtelModule = new AirtelModule();
  });

  it('should create an instance', () => {
    expect(airtelModule).toBeTruthy();
  });
});
