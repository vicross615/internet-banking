
export class Collections {
    constructor(
        public customerName?: string,
        public formId?: string,
        public customerId?: string,
        public formTitle?: string,
        public formDesc?: string,
        public requestId?: string,
        public responseCode?: string,
        public responseDescription?: string,
        public userId?: string
      ) {}
}
export class Category {
    constructor(
        public orderId?: string,
        public categoryId?: string,
        public categoryName?: string,
        public categoryIconName?: string
      ) {}
}

export class Biller {
    constructor(
        public customerId?: string,
        public customerName?: string,
        public customerAccountNumber?: string,
        public customerShowName?: string,
        public customerLogo?: string,
        public imageType?: string,
        public image?: string,
      ) {}
}

export class Product {
    constructor(
        public formId?: string,
        public customerId?: string,
        public customerName?: string,
        public formTitle?: string,
        public formDescription?: string,
        public accountToCredit?: string,
      ) {}
}

export class FormFields {
    constructor(
        public field_id?: number,
        public form_id?: number,
        public field_name?: string,
        public field_caption?: string,
        public field_type?: number,
        public field_datatype?: number,
        public field_length?: number,
        public field_lov?: number,
        public field_date_format?: string,
        public field_mandatory?: string,
        public field_in_remarks?: string,
        public field_sequence?: number,
        public default_value?: string,
        public actual_value?: null,
        public read_only?: number,
        public show_on_receipt?: number,
        public amt_ref?: number,
        public data_retrieve?: number,
        public dataSource?: number,
        public field_visible?: number,
        public show_online?: number,
        public show_at_branch?: number,
        public show_on_Web?: number,
        public tooltip?: string,
        public show_on_ussd?: number,
        public show_on_atm?: number,
        public depend_lov?: number,
        public field_type_string?: string,
        public dropdown_Details?: DropDownDetails[]
      ) {}
}

export class DropDownDetails {
    constructor(
        public detailId?: string,
        public dropDownValue?: string,
        public dropDownText?: string,
        public dropDownData?: string,
      ) {}
}

export class CategoryIcons {
    constructor (
    public SchoolsProfessionalBodies: string,
    public VISAFeePayment: string,
    public DistributorPayments: string,
    public Others: string,
    public InsuranceHealthPlan: string,
    public AirtimeData: string,
    public ReligiousDonations: string,
    public ShippingLinePayment: string,
    public CapitalMarketInvestments: string,
    public ElectricityWater: string,
    public GovernmentTaxesandLevies: string,
    public TravelsTransportation: string,
    public EventsandTicketing: string,
    public FinancialInstitutions: string,
    public SportsandGaming: string,
    public CableTV: string,
    public TollFeesLCC: string,
    public Remita: string,
    public HotelsEstatesAssociations: string
) {}
}

export class ValidationDetails {
    constructor(
        public formCharges?: FormCharges[],
        public formChargeSplit?: FormChargesSplit[],
        public formFieldsDetails?: FormFields[],
        public customLovContent?: string,
        public accountToCredit?: string,
        public validationRef?: string,
        public validationResponse?: string,
      ) {}
}

export class FormCharges {
    constructor(
        public charge_desc?: string,
        public charge_amt?: number,
        public account_number?: string,
        public show_on_receipt?: number,
        public merchant_bear_web_charge?: number,
        public id?: number,
        public commission_ref?: number,
        public split_charge?: number,
        public charge_Concession?: number,
        public charge_type?: number,
      ) {}
}
export class FormChargesSplit {
    constructor(
        public id?: number,
        public charge_id?: number,
        public charge_desc?: string,
        public charge_amt?: number,
        public account_number?: string,
        public created_by?: string,
        public date_created?: string,
        public last_updated_by?: string,
        public date_last_updated?: string,
        public charge_splittype?: number,
      ) {}
}
