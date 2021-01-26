import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../../../../common/user';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../../../auth/src/lib/services/auth';
import {ToastService} from 'angular-toastify';
import {environment} from '../../../../../src/environments/environment';

@Injectable({providedIn: 'root'})
export class UsersService {
  private usersUpdated: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor(private http: HttpClient,
              private authService: AuthService,
              private toastService: ToastService) {
  }

  getUsersListener(): Observable<User[]> {
    return this.usersUpdated.asObservable();
  }

  getUser(token: string, email: string): void {
    this.http.get(`${environment.appApi}/users/${email}`,
      {
        headers: {
          authtoken: token
        }
      })
  }

  getUsers(token: string): void {
    this.http.get<User[]>(`${environment.appApi}/users`,
      {
        headers: {
          authtoken: token
        }
      })
      .subscribe(
        (users: User[]) => {
          this.usersUpdated.next(users)
        }
      )
  }

  updateUser(token: string, user: User): void {
    this.http.put<User[]>(`${environment.appApi}/user/${user.email}`,
      {
        user
      },
      {
        headers: {
          authtoken: token
        }
      })
      .subscribe(p => {
          this.toastService.success(`Userul cu emailul ${user.email} a fost editat cu succes!`);
          this.getUsers(token);
        },
        (err) => {
          this.toastService.error(`Nu s-a putut edita userul.`);
        });
  }


}

