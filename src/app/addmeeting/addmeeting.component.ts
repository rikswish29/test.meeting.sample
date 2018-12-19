import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { UserService } from '../user.service';
import { SocketService } from '../socket.service';
import { MeetingService } from '../meeting.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-addmeeting',
  templateUrl: './addmeeting.component.html',
  styleUrls: ['./addmeeting.component.css']
})
export class AddmeetingComponent implements OnInit {

  constructor(public socketService : SocketService, private route:ActivatedRoute, private router: Router, private toastr : ToastrService, public userService : UserService, public cookie : CookieService, public meetingService : MeetingService) {
    console.log('add meeting works');
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.socketService.disconnectSocket();
      }
    });
   }

   adminName = '';
  adminId = '';
  userId = '';

  where = '';
  emailId = '';
  purpose = '';
  date = '';
  time = '23:00';
  public hourArray = ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'];
  authToken = '';
  public isAdminMode = false;

  public socketId: string;
  public socketName: string;
  public roomName: string;
  public socketDisconnected: boolean;
  public allUserList;


  ngOnInit() {
    this.authToken = this.cookie.get('authToken');
    let urlParams = this.filterUrl();
    this.checkUrlParamsAndDecideMode(urlParams);
    if (this.isAdminMode) {
      //if the there is admin id and user id then only we can allow adding of meeting
    } else {
      //as no admin id we can't allow add meeting so routing it login
      this.toastr.error('You are not admin.', "OOPS!");
      setTimeout(() => {
        this.router.navigate(['/']);
      },
        2000);
    }

    this.listenVerifyUserConfirmation();
    this.listenUserSetConfirmation();
    this.listenForError();
    this.listenSocketDisconnect();
    this.onlineUserList();
  }
  
  public listenVerifyUserConfirmation: any = () => {
    this.socketService.verifyUser()
      .subscribe((data) => {
        this.socketDisconnected = false;
        // this.toastr.info(data.message, "Info.");
        let authData = {
          authToken: this.cookie.get('authToken'),
          userId: this.userId
        }
        this.socketService.setUser(authData);
      });
  }//end verify user consfirmation

  public listenUserSetConfirmation: any = () => {
    this.socketService.listenUserSetConfirmation()
      .subscribe((data) => {

        // this.toastr.info("User Set.", "Info.");
        this.socketId = data.socketId;
        this.socketName = data.socketName;
        this.roomName = data.roomName;

      });
  }//end verify user consfirmation

  public listenForError: any = () => {
    this.socketService.errorListener()
      .subscribe((data) => {
        this.toastr.error(data, "Error");
      });
  }//end listen for error

  public listenSocketDisconnect: any = () => {
    this.socketService.disconnectedSocketListener()
      .subscribe((data) => {
        this.socketDisconnected = true;
        this.toastr.error(data, "SOCKET DISCONNECTED.");
      });
  }//end listen for scoket disconnect

  public onlineUserList: any = () => {
    this.socketService.onlineUserListListener()
      .subscribe((data) => {

        if (data.message == "join") {
          // this.toastr.info(data.sendBy + " joined", "Info.");
        } else {
          //this.toastr.info(data.sendBy + " left", "Info.");
        }

        console.log(data + " new user connected/ disconnected");

        let onlineUserArray: any = [];
        onlineUserArray = data.list;
      });
  }//end online user list



  filterUrl(): any {
    let urlParams;
    this.route.queryParams.subscribe(params => {
      urlParams = params;
    });
    return urlParams;
  }//end filter url

  checkUrlParamsAndDecideMode(url): any {
    this.adminId = url.adminId;
    this.userId = url.userId;
    //we need both to be there
    if (this.isEmpty(this.adminId) && this.isEmpty(this.userId)) {
      setTimeout(() => {
        this.router.navigate(['/']);
      },
        2000);
    } else {
      if (this.adminId && this.userId) {
        this.isAdminMode = true;
        let userInfo = this.userService.getUserInfoFromLocalstorage();
        this.adminName = userInfo.firstName + " " + userInfo.lastName + "- admin";
      } else {
        this.isAdminMode = false;
      }
    }
  }



  public isEmpty = (value) => {
    if (value === null || value === undefined || this.trim(value) === '' || value.length === 0) {
      return true
    } else {
      return false
    }
  }

  public trim = (x) => {
    let value = String(x)
    return value.replace(/^\s+|\s+$/gm, '')
  }

  addMeeting(): any {
   
    let data = {
      authToken: this.authToken,
      adminId: this.adminId,
      userId: this.userId,
      adminName: this.adminName,
      where: this.where,
      emailId : this.emailId,
      purpose: this.purpose,
      date: this.date,
      time: this.time,
      username: 'not necessary'
    }
    this.meetingService.addMeeting(data).subscribe(
      data => {
        let error = data.error;
        let message = data.message;
       
        if (error) {
          this.toastr.error(message, 'Fail!!');
      
        } else {
          this.toastr.success(message, 'Success!');
          let broadcastData = {
            broadcastMessageBy: this.adminId,
            broadcastMessageFor: this.userId,
            broadcastMessage: `A meeting has been added for you by ${this.adminName}`,

          }

          this.socketService.broadcastMessage(broadcastData);

       
          setTimeout(() => {
            this.router.navigate(['/usercalendar'], {
              queryParams: {
                'adminId': this.adminId,
                'userId': this.userId
              }
            });
          }, 2000);
        }

      },
      error => {
        this.toastr.error(error.message, 'Oops!');
      }
    );


  }

}
