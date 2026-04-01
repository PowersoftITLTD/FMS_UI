import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToasterContainerComponent } from './components/shared/toaster-container/toaster-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToasterContainerComponent],
  providers: [
    // provideStore(reducers, { metaReducers })
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'secure-web-app';
}
