export class AcctDetails {
    constructor (
        public bvn: string,
        public email: string,
        public cusname: string,
        public mob_num: string,
        public fullaccountkey: string,
        public map_acc_no: string,
        public avail_bal: string,
        public alt_cur_code: string,
        public des_eng: string,
        public date_open: string,
        public las_tra_date: string,
        public cle_bal: string,
        public crnt_bal: string,
        public sta_code: string,
        public led_code: string,
        public sub_acct_code: string,
        public cust_seg: string,
        public cust_type: string,
        public residential_address: string,
        public birthday: string,
        public gender: string,
        public customer_type: string,
        public customer_type_text: string,
        public type_of_depositor: string,
        public type_of_depositortext: string,
        public customer_class: string,
        public cus_class: string,
        public rest_reason: string,
        ) {}
}
export class AcctToDebit {
    fullAcctKey: string;
    nuban: string;
    accountName: string;
    accountBalance: string;

    constructor(obj?: any) {
        this.fullAcctKey   = obj && obj.regNum  || null;
        this.nuban   = obj && obj.nuban  || null;
        this.accountName   = obj && obj.accountName  || null;
        this.accountBalance   = obj && obj.accountName  || null;
    }
}

export class AcctToDebitResponse {
    acct: AcctToDebit[];
    requestId: string;
    responseCode: string;
    responseDescription: string;
    userId: string;

    constructor(obj?: any) {
        // this.acct      = AcctToDebit[0]  || null;
        this.requestId              = obj && obj.requestId   || null;
        this.responseCode           = obj && obj.responseCode  || null;
        this.responseDescription    = obj && obj.responseDescription  || null;
        this.userId                 = obj && obj.userId  || null;
    }
}

export class Beneficiary {
    accountName: string;
    nuban: string;
    oldAccountNo: string;
    requestId: string;
    responseCode: string;
    responseDescription: string;

    constructor(obj?: any) {
        this.accountName   = obj && obj.accountName  || null;
        this.nuban   = obj && obj.nuban  || null;
        this.oldAccountNo   = obj && obj.oldAccountNo  || null;
        this.requestId   = obj && obj.requestId  || null;
        this.responseCode   = obj && obj.responseCode  || null;
        this.responseDescription   = obj && obj.responseDescription  || null;
    }
}

export class Beneficiaries {
    name: string;
    accountNumber: string;
    bankCode: string;
    bank: string;
    transactionType: string;
    imageString: string;
    image: string;

    constructor(obj?: any) {
        this.name   = obj && obj.accountName  || null;
        this.accountNumber  = obj && obj.accountNumber || null;
        this.bankCode   = obj && obj.bankCode  || null;
        this.bank  = obj && obj.bank  || null;
        this.transactionType  = obj && obj.transactionType  || null;
        this.imageString  = obj && obj.imageString  || null;
        this.image  = obj && obj.image  || null;
    }
}

export class BeneficiariesResponse {
    beneficiaries: Beneficiaries[];
    requestId: string;
    responseCode: string;
    responseDescription: string;
    userId: string;

    constructor(obj?: any) {
        // this.acct      = AcctToDebit[0]  || null;
        this.requestId              = obj && obj.requestId   || null;
        this.responseCode           = obj && obj.responseCode  || null;
        this.responseDescription    = obj && obj.responseDescription  || null;
        this.userId                 = obj && obj.userId  || null;
    }
}

export class PreRegBeneficiaries {
    name: string;
    accountNumber: string;
    bankCode: string;
    bank: string;
    // transactionType?: string;

    constructor(obj?: any) {
        this.name   = obj && obj.accountName  || null;
        this.accountNumber  = obj && obj.accountNumber || null;
        this.bankCode   = obj && obj.bankCode  || null;
        this.bank  = obj && obj.bank  || null;
        // this.transactionType  = obj && obj.transactionType  || null;
    }
}

export class PreRegBeneficiariesResponse {
    beneficiaries: PreRegBeneficiaries[];
    requestId: string;
    responseCode: string;
    responseDescription: string;
    userId: string;

