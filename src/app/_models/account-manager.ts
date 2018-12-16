export class AcctManager {
  constructor(
    public id?: string,
    public branchCode?: string,
    public teamNo?: string,
    public fullName?: string,
    public userName?: string,
    public branchName?: string
  ) {}
}

export class StaffDetails {
  constructor(
    public userID: string,
    public userName: string,
    public firstName: string,
    public lastName: string,
    public middleName: string,
    public fullName: string,
    public email: string,
    public phoneNumber: string,
    public employeeID: string,
    public married: boolean,
    public jobRole: string,
    public dateOfBirth: string,
    public hireDate: string,
    public dateOfBirth_NoYear: string,
    public jobTitle: string,
    public department: string,
    public group: string,
    public division: string,
    public sex: string,
    public branchLocation: string,
    public grade: string,
    public yearsOfBankingExperience: number,
  ) {}
}

export class StaffPicture {
  constructor(
    public photoType: string,
    public userId: string,
    public height: string,
    public lastModified: string,
    public photoId: string,
    public width: string,
    public photoName: string,
    public lastModifiedDateTime: string,
    public photo: string,
    public mimeType: string,
    public lastModifiedWithTZ: string
  ) {}
}

export class AcctMngrResponse {
  constructor (
    public accountManager: AcctManager,
    public staffDetails: StaffDetails,
    public staffPicture: StaffPicture,
    public requestId: string,
    public responseCode: string,
    public responseDescription: string,
    public userId: string
  ) {}
}

export class DefaultResponse {
  constructor (
    public name: string,
    public email: string,
    public phoneNumber: string
  ) {}
}


export class RatingResponse {
  constructor (

    public requestId: string,
    public responseCode: string,
    public responseDescription: string,

  ) {}
}

export class AcctMgrs {
  constructor (
    public id: number,
    public branchCode: number,
    public teamNo: number,
    public fullName: string,
    public userName: string,
    public branchName: string,
    public photo: string,
    public mimeType: string,
    public email: string,
    public phoneNumber: string,
    public yearsOfBankingExperience: number,
    public department: string,
  ) {}
}


export class AcctManagersList {
  constructor (
    public accountMgrs: AcctMgrs[],
    public requestId: string,
    public responseCode: string,
    public responseDescription: string,
  ) {}
}
