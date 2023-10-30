import { Injectable } from '@angular/core';
import { RealtimePostgresChangesPayload, SupabaseClient, createClient } from '@supabase/supabase-js';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Board, List, ListCard } from '../models/data.model';

export const BOARDS_TABLE = 'boards';
export const USER_BOARDS_TABLE = 'user_boards';
export const LISTS_TABLE = 'lists'
export const CARDS_TABLE = 'cards'

@Injectable({
  providedIn: 'root'
})
export class DataService {


  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  // CRUD Board
  getBoards() {
    return this.supabase.from(USER_BOARDS_TABLE).select('boards:board_id(*)')
  }

  createBoard(title: string, description = '') {
    return this.supabase
      .from(BOARDS_TABLE)
      .insert({
        title,
        description
      });
  }

  getBoardInfo(boardId: string) {
    return this.supabase
      .from(BOARDS_TABLE)
      .select('*')
      .match({ id: boardId })
      .single();
  }

  updateBoard(board: any) {
    return this.supabase
      .from(BOARDS_TABLE)
      .update(board)
      .match({ id: board.id });
  }

  
 deleteBoard(board: any) {
    return this.supabase
      .from(BOARDS_TABLE)
      .delete()
      .match({ id: board.id });
  }

  // CRUD Lists
  getBoardLists(boardId: string) {
    return this.supabase
      .from(LISTS_TABLE)
      .select('*')
      .eq('board_id', boardId)
      .order('position');
  }

  addBoardList(boardId: string, position = 0) {
    return this.supabase
      .from(LISTS_TABLE)
      .insert({ board_id: boardId, position, title: 'New List' })
      .select('*')
      .single();
  }

  updateBoardList(list: List) {
    return this.supabase
      .from(LISTS_TABLE)
      .update(list)
      .match({ id: list.id });
  }

  deleteBoardList(list: List) {
    return this.supabase
      .from(LISTS_TABLE)
      .delete()
      .match({ id: list.id });
  }

  // CRUD Cards
  getListCards(listId: number) {
    return this.supabase
      .from(CARDS_TABLE)
      .select('*')
      .eq('list_id', listId)
      .order('position');
  }


  addListCard(title: string, listId: number, boardId: string, position = 0) {
    return this.supabase
      .from(CARDS_TABLE)
      .insert(
        { title: title, board_id: boardId, list_id: listId, position }
      )
      .select('*')
      .single();
  }

  updateCard(card: ListCard) {
    console.log("🚀 ~ file: data.service.ts:105 ~ DataService ~ updateCard ~ card:", card)
    return this.supabase
      .from(CARDS_TABLE)
      .update(card)
      .match({ id: card.id });
  }

  deleteCard(card: ListCard) {
    return this.supabase
      .from(CARDS_TABLE)
      .delete()
      .match({ id: card.id });
  }

  

  getTableChanges(table: string): Observable<RealtimePostgresChangesPayload<any>> {
    console.log("🚀 ~ file: data.service.ts:121 ~ DataService ~ getTableChanges ~ table:", table)
    const changes = new Subject<RealtimePostgresChangesPayload<any>>();

    this.supabase.channel(table)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table
        },
        (payload) => changes.next(payload)
      )
      .subscribe()

    return changes.asObservable();
  }
}