    constructor(obj?: any) {
        // this.acct      = AcctToDebit[0]  || null;
        this.requestId              = obj && obj.requestId   || null;
        this.responseCode           = obj && obj.responseCode  || null;
        this.responseDescription    = obj && obj.responseDescription  || null;
        this.userId                 = obj && obj.userId  || null;
    }
}

export class FreqBeneficiaries {
    customerName: string;
    beneficiaryAcc: string;
    transferType: string;
    count: string;
    amount: string;
    bankName: string;
    bankCode: string;
    // transactionType?: string;

    constructor(obj?: any) {
        this.customerName   = obj && obj.customerName  || null;
        this.beneficiaryAcc  = obj && obj.beneficiaryAcc || null;
        this.transferType  = obj && obj.transferType  || null;
        this.count  = obj && obj.count  || null;
        this.amount  = obj && obj.amount  || null;
        this.bankName   = obj && obj.bankName  || null;
        this.bankCode   = obj && obj.bankCode  || null;
    }
}

export class FreqBeneficiariesResponse {
    mostFreq: FreqBeneficiaries[];
    requestId: string;
    responseCode: string;
    responseDescription: string;
    userId: string;

    constructor(obj?: any) {
        // this.acct      = AcctToDebit[0]  || null;
        this.requestId              = obj && obj.requestId   || null;
        this.responseCode           = obj && obj.responseCode  || null;
        this.responseDescription    = obj && obj.responseDescription  || null;
        this.userId                 = obj && obj.userId  || null;
    }
}

export class Banks {
    name: string;
    code: string;
    active: number;
    finInstCat: string;
    bankShortName: String;
    catCode: number;
    sortCode: string;
    fileExtension: string;
    bankLogofileBase64: string;

    constructor(obj?: any) {
        this.name   = obj && obj.name  || null;
        this.code   = obj && obj.code  || null;
        this.active   = obj && obj.active  || null;
        this.finInstCat  = obj && obj.finInstCat || null;
        this.bankShortName  = obj && obj.bankShortName || null;
        this.catCode  = obj && obj.catCode  || null;
        this.sortCode  = obj && obj.sortCode  || null;
        this.fileExtension  = obj && obj.fileExtension  || null;
        this.bankLogofileBase64  = obj && obj.bankLogofileBase64  || null;
    }
}

// Sola added this - 25/07/2018
export class AcctToDebitFX {
    fullAcctKey: string;
    nuban: string;
    accountName: string;
    accountBalance: string;

    constructor(obj?: any) {
        this.fullAcctKey   = obj && obj.fullAcctKey  || null;
        this.nuban   = obj && obj.nuban  || null;
        this.accountName   = obj && obj.accountName  || null;
        this.accountBalance   = obj && obj.accountBalance  || null;
    }
}

// Sola added this - 25/07/2018
export class FundsSource {
    code: Number;
    name: string;

    constructor(obj?: any) {
        this.code   = obj && obj.code  || null;
        this.name   = obj && obj.name  || null;
    }
}

export class BizNature {
    code: Number;
    name: string;

    constructor(obj?: any) {
        this.code   = obj && obj.code  || null;
        this.name   = obj && obj.name  || null;
    }
}

export class RelFxTrans {
    code: Number;
    name: string;

    constructor(obj?: any) {
        this.code   = obj && obj.code  || null;
        this.name   = obj && obj.name  || null;
    }
}

export class FxDropdownResponse {
    fundsSource: FundsSource[];
    bizNature: BizNature[];
    relFxTrans: RelFxTrans[];
    requestId: string;
    responseCode: string;
    responseDescription: string;
    userId: string;

    constructor(obj?: any) {
        // this.acct      = AcctToDebit[0]  || null;
        this.requestId              = obj && obj.requestId   || null;
        this.responseCode           = obj && obj.responseCode  || null;
        this.responseDescription    = obj && obj.responseDescription  || null;
        this.userId                 = obj && obj.userId  || null;
    }
}

