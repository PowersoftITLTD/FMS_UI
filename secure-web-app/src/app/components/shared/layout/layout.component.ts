import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    HeaderBarComponent
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

}
