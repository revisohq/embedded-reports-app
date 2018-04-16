import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReportsHomeComponent } from './reports-home/reports-home.component';

const routes: Routes = [
  { path: '', redirectTo: '/reports', pathMatch: 'full' },
  { path: 'reports', component: ReportsHomeComponent },
  { path: 'corrispettivi', component: ReportsHomeComponent, data:{reportName: 'corrispettivi'} }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
