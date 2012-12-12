---
name: 'related products module'
meta_data: {a:'foo', b:'bar'}
---

<!-- <section class="hero">
  <div class="hero-img-wrap">
    <img src="img/headphones-hero.jpg" alt="">
  </div>
  <div class="ghost-center-wrap hero-text-wrap">
    <div class="hero-text ghost-center">
      <div class="container">
        <div class="hidden-phone">hi</div>
        <h1>Related Products</h1>
      </div>
    </div>
  </div>
  
<img class="iq-img" alt="sony camera" data-src="sony-camera.jpg">
<noscript>
  <img src="img/sony-camera-desktop.jpg">
</noscript>

</section> -->
<h4>Related Products Module</h4>
<div class="btn btn-mini btn-alt rpArrow left">Previous</div>
<div class="btn btn-mini btn-alt rpArrow right">Next</div>
<section class="related-products">
    <div class="rpOverflow" id="rpOverflow">
      <div class="rpContainer">
        <div class='rpSlide'>
          <div class="row-5-up">
            <!-- <img src="http://flickholdr.com/582/450/headphones/2" alt="Promo" /> -->
            <div></div>
          </div>
          <div class="row-2-up">
           <div class="col-1-up"><!-- <img src="http://placehold.it/194x220/00ff00" alt="Promo"> --></div>
           <div class="col-1-up odd"><!-- <img src="http://placehold.it/194x220/0000ff" alt="Promo"> --></div>
           <div class="col-2-up"></div>
          </div>
        </div>
        <div class='rpSlide'>
          <div class="row-4-up">
            <div></div>
          </div> 
          <div class="row-4-up">
            <div></div>
          </div>
        </div>
        <div class='rpSlide'>
          <div class="row-2-up">
           <div class="col-2-up"></div>
           <div class="col-1-up"></div>
           <div class="col-1-up odd"></div>
          </div>
          <div class="row-2-up">
           <div class="col-1-up"></div>
           <div class="col-1-up odd"></div>
           <div class="col-2-up"></div>
          </div>
          <div class="row-1-up">
           <div></div>
          </div>
        </div>
      </div>
    </div>
  </section> 
<div id="wrapper">
  <div id="scroller">
    <ul id="thelist">
      <li><strong>1.</strong> <em>A robot may not injure a human being or, through inaction, allow a human being to come to harm.</em></li>
      <li><strong>2.</strong> <em>A robot must obey any orders given to it by human beings, except where such orders would conflict with the First Law.</em></li>
      <li><strong>3.</strong> <em>A robot must protect its own existence as long as such protection does not conflict with the First or Second Law.</em></li>
      <li><strong>Zeroth Law:</strong> <em>A robot may not harm humanity, or, by inaction, allow humanity to come to harm.</em></li>
      <li><strong>Lyuben Dilov's Forth law:</strong> <em>A robot must establish its identity as a robot in all cases.</em></li>
      <li><strong>Harry Harrison's Forth law:</strong> <em>A robot must reproduce. As long as such reproduction does not interfere with the First or Second or Third Law.</em></li>
      <li><strong>Nikola Kesarovski's Fifth law:</strong> <em>A robot must know it is a robot.</em></li>
    </ul>
  </div>
</div>
<div id="nav">
  <div id="prev" onclick="myScroll.scrollToPage('prev', 0);return false">&larr; prev</div>
  <ul id="indicator">
    <li class="active">1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    <li>6</li>
    <li>7</li>
  </ul>
  <div id="next" onclick="myScroll.scrollToPage('next', 0);return false">next &rarr;</div>
</div>
<!-- <div class="container">
  <div class="span-40"></div>
  <div class="span-60"></div>
</div> -->

<!--       <div class="products gallery grid5" data-type="{{related.type}}">
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
        {{/each}} -->