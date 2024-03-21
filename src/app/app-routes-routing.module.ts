import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SearchUsersComponent} from "./pages/user-management/search-users/search-users.component";


const routes: Routes = [
  {
    path: '',
    component: SearchUsersComponent,
    pathMatch: 'full',
    data: {
      isExtranet: true
    },
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutesRoutingModule { }
