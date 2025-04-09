import { EnvironmentInjector, inject, Injectable, runInInjectionContext, Signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpsService {

  constructor(private http: HttpClient) { }

  /**
   * Retrieves the authentication token from either session storage or local storage.
   * If the token is not found in either storage, returns null.
   */
  getToken(): string | null {
    return sessionStorage.getItem('token') || localStorage.getItem('token');
  }

  /**
   * Returns the HTTP headers to be used for an HTTP request.
   * The returned headers will contain the 'Content-Type' header set to
   * 'application/json'. If an authentication token is available, the
   * 'Authorization' header will also be set to the value 'Token <token>',
   * where <token> is the value of the authentication token.
   */
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) { headers = headers.set('Authorization', `Token ${token}`); }
    return headers;
  }

  /**
   * Sends a POST request to the specified URL with the provided body.
   * The request includes headers obtained from the getHeaders() method.
   * @param url - The URL to which the POST request is sent.
   * @param body - The body of the POST request.
   * @returns An Observable of the response, typed as T.
   */
  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body, { headers: this.getHeaders() });
  }

  /**
   * Sends a PATCH request to the specified URL with the provided body.
   * The request includes headers obtained from the getHeaders() method.
   * @param url - The URL to which the PATCH request is sent.
   * @param body - The body of the PATCH request.
   * @returns An Observable of the response, typed as T.
   */
  patch<T>(url: string, body: any): Observable<T> {
    return this.http.patch<T>(url, body, { headers: this.getHeaders() });
  }

  /**
   * Sends a GET request to the specified URL.
   * The request includes headers obtained from the getHeaders() method.
   * @param url - The URL to which the GET request is sent.
   * @returns An Observable of the response, typed as T.
   */
  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url, { headers: this.getHeaders() });
  }

}
