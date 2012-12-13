---
name: 'related products module'
meta_data: {a:'foo', b:'bar'}
---

<section class="hero">
  <div class="hero-img-wrap">
    <img src="img/headphones-hero.jpg" alt="">
  </div>
  <div class="ghost-center-wrap hero-text-wrap">
    <div class="hero-text ghost-center">
      <div class="container-px-width">
        <div class="hidden-phone">hi</div>
        <h1>Related Products</h1>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="container-px-width">
    <div class="products gallery grid5" data-type="{{related.type}}">
      {{#each related.list}}
      <div class="gallery-item {{#if this.tile.large}}span3 h2 large{{/if}}{{#if this.tile.promo}}span2 promo{{/if}}{{#if this.tile.normal}}span1{{/if}} {{#if this.tile.copy}}promo-copy{{/if}}">
        {{#if this.label}}
        <span class="label">{{this.label}}</span>
        {{/if}}
        {{#if this.tile.promo}}
          {{#if this.tile.copy}}
          <h3>{{this.title}}</h3>
          <p class="p2">{{this.text}}</p>
          {{else}}
          <div class="product-img">
            <img src="{{this.img.src}}" alt="{{this.img.alt}}" width="{{this.img.width}}" height="{{this.img.height}}">
            <div class="product-content">
              <p class="text-promo-title"><strong>{{this.title}}</strong><br>{{this.subtitle}}</p>
              <a class="btn" href="#">{{this.callout}}</a>
            </div>
          </div>  
          {{/if}}
        {{else}}
        <div class="product-img ghost-center-wrap">
          <div class="ghost-center">
            <img src="{{this.img.src}}" alt="{{this.img.alt}}" width="{{this.img.width}}" height="{{this.img.height}}">
          </div>
        </div>
        <div class="product-content">
          <p class="p3 product-name">{{this.name}}</p>
          <div class="product-price">
            <p class="p5 price-title">Starting at</p>
            <p class="price"><span class="l2">${{this.price}}</span> <span class="p5 msrp">MSRP</span></p>
          </div>
        </div>

        {{/if}}
      </div>
      {{/each}}
    </div>
  </div>
</section>