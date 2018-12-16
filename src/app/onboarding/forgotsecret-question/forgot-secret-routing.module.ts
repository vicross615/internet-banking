import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule,Routes} from '@angular/router'
import {ForgotsecretQuestionComponent} from './forgotsecret-question.component'


const routes: Routes = [
  {   
        path: '',      
        component:ForgotsecretQuestionComponent, 

        data: {
          title : 'forgotsecretquestion'
        }
  }

]

@NgModule({

  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []

})


export class ForgotSecretRoutingModule { 
}
