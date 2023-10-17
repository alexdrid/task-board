import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabaseClient: SupabaseClient
  token: string | undefined

  constructor() {
    this.supabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  fetchTasks() {
    return this.supabaseClient.from('tasks').select('*').order('id', { ascending: false })
  }
}
