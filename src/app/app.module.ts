import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
// import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';



// Imports for loading & configuring the in-memory web api
// import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { InMemoryDataService } from './in-memory-data.service';

import { AppRoutingModule } from './app-routing.module';
import { UserService } from './user.service';
import { DataService } from './data.service';
import { Alert } from './alert.service';
import { RootComponent } from './root.component';
import { LoginInComponent } from './login-in.component';
import { DashBoardComponent } from './dashboard.component';
import { TodoComponent } from './todo.component';
import { TimerComponent } from './timer.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    // HttpModule,
    HttpClientModule,
    AppRoutingModule
    // InMemoryWebApiModule.forRoot(InMemoryDataService),
  ],
  declarations: [
    RootComponent,
    LoginInComponent,
    DashBoardComponent,
    TodoComponent,
    TimerComponent,
  ],
  providers: [
    UserService,
    DataService,
    Alert,
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
