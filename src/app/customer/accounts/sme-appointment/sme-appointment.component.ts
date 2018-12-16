import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-sme-appointment',
  templateUrl: './sme-appointment.component.html',
  styleUrls: ['./sme-appointment.component.scss'],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('800ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('500ms ease-in-out', style({opacity: 0}))
      ])
    ])
  ],
})
export class SmeAppointmentComponent implements OnInit {
  SMEAppointmentForm: FormGroup;
  isLoading: boolean;
  errorMessage; string;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createSMEAppointmentForm();
  }

  createSMEAppointmentForm() {
    this.SMEAppointmentForm = this.fb.group({
      'secretAnswer': ['', Validators.required]
    });
  }

  onSubmit(formValues) {
    console.log(formValues);
  }

}
