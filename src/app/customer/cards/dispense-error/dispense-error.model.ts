export class transDetails {
    constructor (
        public transactionDate: any,
        public remarks: string,
        public amount: any,
        public doc_Num: any, 
        ) {}
}


export class BankName {
    name: string;
    code: number;

    constructor(obj?: any) {
        this.name   = obj && obj.name  || null;
        this.code   = obj && obj.code  || null;
    }
}