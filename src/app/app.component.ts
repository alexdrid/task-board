import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <header *ngIf="user | async" class="bg-emerald-600">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="w-full py-4 flex items-center justify-between border-b border-emerald-500 lg:border-none"
        >
          <div class="flex items-center">
            <a routerLink='/' class="text-white p-1 font-bold rounded-md text-2xl hover:bg-emerald-700">Board</a>
          </div>
          <div class="ml-10 space-x-4 flex items-center">
            <span class="text-white">{{ (user | async)?.email }}</span>
            <button
              (click)="signOut()"
              class="inline-block bg-white py-1 px-4 border border-transparent rounded-md text-base font-medium text-emerald-600 hover:bg-emerald-50"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
    <router-outlet/>
  `,
})
export class AppComponent {
  private auth = inject(AuthService)

  user = this.auth.currentUser$;

  signOut(): void {
    this.auth.signOut()
  }
}
