import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsRoutingModule } from './cards-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CardsComponent } from './cards.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CardProtectModule } from './card-protect/card-protect.module';
import { CardHotlistingModule } from './card-hotlisting/card-hotlisting.module';

@NgModule({
  imports: [
    CommonModule,
    CardsRoutingModule,
    SharedModule,
    NgbModule,
    CardProtectModule,
    CardHotlistingModule
  ],
  declarations: [
    CardsComponent
  ],
  bootstrap: [CardsComponent]
})
export class CardsModule { }
