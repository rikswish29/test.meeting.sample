import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {UserService} from '../user.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from '../socket.service';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
@Component({
  selector: 'app-alluser',
  templateUrl: './alluser.component.html',
  styleUrls: ['./alluser.component.css'],
  providers: [SocketService]
})
export class AlluserComponent implements OnInit {

  public authToken: string;
  public userName: string;
  public userId: string;
  public admin : string;
  public allUserList;

  constructor(private route:ActivatedRoute, private router: Router, public http : HttpClient, private toastr : ToastrService, public userService : UserService, public Cookie : CookieService, public socketService : SocketService) {
    console.log('all users works');
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
       //this.socketService.disconnectSocket();
      }
    });
   }

  ngOnInit() {
    this.authToken = this.Cookie.get('authToken');
    let userInfo = this.userService.getUserInfoFromLocalstorage();
    this.userName = userInfo.firstName + " " + userInfo.lastName;
    this.userId = userInfo.userId;
    this.admin = userInfo.admin;
    this.checkStatus();
    if(this.admin === 'admin'){
      this.userName = this.userName + "-admin";
    }
    this.getAllUser();

  }

  public checkStatus: any = () => {
    if (this.authToken === undefined || this.authToken === '' || this.authToken === null || this.admin != 'admin') {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }//end check status

  public getAllUser() : any {
    this.userService.getAllUsers(this.authToken).subscribe(
      data => {
        let error = data.error;
        let message = data.message;
        let result = data.data;
        if(error){
          this.toastr.error(message, 'Fail!!');
         
          this.allUserList = [];
        }else{
          this.allUserList = result;
        }
      },
      error => {
          this.toastr.error(error.message, 'Oops!');
      }
    );
   
  }
  //get all users end

  public goToUserCalendar : any = (user) =>{
    
    setTimeout(()=>{
      this.router.navigate(['/usercalendar'],{ queryParams: { 'adminId': this.userId , 
      'userId':user.userId}});

    },2000);
    
  }
  //goToUserCalendar end

}
