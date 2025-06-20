import { Injectable } from '@angular/core';
import { CacheEntry } from '../../shared/model';



@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private cache = new Map<string, CacheEntry>()
  private cacheDuration = 5 * 60 * 1000;   

  constructor() { }

  // check if a valid cache entry exists.
  get(key: string): any | null {
    const entry = this.cache.get(key)
    if(!entry) return null

    const now = Date.now()
    const isExpired =  now - entry.timestamp > this.cacheDuration;

    return isExpired ? null : entry.data;
  }


  // add or update a cache entry.
  set(key: string, data: any) {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now()
    }

    this.cache.set(key, entry)
  }


  // clear a specific key
  clearKey(key: string): void {
    this.cache.delete( key )
  }

  // clear all cache entries
  clearAll(): void {
    this.cache.clear()
  }


}
