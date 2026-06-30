import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { FooterComponent } from '../../layout/footer/footer.component';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { StoreService } from '../../core/services/store.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, FooterComponent, ProductCardComponent],
  template: `
    <div class="hero">
      <div class="hero-left">
        <div class="hero-tag">Revendeur Officiel · Tunisie</div>
        <h1 class="hero-h1">Sois <em>Différent</em>.<br>Sois LAVERNE.</h1>
        <p class="hero-p">Là où chaque sillage raconte une histoire. Découvrez l'art du parfum arabe, livré directement chez vous en Tunisie.</p>
        <div class="hero-ctas"><button class="btn-dark" type="button" (click)="router.navigateByUrl('/collections')">Découvrir la Collection →</button></div>
      </div>
      <div class="hero-right">
        <video class="hero-video" #heroVideo autoplay muted loop playsinline preload="auto" [muted]="true" [defaultMuted]="true" [volume]="0" (loadedmetadata)="ensureHeroVideoMuted()" (canplay)="playHeroVideo()" (volumechange)="ensureHeroVideoMuted()">
          <source src="/laverne-banniere-2.mp4" type="video/mp4">
        </video>
        <div class="hero-video-overlay"></div>
      </div>
    </div>
    <div class="banners">@for (banner of banners; track banner.title) { <button class="banner" type="button" (click)="router.navigateByUrl(banner.path)"><span class="banner-tag">{{ banner.tag }}</span><span class="banner-title">{{ banner.title }}</span><span class="banner-sub">{{ banner.sub }}</span><span class="banner-link">Découvrir →</span></button> }</div>
    <div class="promo-banners">@for (banner of promoBanners; track banner.tag) { <button class="promo-banner" type="button" (click)="openPromo(banner.productId, banner.prodName, banner.path)"><img [src]="banner.img" [alt]="banner.tag" loading="lazy" decoding="async"><span class="promo-banner-overlay"></span><span class="promo-banner-content"><span class="promo-banner-tag">{{ banner.tag }}</span><span class="promo-banner-title">{{ banner.title }}</span><span class="promo-banner-sub">{{ banner.sub }}</span><span class="promo-banner-btn">{{ banner.btn }} →</span></span></button> }</div>
    <section class="band">
      <div class="sec-head"><div class="sec-tag">Les plus populaires</div><h2 class="sec-h2">Best <em>Sellers</em></h2><div class="sec-line"></div><p class="sec-p">Les parfums Laverne qui ont conquis l'Arabie Saoudite, maintenant en Tunisie.</p></div>
      <div class="prod-grid">@for (product of bestSellers$ | async; track product.id) { <app-product-card [product]="product"></app-product-card> }</div>
      <div class="center mt"><button class="btn-border" type="button" (click)="router.navigateByUrl('/collections')">Voir tous les parfums →</button></div>
    </section>
    <section><div class="story-grid"><div class="story-img"><img src="/laverne.webp" alt="Laverne" loading="lazy" decoding="async"></div><div><div class="story-tag">À propos</div><h2 class="story-h">Qui est <em>Laverne</em> ?</h2><p class="story-p">Laverne est une marque saoudienne de parfums lancée à Riyad par cinq frères, dont la passion s'est réunie pour créer des parfums exprimant le goût arabe dans un esprit moderne.</p><p class="story-p">Laverne s'efforce d'offrir une expérience aromatique intégrée à travers des parfums luxueux, soigneusement conçus et de haute qualité.</p><div class="tn-badge">Revendeur officiel · Tunis, Tunisie</div></div></div></section>
    <app-footer></app-footer>
  `
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;
  bestSellers$;

  ngAfterViewInit(): void {
    this.playHeroVideo();
  }

  ensureHeroVideoMuted(): void {
    const video = this.heroVideo?.nativeElement;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
  }

  playHeroVideo(): void {
    this.ensureHeroVideoMuted();
    this.heroVideo?.nativeElement.play().catch(() => {});
  }
  banners = [
    { tag: 'Pour Elle', title: 'Parfums Femme', sub: 'Floraux, poudrés et sucrés', path: '/elle' },
    { tag: 'Pour Lui', title: 'Parfums Homme', sub: 'Sillages profonds et masculins', path: '/lui' },
    { tag: 'Collections Exclusives', title: 'Nos Collections', sub: 'Coffrets et éditions spéciales', path: '/exclusives' }
  ];
  promoBanners = [
    { tag: 'Collection Femme', title: 'Sense', sub: 'La collection signature de Georgina. Sens, élégance et féminité.', btn: 'Découvrir la collection', img: '/sense.webp', prodName: 'Sense', productId: 19, path: '/elle' },
    { tag: 'Bestseller N°1', title: 'Gentle', sub: 'Le parfum le plus demandé. Fraîcheur et élégance arabes.', btn: 'Commander maintenant', img: '/gentle.webp', prodName: 'Gentle', productId: 34, path: '/lui' }
  ];

  constructor(private storeService: StoreService, public router: Router) {
    this.bestSellers$ = this.storeService.products$.pipe(map(products => {
      const best = products.filter(product => product.badge === 'Bestseller');
      return (best.length ? best : products).slice(0, 4);
    }));
  }

  openPromo(productId: number | null, productName: string, fallbackPath: string): void {
    if (productId) {
      const product = this.storeService.products.find(item => item.id === productId);
      if (product) { this.router.navigate(['/product', product.id]); return; }
    }
    const product = this.storeService.products.find(item => item.name.toLowerCase() === productName.toLowerCase());
    this.router.navigate(product ? ['/product', product.id] : [fallbackPath]);
  }
}
