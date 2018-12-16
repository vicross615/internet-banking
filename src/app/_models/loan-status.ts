export class LoanStatusResponse {
  constructor(
    public loanStatusList?: LoanStatusList[],
    public requestId?: string,
    public responseCode?: string,
    public responseDescription?: string,
    public userId?: string,

    
  ) { }

}

  export class LoanStatusList {
    constructor (
      public accountNumber: string,
      public status?: boolean,
      public advanceType?: string,
      public tenor?: any,
      public requestedAmount?: string,
      public dateReqeusted?: string,
      public statusMessage?: string
        ) {}
}