export class Country {
    code: Number;
    name: string;

    constructor(obj?: any) {
        this.code   = obj && obj.code  || null;
        this.name   = obj && obj.name  || null;
    }
}

export class Purpose {
    code: Number;
    name: string;

    constructor(obj?: any) {
        this.code   = obj && obj.code  || null;
        this.name   = obj && obj.name  || null;
    }
}

export class Frequency {
    name: string;
    code: string;

    constructor(obj?: any) {
        this.name   = obj && obj.name  || null;
        this.code   = obj && obj.code  || null;
    }
}

export class Notifications {
    notificationType: number;
    description: string;
    message: string;
    notificationDate: number;
    customerSegment: string;
    nextAction: String;
    gif_url: String;

    constructor(obj?: any) {
        this.notificationType   = obj && obj.notificationType   || null;
        this.description   = obj && obj.description  || null;
        this.message   = obj && obj.message  || null;
        this.notificationDate   = obj && obj.notificationDate  || null;
        this.customerSegment  = obj && obj.customerSegment || null;
        this.nextAction  = obj && obj.nextAction || null;
        this.gif_url  = obj && obj.gif_url || null;
    }
}

export class FxBeneficiaries {
    benName: string;
    benBankAcctIBAN: string;
    sNo: string;
    constructor(obj?: any) {
        this.benName   = obj && obj.benName  || null;
        this.benBankAcctIBAN  = obj && obj.benBankAcctIBAN || null;
        this.sNo   = obj && obj.sNo  || null;
    }
}

export class FxBeneficiariesResponse {
    fxbeneficiaries: FxBeneficiaries[];
    requestId: string;
    responseCode: string;
    responseDescription: string;
    userId: string;

    constructor(obj?: any) {
        // this.acct      = AcctToDebit[0]  || null;
        this.requestId              = obj && obj.requestId   || null;
        this.responseCode           = obj && obj.responseCode  || null;
        this.responseDescription    = obj && obj.responseDescription  || null;
        this.userId                 = obj && obj.userId  || null;
    }
}

export class FxBeneficiaryDetails {
    benName: string;
    benAddress: string;
    beneCountryCode: string;
    customerEmail: string;
    benBICSwiftCode: string;
    sortCode: string;
    benBankAcctIBAN: string;
    benBankName: string;
    benBankAddress: string;
    intBankName: string;
    intBankAddress: string;
    intBenBICSwiftCode: string;
    intSortcode: string;
    intBankAcctNo: string;
    canadaTransitNo: string;
    canadaInstName: string;
    benNatureBusiness: string;
    benInstitution: string;
    relationship: string;

        constructor(obj?: any) {
        this.benName   = obj && obj.benName  || null;
        this.benAddress  = obj && obj.benAddress || null;
        this.beneCountryCode   = obj && obj.beneCountryCode  || null;
        this.customerEmail   = obj && obj.customerEmail  || null;
        this.benBICSwiftCode  = obj && obj.benBICSwiftCode || null;
        this.sortCode   = obj && obj.sortCode  || null;
        this.benBankAcctIBAN   = obj && obj.benBankAcctIBAN  || null;
        this.benBankName  = obj && obj.benBankName || null;
        this.benBankAddress   = obj && obj.benBankAddress  || null;
        this.intBankName   = obj && obj.intBankName  || null;
        this.intBankAddress  = obj && obj.intBankAddress || null;
        this.intBenBICSwiftCode   = obj && obj.intBenBICSwiftCode  || null;
        this.intSortcode   = obj && obj.intSortcode  || null;
        this.intBankAcctNo   = obj && obj.intBankAcctNo  || null;
        this.canadaTransitNo  = obj && obj.canadaTransitNo || null;
        this.canadaInstName   = obj && obj.canadaInstName  || null;
        this.benNatureBusiness   = obj && obj.benNatureBusiness  || null;
        this.benInstitution  = obj && obj.benInstitution || null;
        this.relationship   = obj && obj.relationship  || null;
    }
}
