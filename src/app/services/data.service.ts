import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

export const BOARDS_TABLE = 'boards';
export const USER_BOARDS_TABLE = 'user_boards';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  getBoards() {
    return this.supabase.from(USER_BOARDS_TABLE).select('boards:board_id(*)')
  }

  createBoard() {
    return this.supabase
      .from(BOARDS_TABLE)
      .insert({});
  }

  handleTableChanges() {
    const changes = new Subject<any>();

    this.supabase.channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
        },
        (payload) => changes.next(payload)
      )
      .subscribe()

    return changes.asObservable();
  }
}
