import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private sidebarVisible = new BehaviorSubject<boolean>(true);

  sidebarVisible$ = this.sidebarVisible.asObservable();

  toggleSidebar(){
    this.sidebarVisible.next(!this.sidebarVisible.value);
  }
}
