/* Angular */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '@/app-routing.module';

/* ngx */
import { QuillModule } from 'ngx-quill'
import { TagInputModule } from 'ngx-chips';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

/* Helpers */
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { ConfirmDeactivateGuard } from "./_helpers";
/* Components */
import { AppComponent } from '@/app.component';
import { RegisterComponent, UserChannelComponent, LoginComponent } from '@/components/user';
import { AddArticleComponent } from '@/components/article/add';
import { HomeComponent } from '@/components/home';
import { AdminComponent } from '@/components/admin';
import { ViewArticleComponent } from './components/article/view/view-article.component';

@NgModule({
  imports: [
    TagInputModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    BsDropdownModule.forRoot(),
    QuillModule.forRoot({
      theme: 'snow',
    })
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AdminComponent,
    RegisterComponent,
    AddArticleComponent,
    UserChannelComponent,
    ViewArticleComponent

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ConfirmDeactivateGuard
    // provider used to create fake backend
    // fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
