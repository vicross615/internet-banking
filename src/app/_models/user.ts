export class User {

  constructor(
    public userId?: string,
    public email?: string,
    public userFullName?: string,
    public preferredName?: string,
    public customerType?: string,
    public termsConditions?: boolean,
    public customerSegment?: string,
    public transferIndemnityStatus?: boolean,
    public fxIndemnityStatus?: boolean,
    public smsIndemnityStatus?: boolean,
    public lastLogin?: string,
    public userBVN?: string,
    public userIp?: string
  ) { }

}
