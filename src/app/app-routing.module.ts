import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home';
import { UserChannelComponent } from './components/user';
import { LoginComponent } from './components/user';
import { RegisterComponent } from './components/user';
import { AuthGuard, AdminGuard } from '@/_helpers';
import { AdminComponent } from './components/admin/admin.component';
import { AddArticleComponent } from './components/article/add/add-article.component';
import { ViewArticleComponent } from './components/article/view/view-article.component';
import { ConfirmDeactivateGuard } from "./_helpers";
const routes: Routes = [
  {
    path: '', canActivate: [AuthGuard], children: [
      { path: '', component: HomeComponent },
      { path: 'user', component: UserChannelComponent },
      { path: 'user/:username', component: UserChannelComponent },

      // Articles
      {
        path: 'article', children: [

          { path: 'add', component: AddArticleComponent, canDeactivate: [ConfirmDeactivateGuard] },
          { path: '', component: ViewArticleComponent },
        ]
      },

      // Admin
      {
        path: 'admin', canActivate: [AdminGuard], children: [
          { path: '', component: AdminComponent },
        ]
      }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
