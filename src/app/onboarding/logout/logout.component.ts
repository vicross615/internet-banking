import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private auth: AuthService,
  ) { }

  ngOnInit() {
    // document.querySelector('body').setAttribute('themebg-pattern', 'theme1');
    this.auth.ibankLogout();
  }

}
