export class Cards {
    constructor(
        public expirydate?: string,
        public statusid?: string,
        public cardstatus?: string,
        public pickupbranch?: string,
        public pan?: string,
        public panLast4Digit?: string,
        public editedPan?: string,
        public collecteD_DATE?: string,
        public cardtype?: string,
        public cardtypecode?: string,
        public date_Ready_For_Pickup?: string,
        public date_Dispatch?: string,
        public processDate?: string,
        public fepstatus?: string,
        public cardHolderName?: string,
        public sequence_no?: string,
        public cardid?: string,
        public fepString?: string
    ) {}
}

export class VirtualCard {
    constructor(
        public pan?: string,
        public editedPan?: string,
        public expiry?: string,
        public cvv?: string,
        public pin?: string,
        public balance?: string,
        public cardAccount?: string,
    ) {}
}

export class BlockedFunds {
    constructor(
        public TRANSID?: string,
        public REMARKS?: string,
        public TRANSACTION_AMOUNT_IN_NAIRA?: string,
        public TRANSACTION_AMOUNT_IN_LOCAL_CURRENCY?: string,
        public TRANSACTION_DATE?: string,
        public ENDDATE?: string,
        public auth_id_rsp?: string,
        public TRANSACTIONCURRENCY?: string,
    ) {}
}
export class CardStatement {
    constructor(
        public transDate?: string,
        public transDescription?: string,
        public transAmount?: string,
        public transCurrency?: string,
        public transAmountInCardCurrency?: string,
        public merchantCode?: string,
        public transType?: string,
        public merchantLocation?: string,
        public referenceNumber?: string,
        public transStatus?: string
    ) {}
}

export class CardStatementRequest {
    constructor(
        public cardAccountNumber?: string,
        public maskedPAN?: string,
        public historyType?: string,
        public status?: number,
        public startDate?: string,
        public stopDate?: string,
        public count?: string,
        public remarks?: string,
        public amount?: string,
    ) {}
}

