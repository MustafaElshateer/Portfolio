import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export type AppLanguage = 'en' | 'ar';

export interface TranslationMap {
  [key: string]: string | TranslationMap;
}

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'portal-language';

  readonly currentLanguage = signal<AppLanguage>('en');
  readonly translations = signal<TranslationMap>({});

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  async init(): Promise<void> {
    if (!this.isBrowser) {
      this.currentLanguage.set('en');
      this.translations.set({});
      return;
    }

    const saved = this.readSavedLanguage();
    await this.setLanguage(saved);
  }

  async toggleLanguage(): Promise<void> {
    await this.setLanguage(this.currentLanguage() === 'en' ? 'ar' : 'en');
  }

  async setLanguage(language: AppLanguage): Promise<void> {
    if (!this.isBrowser) {
      this.currentLanguage.set(language);
      return;
    }

    const file = `assets/i18n/${language}.json`;
    const data = await firstValueFrom(this.http.get<TranslationMap>(file));

    this.currentLanguage.set(language);
    this.translations.set(data);

    localStorage.setItem(this.storageKey, language);
    this.document.documentElement.lang = language;
    this.document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    this.document.body.classList.toggle('rtl', language === 'ar');
    this.document.body.classList.toggle('ltr', language === 'en');
  }

  t(path: string): string {
    const segments = path.split('.');
    let value: string | TranslationMap = this.translations();

    for (const segment of segments) {
      if (typeof value === 'string') {
        return path;
      }

      if (!(segment in value)) {
        return path;
      }

      value = value[segment];
    }

    return typeof value === 'string' ? value : path;
  }

  private readSavedLanguage(): AppLanguage {
    if (!this.isBrowser) {
      return 'en';
    }

    const saved = localStorage.getItem(this.storageKey);
    return saved === 'ar' ? 'ar' : 'en';
  }
}
