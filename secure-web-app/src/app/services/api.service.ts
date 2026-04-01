import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable, Subject } from 'rxjs';

const endpointPaths = {
  secureAPI: '/Auth',
  isDashboard:'/Dashboard'
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);

  private remarkDoneSubject = new Subject<any>();
  remarkDone$ = this.remarkDoneSubject.asObservable();

  constructor() {}


  getSecureAPI(
    url:string,
    isAuth?:boolean,
    isDashboard?:boolean
  ): Observable<any>{

        console.log('isDashboard: ', isDashboard, 'isAuth: ', isAuth)


    if (isAuth) {
      url = endpointPaths.secureAPI + '/' + url;
    }

    if(isDashboard){
      url = endpointPaths.isDashboard + '/' + url;      
    }

    const url_path = `${this.config.apiBaseUrl}${url}`

    return this.http.get(url_path);
  }

  postSecureAPI(
    url: string,
    payload: any,        // ← the body to send
    isAuth?: boolean,
    isDashboard?:boolean 

  ): Observable<any> {

    console.log('isDashboard: ', isDashboard, 'isAuth: ', isAuth)
    // Build endpoint
    if (isAuth) {
      url = endpointPaths.secureAPI + '/' + url;
    }

    if(isDashboard){
      url = endpointPaths.isDashboard + '/' + url;
    }

    // Build full URL using config.json
    const url_path = `${this.config.apiBaseUrl}${url}`;
    console.log('Calling:', url_path);

    // Make HTTP POST request
    return this.http.post(url_path, payload);
  }

  postSecureDownloadAPI(
    url: string,
    payload: any,        // ← the body to send
    isAuth?: boolean,
    isDashboard?:boolean, 

  ): Observable<any> {

    // console.log('isDashboard: ', isDashboard, 'isAuth: ', isAuth)
    // Build endpoint
    // if (isAuth) {
    //   url = endpointPaths.secureAPI + '/' + url;
    // }

  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

    if(isDashboard){
      url = endpointPaths.isDashboard + '/' + url;
    }

    // Build full URL using config.json
    const fullUrl = `${this.config.apiBaseUrl}${url}`;
    console.log('Calling:', fullUrl);


  return this.http.post(fullUrl, payload,   {
        headers,
        responseType: 'blob' // 🔥 THIS IS THE FIX
      });
    // Make HTTP POST request
    // return this.http.post(fullUrl, payload);
  }
}
