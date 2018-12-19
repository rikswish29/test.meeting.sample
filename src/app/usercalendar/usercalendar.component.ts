import { Component, ChangeDetectionStrategy,ChangeDetectorRef, NgZone,OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { Observable } from "rxjs/Observable";
import { MeetingService } from '../meeting.service';
import { SocketService } from '../socket.service';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'usercalendar.component.html',
  providers: [SocketService]
})
export class UsercalendarComponent implements OnInit {

  view: string = 'month';

  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  events = [];
  clickedDate: Date;
  authToken = '';
  public isAdminMode = false;
  public adminId = '';
  public userId = '';

  public socketId: string;
  public socketName: string;
  public roomName: string;
  public socketDisconnected: boolean;
  public allUserList;

  public activeDayIsOpen: boolean = true;
  public arrayOfMeetings = [];

  constructor(public meetingService : MeetingService, public socketService : SocketService ,private cd: ChangeDetectorRef ,private route:ActivatedRoute, private router: Router, public http : HttpClient, private toastr : ToastrService, public userService : UserService, public cookie : CookieService) { 
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.socketService.disconnectSocket();
      }
    });
  }

  ngOnInit(): void {
    this.authToken = this.cookie.get('authToken');
    let urlParams = this.filterUrl();
    this.checkUrlParamsAndDecideMode(urlParams);
    if (this.isAdminMode) {
      //loadEvents with all features
    } else {
      //just load events and no features
    }
    this.loadEvents();

    //socket related methods
    this.listenVerifyUserConfirmation();
    this.listenUserSetConfirmation();
    this.listenForError();
    this.listenSocketDisconnect();
    this.onlineUserList();
    this.listenForBroadcastMessage();
  }

  public listenForBroadcastMessage: any = () => {
    this.socketService.broadcastMessageListListener()
      .subscribe((data) => {
        // let messageFor = [{
        //   messageForUserId : freindRequestReceiverId or senderId
        //   messageForUsername : rname
        // }]

        // let data = {
        //   broadcastMessageBy : this.userId,
        //   broadcastMessageByName : this.userName,
        //   broadcastMessageFor : messageFor,
        //   broadcastMessage : this.friendreqsend or this.friendrequestaccepted,
        // //to be used when we edit,add,delete items and undo changelog
        //       //ADD,DELETE,EDIT,UNDO
        //       broadcastMessageListId : "",
        //       broadcastMessageItemId :"",
        //       broadcastMessageActionType : "",
        // }


        let messageForMe = false;
        //broadcastMessageFor is an array of userids

        if (data.broadcastMessageFor === this.userId) {
          messageForMe = true;

        }


        if (!messageForMe) {
          return;
        }

        this.toastr.info(data.broadcastMessage, "Info");
        this.loadEvents();

      });
  }//end listen for broacast message


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

        

        let onlineUserArray: any = [];
        onlineUserArray = data.list;
      });
  }//end online user list


  public filterUrl(): any {
    let urlParams;
    this.route.queryParams.subscribe(params => {
      urlParams = params;
    });
    return urlParams;
  }//end filter url

  public checkUrlParamsAndDecideMode(url): any {
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


  public loadEvents(): any {
    let userData = {
      authToken: this.authToken,
      userId: this.userId,
    }

    

    this.meetingService.getAllMeetingForUserId(userData).subscribe(

      data => {
        let error = data.error;
        let message = data.message;
       
        if (error) {
          this.toastr.error(message, 'Fail!!');
         
          this.arrayOfMeetings = [];
          this.events = [];
        } else {
          if (data.status === 200) {
            this.arrayOfMeetings = data.data;
            this.mountCalendarEvents();
          } else {
            this.arrayOfMeetings = [];
            this.events = [];
          }
          this.cd.detectChanges();
          this.refresh.next();
        }
      },
      error => {
        this.toastr.error(error.message, 'Oops!');
      }
    );
    return userData;
  }//load events end

  public mountCalendarEvents(): any {

    this.events = [];
    for (let d of this.arrayOfMeetings) {
      let eventVal =
        {
          id: d.meetingId,
          title: ` Your meeting is scheduled by ${d.adminName} at ${d.time} at ${d.where} for  ${d.purpose} `,
          color: colors.blue,
          start: new Date(d.date),
          actions: [
            {
              label: '<i class="fa fa-fw fa-pencil fa-2x"></i>',
              onClick: ({ event }: { event: any }): void => {

                if (this.isAdminMode) {
                 
                  this.redirectToEditMeeting(event.id);
                } else {
                  this.toastr.warning("You are not authorized", "Access Denied!");
                }
              }
            },
            {
              label: '<i class="fa fa-fw fa-times fa-2x"></i>',
              onClick: ({ event }: { event: any }): void => {
                //this.events = this.events.filter(iEvent => iEvent !== event);
                
                if (this.isAdminMode) {
                  this.deleteEvent(event);
                } else {
                  this.toastr.warning("You are not authorized", "Access Denied!");
                }


              }
            }
          ]
        }

     
      this.events.push(eventVal);

    }

  }

  public deleteEvent(event): any {
    let userData = {
      authToken: this.authToken,
      adminId: this.adminId,
      meetingId: event.id,
      userId: this.userId
    }

    this.meetingService.deleteMeeting(userData).subscribe(
      data => {
        let error = data.error;
        let message = data.message;
       
        if (error) {
          this.toastr.error(message, 'Fail!!');
          
        } else {
          if (data.status === 200) {
           
            this.loadEvents();

            let broadcastData = {
              broadcastMessageBy: this.adminId,
              broadcastMessageFor: this.userId,
              broadcastMessage: `Meeting by id ${event.id} has been deleted`,

            }

            this.socketService.broadcastMessage(broadcastData);
          }

        }
      },
      error => {
        this.toastr.error(error.message, 'Oops!');
      }
    );

  }


  public dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  //redirect to add meeting
  redirectToAddMeeting(): any {
    setTimeout(() => {
      this.router.navigate(['/addMeeting'], {
        queryParams: {
          'adminId': this.adminId,
          'userId': this.userId
        }
      });
    }, 1000);
  }

  //redirect ot alluser page
  redirectToUserList(): any {
    setTimeout(() => {
      this.router.navigate(['/alluser']);
    }, 1000);
  }

  //redirect to edit meeting
  redirectToEditMeeting(meetingId): any {
    setTimeout(() => {
      this.router.navigate(['/editMeeting'], {
        queryParams: {
          'adminId': this.adminId,
          'userId': this.userId,
          'meetingId': meetingId
        }
      });
    }, 1000);
  }

}
