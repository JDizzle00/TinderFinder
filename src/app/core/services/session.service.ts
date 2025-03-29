import { Injectable } from '@angular/core';
import { TriangulationSession } from '@core/models';
import { LocalStorageService } from './local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class SessionService {

  SESSIONS_LOCAL_STORAGE_KEY = 'triangulation-sessions';

  constructor(
    private readonly localStorageService: LocalStorageService
  ) { }

  loadSessionsFromLocalStorage() : TriangulationSession[] | null {
    return this.localStorageService.getValue<TriangulationSession[]>(this.SESSIONS_LOCAL_STORAGE_KEY);
  }
  
  saveSessions(sessions: TriangulationSession[]) : void {
    this.localStorageService.setValue<TriangulationSession[]>(this.SESSIONS_LOCAL_STORAGE_KEY, sessions);
  }

}
