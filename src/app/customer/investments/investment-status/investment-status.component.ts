import { Component, OnInit, OnDestroy } from '@angular/core';
import { InvestmentStatusService } from './investment-status.service';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'gtibank-investment-status',
  templateUrl: './investment-status.component.html',
  styleUrls: ['./investment-status.component.scss']
})
export class InvestmentStatusComponent implements OnInit, OnDestroy {
  investments: Investments[];
  errorMessage: string;

  constructor(
    private service: InvestmentStatusService,
    private router: Router
  ) {
    this.service.getInvestmentsData();
    this.service.investments$.subscribe(inv => this.investments = inv);
    this.service.investmentsError$.subscribe(err => this.errorMessage = err);
   }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.service.updateInvestments(null);
    this.service.updateInvestmentsError(null);
  }

  investNow() {
    this.router.navigate(['investments']);
  }

}


export class Investments {
  constructor(
      public fullAccountNum?: string,
      public amount?: string,
      public tenor?: string,
      public start_Date?: string,
      public investmentType?: string,
      public maturity_Date?: string,
      public interestAtMaturity?: string,
      public currency?: string,
      public ref_Number?: string,
    ) {}
}
