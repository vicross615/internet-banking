export class AccountDetailsResponse {
    constructor(
        public accountDetails: AccountDetails[],
        public name: string,
        public residentialAddress: string,
        public bvn: string,
        public email: string,
        public phone: string,
        public customerNumber: string,
        public customerSegment: string,
        public customerType: string,
        public birthday: string,
        public gender: string,
        public requestId: string,
        public responseCode: string,
        public responseDescription: string,
        public userId: string
    ) { }
}

export class AccountDetails {
    constructor(
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
        public type_of_depositortext: string,
        public sta_cotype_of_depositor: string,
        public customer_class: string,
        public cus_class: string,
        public rest_reason: string,
    ) { }
}

