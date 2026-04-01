import { bootstrapApplication } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideState, provideStore } from '@ngrx/store'; // Add this
import { provideEffects } from '@ngrx/effects'; // Add this
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { ConfigService } from './app/services/config.service';
import { authReducer } from './app/store/auth/auth.reducer';
import { rehydrateState } from './app/store/persist-meta.reducer';
import { reducers, metaReducers } from './app/store/root.reducer';
import { InterceptorService } from './app/core/interceptor/interceptor.service';
import { jwtInterceptor  } from './app/core/interceptor/JWT/jwt.interceptor';
import { errorInterceptor } from './app/core/interceptor/error/error.interceptor';

async function bootstrap() {
  const configService = new ConfigService();
  await configService.loadConfig(); // Load config.json

  await bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes, withHashLocation()),
      provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor])),
      provideAnimations(),
      provideState('auth', authReducer),   // IMPORTANT
      // Add NgRx providers HERE
      provideStore(), // ← This provides the Store
        provideStore(reducers, {
      initialState: rehydrateState(), // rehydrate from localStorage
      metaReducers,                  // add your local storage meta-reducer
    }),
      provideEffects([]), // ← Empty array if no effects

      { provide: ConfigService, useValue: configService },
      // {
      //   provide: HTTP_INTERCEPTORS,
      //   useClass: InterceptorService,
      //   multi: true,
      // },
    ],
  });
}

bootstrap();