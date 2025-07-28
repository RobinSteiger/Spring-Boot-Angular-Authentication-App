import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { UserDetailsResponse, UserDetailsResponseData } from '../types/user-details-reponse.type';
import { formatRoletoString, UserRole } from '../../../core/types/user-role.type';
import type { UserDisplayResponse, UserDisplayResponseData } from '../types/user-display-response.type';
import { getEndpoints } from '../../../core/constants/endpoints.constants';
import { UserEditFormValue } from '../pages/user-gestion/user-edit/user-edit-form.type';
import { ApiResponse } from '../../../core/types/api-response.type';

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
  }

  getUserDetails(id : number) : Observable<UserDetailsResponseData> {
    return this.httpClient
    .get<UserDetailsResponse>(
      `${this.endpoints.admin.v1.user}/${id}`)
    .pipe(
      map((response: UserDetailsResponse) => {
        console.log(response);
        const { data } = response;
        return data;
      })
    );
  }

  getAllRoles(): Observable<UserRole[]> {
    return this.httpClient
      .get<ApiResponse<UserRole[]>>(
        this.endpoints.admin.v1.role)
      .pipe(
        map((response: ApiResponse<UserRole[]>) => {
          const { data } = response;
          return data;
        }
    ));
  }

  editUser(id : number, editUserRequest : UserEditFormValue): Observable<UserDetailsResponseData> {
    return this.httpClient
      .put<UserDetailsResponse>(
        `${this.endpoints.admin.v1.user}/${id}`,
        {
          firstname: editUserRequest.firstname,
          lastname: editUserRequest.lastname,
          email: editUserRequest.email,
          username: editUserRequest.username,
          userRole: editUserRequest.userRole
      })
      .pipe(
        map((response: UserDetailsResponse) => {
          const { data } = response;
          return data;
        })
      )
  }

  deleteUser(id : number) {
    return this.httpClient
      .delete(
        `${this.endpoints.admin.v1.user}/${id}`,
      )
  }
}

