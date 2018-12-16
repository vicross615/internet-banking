import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { UtilitiesService } from '../../../_services/utilities.service';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FreqBeneficiaries } from '../../_customer-model/customer.model';
import { User } from '../../../_models/user';

@Injectable({providedIn: 'root'})
export class StandingOrderService {
  user: User = JSON.parse(localStorage.getItem('userDetails'));

  private REQ_URL = environment.BASE_URL + environment.REQ_SERV;

  private freqBeneficiaries = new BehaviorSubject<FreqBeneficiaries[]>(null);
  freqBeneficiariesCast = this.freqBeneficiaries.asObservable();
  public selectedfreqBeneficiary = new BehaviorSubject<FreqBeneficiaries>(null);
  selectedfreqBeneficiaryCast = this.selectedfreqBeneficiary.asObservable();

  constructor(
    private http: HttpClient,
    private util: UtilitiesService,
    private router: Router
  ) { }

  StandingInstructionGTB(body) {
    const PATH = this.REQ_URL + `/StandingInstructionGTB`;
    // Add customer related properties to the body object
    body = this.util.addAuthParams(body);
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body)
    .pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  StandingInstructionOtherBank(body) {
    const PATH = this.REQ_URL + `/StandingInstructionOtherBank`;
    body = this.util.addAuthParams(body);
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body)
    .pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

}
