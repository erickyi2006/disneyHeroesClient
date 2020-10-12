import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';


const routes: Routes = [
  { 
    path: '', 
    component: AdminComponent,
    data: {
      title: 'Disney Heroes Administrator Portal',
      subtitle: 'Administration'
    }
  },  
  {
    path: '**',
    redirectTo: '/',
    data: { title: '404' }
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
