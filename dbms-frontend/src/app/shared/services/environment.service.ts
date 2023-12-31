import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  private _privateEyeBaseUrl = '';
  private _assetsPath = '';

  constructor(private _http: HttpClient) { }

  get assetsPath(): string {
    return this._assetsPath;
  }

  get privateEyeBaseUrl(): string {
    return this._privateEyeBaseUrl;
  }

  async init(): Promise<void> {
    const variables = await this.readEnvironmentVariables().toPromise();
    this.setEnvironmentVariables(variables);

    return new Promise(resolve => {
      this.readEnvironmentVariables().subscribe((data: any) => {
        this.setEnvironmentVariables(data);
      });
      resolve();
    });
  }

  readEnvironmentVariables(): Observable<any> {
    return this._http.get<any>('assets/configurations/config.json');
  }

  setEnvironmentVariables(variables: any): void {
    this._assetsPath = variables.assetsPath;
    this._privateEyeBaseUrl = variables.privateEyeBaseUrl;
  }
}
