import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { query } from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  activeLinkIndex = 0;

  isLogged = false;
  nickname = "";
  email = "";

  query: string = "";

  constructor(
    private sharedService: SharedService,
    public authService: AuthService,
    public dialog: MatDialog
  ) {

  }

  @HostListener('input', ['$event'])
  input(e) {
    this.query = e.target.value;
    this.sharedService.changedQueryEmitter(this.query);
  }

  ngOnInit() {
    this.authService.getProfile((err, profile) => {
      if(profile) {
        this.isLogged = true;
        this.nickname = profile.nickname;
        this.email = profile.name;
      }
    });

    this.sharedService.changedQuery.subscribe(query => {
      if(this.activeLinkIndex === 1)
        return;
      this.activeLinkIndex = 0; //Web
    });

    this.sharedService.setQuery.subscribe(query => {
      this.query = query;
    });

    this.sharedService.setNavIndex.subscribe(index => {
      this.activeLinkIndex = index;
    })
  }

  profile() {
    let dialogRef = this.dialog.open(ProfileDialog, {
      width: '250px',
      data: { nickname: this.nickname, email: this.email }
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  goto(index) {
    this.activeLinkIndex = index;
    this.sharedService.gotoEmitter(this.activeLinkIndex);
  }

  logout() {
    this.isLogged = false;
    this.authService.logoutEmitter();
  }

}


@Component({
  selector: 'profile-dialog',
  templateUrl: 'profile-dialog.html',
})
export class ProfileDialog {

  constructor(
    public dialogRef: MatDialogRef<ProfileDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}