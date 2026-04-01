import { Component, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
// import { NavLinkComponent } from '../nav-link/nav-link.component'; // If you have a NavLink-like component

interface MenuItem {
  title: string;
  url: string;
  icon: string; // Use PrimeIcons or class names
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, TooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {

  collapsed = true;
  isDarkMode = false;
  
  readonly THEME_KEY = 'invoice-theme';

  menuItems: MenuItem[] = [
    { title: 'Dashboard', url: '/', icon: 'pi pi-home' },
    { title: 'Daily Uploads', url: '/uploads', icon: 'pi pi-upload' },
    { title: 'Invoices', url: '/invoices', icon: 'pi pi-file' },
    { title: 'Reports', url: '/reports', icon: 'pi pi-chart-bar' },
    { title: 'Users', url: '/users', icon: 'pi pi-users' },
  ];

  settingsItems: MenuItem[] = [
    { title: 'Change Password', url: '/password', icon: 'pi pi-lock' },
    { title: 'Settings', url: '/settings', icon: 'pi pi-cog' },
  ];

  userName = 'John Doe';
  userRole = 'Admin';

  constructor(private router: Router, private renderer: Renderer2, @Inject(PLATFORM_ID) private platformId: any) {
    // Load theme preference
    if (isPlatformBrowser(this.platformId)) {
      const storedTheme = localStorage.getItem(this.THEME_KEY);
      this.isDarkMode = storedTheme === 'dark';
      this.applyTheme();
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    this.saveThemePreference();
  }

  private applyTheme() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.isDarkMode) {
        this.renderer.addClass(document.documentElement, 'dark');
      } else {
        this.renderer.removeClass(document.documentElement, 'dark');
      }
      this.renderer.addClass(document.documentElement, 'theme-transition');
      setTimeout(() => this.renderer.removeClass(document.documentElement, 'theme-transition'), 300);
    }
  }

  private saveThemePreference() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.THEME_KEY, this.isDarkMode ? 'dark' : 'light');
    }
  }

  isActive(url: string): boolean {
    return this.router.url === url;
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
}
