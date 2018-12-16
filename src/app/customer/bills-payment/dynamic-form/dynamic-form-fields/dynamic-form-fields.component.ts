import { Component, OnInit, Input } from '@angular/core';
import { FormFields } from '../../_model/bills-payment.model';
import { FormGroup } from '@angular/forms';
import { UtilitiesService } from '../../../../_services/utilities.service';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'gtibank-dynamic-form-fields',
  templateUrl: './dynamic-form-fields.component.html',
  styleUrls: ['./dynamic-form-fields.component.scss'],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('500ms ease-in-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideUpDown', [
      state('in', style({ height: '*' })),
      transition('* => void', [
        style({ height: '*' }),
        animate('300ms ease-in', style({ height: 0 }))
      ]),
      transition('void => *', [
        style({ height: 0 }),
        animate('300ms ease-in', style({ height: '*' }))
      ]),
    ])
  ]
})
export class DynamicFormFieldsComponent implements OnInit {
  @Input() field: FormFields;
  @Input() form: FormGroup;
  get isValid() { return this.form.controls[this.field.field_name].valid; }

  constructor(
    public util: UtilitiesService
  ) { }

  ngOnInit() {
  }

}
