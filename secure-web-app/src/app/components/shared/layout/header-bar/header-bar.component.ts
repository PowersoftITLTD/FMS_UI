import { AfterViewInit, Component, ElementRef, Inject, inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { storedDetails } from '../../../../store/auth/auth.selectors';
import { take } from 'rxjs';
import { AuthService } from '../../../../services/auth/auth.service';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { AuthState } from '../../../../store/auth/auth.interface';
import { MenuItem } from 'primeng/api';
import { CommonModule, isPlatformBrowser, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';

interface HeaderItem {
  id?: string;
  label?: string;
  isActive?: boolean;
  route?: string;
  icon?: string; // Add icon property if needed
}

@Component({
  selector: 'app-header-bar',
  standalone: true,
  imports: [OverlayPanelModule, CommonModule, NgFor, RouterModule, TooltipModule],
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.scss'
})



export class HeaderBarComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('op') overlayPanel!: OverlayPanel;
  @ViewChild('triggerElement') triggerElement!: ElementRef;

  menuItems: MenuItem[] = [
    // { id: 'home', label: 'Home', isActive: true, route: '/' },
    // { id: 'about', label: 'About', isActive: false, route: '/about' },
    // { id: 'services', label: 'Services', isActive: false, route: '/services' },
    // { id: 'pricing', label: 'Pricing', isActive: false, route: '/pricing' },
    // { id: 'contact', label: 'Contact', isActive: false, route: '/contact' }
  ];

  userName: string = '';
  userEmail: string = '';

  private hideTimer: any;
  private isMouseOnPanel = false;
  private isMouseOnTrigger = false; 

  isDarkMode = false;
  private readonly THEME_KEY = 'invoice-theme';

  auth = inject(AuthService)

  constructor(private store:Store, 
              private renderer: Renderer2,
              @Inject(PLATFORM_ID) private platformId: any
             ){
       this.store.select(storedDetails).pipe(take(1)).subscribe((user:AuthState)=>{
         this.userDetails(user);
         this.userName = 'Hitesh Ghadage'
         this.userEmail = 'Hitesh.ghadage@powersoft.in'        
      })

  }

   statusStyles:any = {
    pending: 'bg-warning/20 text-warning border-warning/30',
    uploaded: 'bg-success/20 text-success border-success/30',
    sanction: 'bg-primary/20 text-primary border-primary/30'
  };

  ngOnInit(){
   
  }

    ngAfterViewInit() {
    // Add mouseenter/mouseleave events to trigger element
    if (this.triggerElement?.nativeElement) {
      this.triggerElement.nativeElement.addEventListener('mouseenter', () => {
        this.isMouseOnTrigger = true;
        this.showPanel();
      });
      
      this.triggerElement.nativeElement.addEventListener('mouseleave', () => {
        this.isMouseOnTrigger = false;
        this.scheduleHide();
      });
    }
  }


  userDetails(user:AuthState){

    const user_payload = {
      payload: user.user
    }
        
    console.log('AuthState user: ', user_payload);
  }


   // Method to get dynamic classes for menu items
  getMenuItemClasses(item: HeaderItem): string {
    const baseClasses = 'block py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-brand rounded-base';
    
    if (item.isActive) {
      return `${baseClasses} text-white bg-brand md:bg-transparent md:text-fg-brand md:p-0`;
    } else {
      return `${baseClasses} text-heading hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0`;
    }
  }

  // Handle menu item click
  onMenuItemClick(item: HeaderItem): void {
    // Update active state
    this.menuItems.forEach((menuItem:HeaderItem) => {
      menuItem.isActive = menuItem.id === item.id;
    });
    
    // You can also add navigation logic here
    if (item.route) {
      // this.router.navigate([item.route]); // Uncomment if using Angular Router
    }
  }


  showPanel() {
    clearTimeout(this.hideTimer);
    if (!this.overlayPanel.overlayVisible) {
      this.overlayPanel.show(null, this.triggerElement.nativeElement);
    }
  }

  onPanelMouseEnter() {
    this.isMouseOnPanel = true;
    clearTimeout(this.hideTimer);
  }

  onPanelMouseLeave() {
    this.isMouseOnPanel = false;
    this.scheduleHide();
  }

  scheduleHide() {
    clearTimeout(this.hideTimer);
    this.hideTimer = setTimeout(() => {
      if (!this.isMouseOnTrigger && !this.isMouseOnPanel) {
        this.overlayPanel.hide();
      }
    }, 500);
  }


    toggleTheme(): void {
      this.isDarkMode = !this.isDarkMode;
      this.applyTheme();
      this.saveThemePreference();
    }
  
    /**
     * Apply theme to document
     */
    private applyTheme(): void {
      if (isPlatformBrowser(this.platformId)) {
        if (this.isDarkMode) {
          this.renderer.addClass(document.documentElement, 'dark');
        } else {
          this.renderer.removeClass(document.documentElement, 'dark');
        }
        
        // Optional: Add transition effect for smoother theme switching
        this.renderer.addClass(document.documentElement, 'theme-transition');
        setTimeout(() => {
          this.renderer.removeClass(document.documentElement, 'theme-transition');
        }, 300);
      }
    }
  
      private saveThemePreference(): void {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.THEME_KEY, this.isDarkMode ? 'dark' : 'light');
      }
    }
  
    getStatusStyle(status: any): string {
      return this.statusStyles[status] || '';
    }



  logout(){
    this.auth.logout();
  
  }

  ngOnDestroy() {
    clearTimeout(this.hideTimer);
  }
}
