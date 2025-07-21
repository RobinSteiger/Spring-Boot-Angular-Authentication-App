import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../../core/types/user.type';
import type { UserDetailsResponse, UserDetailsResponseData } from '../types/user-details-reponse.type';
import { formatRoletoString, UserRole } from '../../../core/types/user-role.type';
import type { UserDisplayResponse, UserDisplayResponseData } from '../types/user-display-response.type';
import { UserDetailsDisplay } from '../types/user-details-display.type';
import { getEndpoints } from '../../../core/constants/endpoints.constants';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly endpoints = getEndpoints();
  private readonly httpClient = inject(HttpClient);

  getUsers(): Observable<UserDisplayResponseData[]> {
    return this.httpClient
      .get<UserDisplayResponse>(
        this.endpoints.admin.v1.user
      )
      .pipe(
        map((response: UserDisplayResponse) => {
          console.log(response);
          const { data } = response;
          return data;
        })
      );
    /*
    return this.http.get<User[]>(`${this.baseUrl}/user`).pipe(
      map(users => users.map(user => ({
        ...user,
        userRole: user.userRole.map(formatRoletoString)
      })))
    );*/
  }

  getUserDetails(id : number) : Observable<UserDetailsResponseData> {
    return this.httpClient
    .get<UserDetailsResponse>(
      `${this.endpoints.admin.v1.user}/${id}`)
    .pipe(
      map((response: UserDetailsResponse) => {
        const { data } = response;
        return data;
      })
    );
    /*user => ({
        ...user,
        userRole: user.userRole.map(formatRoletoString)
      }*/
  }

  getAllRoles(): Observable<String[]> {
    return this.httpClient
      .get<UserRole[]>(
        this.endpoints.admin.v1.role)
      .pipe(
        map(roles => roles.map(formatRoletoString)
    ));
  }
} 