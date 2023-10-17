import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthTokenResponse, SupabaseClient, User, createClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _currentUser: BehaviorSubject<boolean | User | any> =
    new BehaviorSubject(null);

  private supabase: SupabaseClient

  private router = inject(Router)

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)

    this.supabase.auth.getUser().then(res => {
      const { data, error } = res

      if (data) {
        console.log("🚀 ~ file: auth.service.ts:23 ~ AuthService ~ user ~ data:", data.user)
        this._currentUser.next(data.user);
      } 
      
      if(error){
        this._currentUser.next(false);
      }
    });

    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        this._currentUser.next(session?.user);
      } else {
        this._currentUser.next(false);
        this.router.navigateByUrl('/', { replaceUrl: true });
      }
    });
  }

  signIn(email: string, password: string): Promise<AuthTokenResponse> {
    return this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  signOut() {
    this.supabase.auth.signOut();
  }

  get currentUser$() {
    return this._currentUser.asObservable();
  }
}

