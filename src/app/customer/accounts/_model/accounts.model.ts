export class AccountUpgrade {
    bvn: string;
    accountName: string;
    nuban: string;
    meansOfID: number;
    regulatoryID: string;
    phoneNumber: string;
    address: string;
    emailAddress: string;
    gender: number;
    dateOfBirth: string;
    maritalStatus: number;
    nationality: string;
    stateOfOrigin: string;
    stateOfResidence: string;
    lga: string;
    upgradeTier: string;
    employmentStatus: number;
    occupation: string;
    employerName: string;
    employerAddress: string;
    dateOfEmployment: string;
    regulatoryIDDOCFileName: string;
    regulatoryIDDOCSBAse64StringFile: string;
    regulatoryIDDOCFileType: string;
    utilityBillFileName: string;
    utilityBillBase64StringFile: string;
    utilityBillFileType: string;
    secretQuestion: string;
    requestId: string;
    channel: string;
    userId: string;
    customerNumber: string;
    sessionId: string;
  }

export class AccountStatement {
    constructor (
        public postingTellerId: string,
        public transDate: string,
        public transSeq1: string,
        public origtTransSeq1: string,
        public reference: string,
        public narration: string,
        public valueDate: string,
        public amountDebit: string,
        public amountCredit: string,
        public channel: string,
        public explCode: string,
        public origtBraCode: string) {}
}

export class AccountStatementReqBody {
    public accountNumber?: string;
    public historyType?: string;
    public startDate?: string;
    public stopDate?: string;
    public count?: string;
    public amount?: string;
    public remarks?: string;

    constructor(obj?: any) {
        this.accountNumber  = obj && obj.regNum  || null;
        this.historyType   = obj && obj.historyType  || null;
        this.startDate   = obj && obj.startDate  || null;
        this.stopDate   = obj && obj.stopDate  || null;
        this.count   = obj && obj.count || null;
        this.amount   = obj && obj.amount || null;
        this.remarks   = obj && obj.remarks || null;
    }

}
