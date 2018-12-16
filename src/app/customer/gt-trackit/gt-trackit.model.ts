export class GtTrackit {
    constructor(
        public trackId?: string,
        public customerNumber?: string,
        public requestDescription?: string,
        public requestDate?: string,
        public status?: string,
        public pickUpBranch?: string,
        public requestCancelReason?: string,
        public requestNumber?: string,
    ) {}
}

export class DropdownList {
    constructor(
        public name?: string,
        public code?: number,
    ) {}
}
