import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { TranslationService } from './translation.service';
import { PORTAL_ITEMS } from './portal.data';
import { PortalItem } from './portal.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly translation = inject(TranslationService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly ready = signal(false);
  readonly items = PORTAL_ITEMS;
  readonly currentLanguage = this.translation.currentLanguage;
  readonly isArabic = computed(() => this.currentLanguage() === 'ar');

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      await this.translation.init();
    }
    this.ready.set(true);
  }

  async onToggleLanguage(): Promise<void> {
    await this.translation.toggleLanguage();
  }

  trackById = (_: number, item: PortalItem): string => item.id;

  translate(key: string): string {
    return this.translation.t(key);
  }

  ariaLabel(item: PortalItem): string {
    return `${this.translate('actions.open')} ${this.translate(item.labelKey)}`;
  }
}
