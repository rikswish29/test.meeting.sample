import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { VerifyComponent } from './verify/verify.component';

// import some more module
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule } from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {ToastrModule } from 'ngx-toastr';
import {MeetingService}  from './meeting.service';
import {SortPipe } from './sort.pipe';
import {UserService} from './user.service';
import { CookieService } from 'ngx-cookie-service';
import { AlluserComponent } from './alluser/alluser.component';
import { AddmeetingComponent } from './addmeeting/addmeeting.component';
import { EditmeetingComponent } from './editmeeting/editmeeting.component';
import { UsercalendarComponent } from './usercalendar/usercalendar.component';
import { CalendarModule } from 'angular-calendar';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FlatpickrModule } from 'angularx-flatpickr';
import 'flatpickr/dist/flatpickr.css'; // you may need to adjust the css import depending on your build tool


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ForgotpasswordComponent, 
    ChangepasswordComponent,
    AlluserComponent,
    AddmeetingComponent,
    EditmeetingComponent,
    UsercalendarComponent,
    VerifyComponent,
    
  ],
  imports: [
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    BrowserModule,
    HttpClientModule,
    CalendarModule.forRoot(),
    ToastrModule.forRoot(),
    FlatpickrModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot([
       {path:'login', component:LoginComponent},
       {path:'signup',component:SignupComponent},
       {path:'', redirectTo:'login', pathMatch:'full'},
       {path:'forgotpassword', component:ForgotpasswordComponent},       
       {path:'changepassword/:changePasswordToken', component : ChangepasswordComponent},
       {path:'usercalendar',component:UsercalendarComponent},
       {path:'addMeeting',component:AddmeetingComponent},
       {path:'editMeeting',component:EditmeetingComponent},
       {path:'alluser',component:AlluserComponent},
       {path:'verify/:verifyToken', component:VerifyComponent},
       { path: '*', component: LoginComponent },
       { path: '**', component: LoginComponent }
    ])
  ],
  providers: [MeetingService , UserService, SortPipe, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
