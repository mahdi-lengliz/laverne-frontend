import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { FooterComponent } from '../../layout/footer/footer.component';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { StoreService } from '../../core/services/store.service';

interface HeroImage {
  src: string;
  alt: string;
  kind: 'editorial' | 'product';
  position?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, FooterComponent, ProductCardComponent],
  template: `
    <div class="hero">
      <div class="hero-left">
        <div class="hero-tag">Revendeur Officiel · Tunisie</div>
        <h1 class="hero-h1">Sois <em>Différent</em>.<br>Sois LAVERNE.</h1>
        <p class="hero-p">Les parfums saoudiens les plus désirés, Blue, Phantom, Tobacco, désormais disponibles partout en Tunisie. Livraison rapide, paiement à la réception.</p>
        <div class="hero-ctas"><button class="btn-dark" type="button" (click)="router.navigateByUrl('/collections')">Découvrir la Collection →</button><button class="btn-border" type="button" (click)="router.navigateByUrl('/elle')">Pour Elle</button></div>
      </div>
      <div class="hero-right">
        @if (heroImages$ | async; as heroImages) {
          @for (image of heroImages; track image.src; let index = $index) {
            <img class="hero-photo" [class.active]="isHeroImageActive(index, heroImages.length)" [class.hero-editorial]="image.kind === 'editorial'" [class.hero-product]="image.kind === 'product'" [style.object-position]="image.position || null" [src]="image.src" [alt]="image.alt">
          }
          @if (!heroImages.length) {
            <div class="hero-product-fallback"><span>LAVERNE</span><small>Parfums Authentiques</small></div>
          }
        }
        <div class="hero-video-overlay"></div>
      </div>
    </div>
    <div class="strip"><div class="strip-inner">@for (item of trustItems; track item.t) { <div class="strip-item"><span class="strip-ico">{{ item.i }}</span><div><span class="strip-t">{{ item.t }}</span><span class="strip-s">{{ item.s }}</span></div></div> }</div></div>
    <div class="banners">@for (banner of banners; track banner.title) { <button class="banner" type="button" (click)="router.navigateByUrl(banner.path)"><span class="banner-ico">{{ banner.ico }}</span><span class="banner-tag">{{ banner.tag }}</span><span class="banner-title">{{ banner.title }}</span><span class="banner-sub">{{ banner.sub }}</span><span class="banner-link">Découvrir →</span></button> }</div>
    <div class="promo-banners">@for (banner of promoBanners; track banner.tag) { <button class="promo-banner" type="button" (click)="openPromo(banner.prodName, banner.path)"><img [src]="banner.img" [alt]="banner.tag"><span class="promo-banner-overlay"></span><span class="promo-banner-content"><span class="promo-banner-tag">{{ banner.tag }}</span><span class="promo-banner-title">{{ banner.title }}</span><span class="promo-banner-sub">{{ banner.sub }}</span><span class="promo-banner-btn">{{ banner.btn }} →</span></span></button> }</div>
    <section class="band">
      <div class="sec-head"><div class="sec-tag">Les plus populaires</div><h2 class="sec-h2">Best <em>Sellers</em></h2><div class="sec-line"></div><p class="sec-p">Les parfums Laverne qui ont conquis l'Arabie Saoudite, maintenant en Tunisie.</p></div>
      <div class="prod-grid">@for (product of bestSellers$ | async; track product.id) { <app-product-card [product]="product"></app-product-card> }</div>
      <div class="center mt"><button class="btn-border" type="button" (click)="router.navigateByUrl('/collections')">Voir tous les parfums →</button></div>
    </section>
    <section><div class="story-grid"><div class="story-img"><img src="https://cdn.files.salla.network/homepage/504871843/1a3ea40d-4338-4630-b958-5d994a012fb5.webp" alt="Laverne"></div><div><div class="story-tag">À propos</div><h2 class="story-h">Qui est <em>Laverne</em> ?</h2><p class="story-p">Laverne est une marque saoudienne de parfums lancée à Riyad par cinq frères, dont la passion s'est réunie pour créer des parfums exprimant le goût arabe dans un esprit moderne.</p><p class="story-p">Laverne s'efforce d'offrir une expérience aromatique intégrée à travers des parfums luxueux, soigneusement conçus et de haute qualité.</p><div class="tn-badge">Revendeur officiel · Tunis, Tunisie</div></div></div></section>
    <app-footer></app-footer>
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  bestSellers$;
  heroImages$;
  activeHeroImage = 0;
  private readonly editorialHeroImage: HeroImage = { src: 'hero-laverne-banner.webp', alt: 'Campagne LAVERNE', kind: 'editorial', position: '18% center' };
  private heroTimer?: ReturnType<typeof setInterval>;
  trustItems = [
    { i: '🚚', t: 'Livraison rapide', s: '2-5 jours partout en Tunisie' },
    { i: '💵', t: 'Cash à la livraison', s: 'Aucune carte requise' },
    { i: '✅', t: '100% Authentique', s: 'Revendeur officiel LAVERNE' },
    { i: '↻', t: 'Retours faciles', s: 'Satisfait ou remboursé' }
  ];
  banners = [
    { tag: 'Pour Elle', title: 'Parfums Femme', sub: 'Floraux, poudrés et sucrés', ico: '🌸', path: '/elle' },
    { tag: 'Pour Lui', title: 'Parfums Homme', sub: 'Sillages profonds et masculins', ico: '🖤', path: '/lui' },
    { tag: 'Collections Exclusives', title: 'Nos Collections', sub: 'Coffrets et éditions spéciales', ico: '🎁', path: '/exclusives' }
  ];
  promoBanners = [
    { tag: 'Collection Femme', title: 'Sense', sub: 'La collection signature de Georgina. Sens, élégance et féminité.', btn: 'Découvrir la collection', img: 'https://cdn.salla.sa/XzOPD/hHm7rp5tprCVOHFzxLAlf3JXSRI7bbqtsQg7fMAL.jpg', prodName: 'Sense', path: '/elle' },
    { tag: 'Bestseller N°1', title: 'Gentle', sub: 'Le parfum le plus demandé. Fraîcheur et élégance arabes.', btn: 'Commander maintenant', img: 'https://cloudtiktak.com/media/static/media/o_xhvb4nC.webp', prodName: 'Gentle', path: '/lui' }
  ];

  constructor(private storeService: StoreService, public router: Router) {
    this.heroImages$ = this.storeService.products$.pipe(map(products => [
      this.editorialHeroImage,
      ...products.flatMap(product => [product.imageUrl, product.imageUrl2]
        .filter((src): src is string => Boolean(src))
        .map(src => ({ src, alt: product.name, kind: 'product' } as HeroImage)))
    ].slice(0, 8)));

    this.bestSellers$ = this.storeService.products$.pipe(map(products => {
      const best = products.filter(product => product.badge === 'Bestseller');
      return (best.length ? best : products).slice(0, 4);
    }));
  }

  ngOnInit(): void {
    this.heroTimer = setInterval(() => {
      this.activeHeroImage += 1;
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.heroTimer) {
      clearInterval(this.heroTimer);
    }
  }

  openPromo(productName: string, fallbackPath: string): void {
    const product = this.storeService.products.find(item => item.name.toLowerCase().includes(productName.toLowerCase()));
    this.router.navigate(product ? ['/product', product.id] : [fallbackPath]);
  }

  isHeroImageActive(index: number, total: number): boolean {
    return total > 0 && index === this.activeHeroImage % total;
  }
}
