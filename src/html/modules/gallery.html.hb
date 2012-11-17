
<div class="hero">
  <div class="hero-img-wrap">
    <img src="img/headphones-hero.jpg" alt="">
  </div>
    <div class="ghost-center-wrap hero-text-wrap">
      <div class="hero-text ghost-center">
        <div class="container">
          <div class="hidden-phone">Audio</div>
          <h1>Headphones</h1>
        </div>
      </div>
    </div>
</div>

<div class="tab-strip">

  <div class="tab-nav-wrap container">
    <nav class="tab-nav-btns">
      <div class="tab-nav tab-nav-prev"></div>
      <div class="tab-nav tab-nav-next"></div>
    </nav>
  </div>

  <div class="tabs-container container">
    <div class="tabs">
      {{#each tabs}}<div class="tab ghost-center-wrap{{#if this.first}} active{{/if}}" data-target="{{this.slug}}" data-toggle="tab">
        <div class="ghost-center">
          <div class="sprite-holder"><i class="icon-{{this.icon}}"></i></div>
          <div class="l3 tab-label">{{this.label}}</div>
        </div>
      </div>{{/each}}
    </div>
  </div>

</div>

<div class="container padded">

  <div class="tab-content">

    <section class="tab-pane fade active in gallery{{#if all.simple}} gallery-simple{{/if}}" data-tab="all" data-five="{{all.columns.five}}" data-sort="{{all.sort}}">

      <p class="l4"><span class="text-dark">{{all.total}}</span> Products</p>
      <div class="products{{#if all.columns.five}} grid5{{/if}}">
          {{#each all.list}}
          <div class="gallery-item {{#if this.tile.large}}span3 h2 large{{/if}}{{#if this.tile.promo}}span2 promo{{/if}}{{#if this.tile.normal}}span1{{/if}} {{#if this.tile.copy}}promo-copy{{/if}}" data-priority="{{this.priority}}">
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
    </section>

    <section class="tab-pane fade gallery{{#if productCards.simple}} gallery-simple{{/if}}" data-tab="overhead" data-five="{{productCards.columns.five}}" data-sort="{{productCards.sort}}">
      {{#if productCards.filterSet}}
      <button class="js-filter-toggle btn">Filters</button>
      <div class="product-filter">
        <div class="filter-options row">

          
          {{#each productCards.filterSet}}

          {{#if this.type.range}}
          <div class="span3 filter-container">
            <span>{{this.label}}</span>
            <div class="range-control-wrap"><div class="range-control" data-filter="{{this.name}}" data-filter-type="range" data-min="{{this.min}}" data-max="{{this.max}}"></div></div>
            <div class="range-output"></div>
          </div>
          {{/if}}

          {{#if this.type.button}}
          <ul class="span3 filter-container unstyled" data-filter="{{this.name}}" data-filter-type="button">
            {{#each this.filters}}
            <li data-{{../name}}="{{this.value}}" class="btn">{{this.label}}</li>
            {{/each}}
          </ul>
          {{/if}}

          {{#if this.type.checkbox}}
          <ul class="span3 filter-container unstyled" data-filter="{{this.name}}" data-filter-type="checkbox">
            {{#each this.filters}}
            <li><label><input type="checkbox" value="{{this.value}}"> {{this.label}}</label></li>
            {{/each}}
          </ul>
          {{/if}}

          {{#if glen}}
          <ul class="span3 filter-container unstyled best-for">
            <li>Getting Close</li>
            <li>Adventurer</li>
            <li>Pocket Video</li>
          </ul>
          {{/if}}

          {{/each}}

        </div>
      </div>

      <div class="pull-right">
        <select>
          <option>Featured</option>
          <option>not featured</option>
          <option>featured and not featured</option>
        </select>
      </div>

      {{/if}}

      <p class="l4"><span class="text-dark">{{productCards.total}}</span> Products</p>
      <div class="products{{#if productCards.columns.five}} grid5{{/if}}">
        {{#each productCards.list}}
        <div class="span4 gallery-item" data-filter-set='{{{json this.filterSet}}}' data-priority="{{this.priority}}">
          {{#if this.label}}
          <span class="label">{{this.label}}</span>
          {{/if}}
          <div class="product-img ghost-center-wrap">
            <div class="ghost-center">
              <img src="{{this.img.src}}" alt="{{this.img.alt}}" width="{{this.img.width}}" height="{{this.img.height}}">
            </div>
          </div>
          <div class="product-content">
            <div class="p3 product-name">{{this.name}}</div>
            <div class="p5 product-model">{{this.model}}</div>
            <div class="p5 product-rating" data-stars="{{this.rating.stars}}"><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i> ( {{this.rating.reviews}} user reviews)</div>
            <ul class="p3 product-meta">
              {{#each this.meta}}
              <li>{{{this.value}}} <span class="product-meta-name">{{this.name}}</span></li>
              {{/each}}
            </ul>
            <div class="product-price">
              <p class="price"><span class="p5">Starting at</span> <span class="l2">${{this.price}}</span> <span class="p5 msrp">MSRP</span></p>
            </div>
          </div>
        </div>
        {{/each}}
        
      </div>
    </section>

    <section class="tab-pane fade gallery{{#if simple.simple}} gallery-simple{{/if}}" data-tab="inear" data-five="{{simple.columns.five}}" data-sort="{{simple.sort}}">
      {{#if simple.filterSet}}
      <button class="js-filter-toggle btn">Filters</button>
      <div class="product-filter">
        <div class="filter-options row">

          
          {{#each simple.filterSet}}

          {{#if this.type.range}}
          <div class="span3 filter-container">
            <span>{{this.label}}</span>
            <div class="range-control-wrap"><div class="range-control" data-filter="{{this.name}}" data-filter-type="range" data-min="{{this.min}}" data-max="{{this.max}}"></div></div>
            <div class="range-output"></div>
          </div>
          {{/if}}

          {{#if this.type.button}}
          <ul class="span3 filter-container unstyled" data-filter="{{this.name}}" data-filter-type="button">
            {{#each this.filters}}
            <li data-{{../name}}="{{this.value}}" class="btn">{{this.label}}</li>
            {{/each}}
          </ul>
          {{/if}}

          {{#if this.type.checkbox}}
          <ul class="span3 filter-container unstyled" data-filter="{{this.name}}" data-filter-type="checkbox">
            {{#each this.filters}}
            <li><label><input type="checkbox" value="{{this.value}}"> {{this.label}}</label></li>
            {{/each}}
          </ul>
          {{/if}}

          {{#if glen}}
          <ul class="span3 filter-container unstyled best-for">
            <li>Getting Close</li>
            <li>Adventurer</li>
            <li>Pocket Video</li>
          </ul>
          {{/if}}

          {{/each}}

        </div>
      </div>

      <div class="pull-right">
        <select>
          <option>Featured</option>
          <option>not featured</option>
          <option>featured and not featured</option>
        </select>
      </div>

      {{/if}}

      <p class="l4"><span class="text-dark">{{simple.total}}</span> Products</p>
      <div class="products grid5">
        {{#each simple.list}}
        <div class="span1 gallery-item" data-filter-set='{{{json this.filterSet}}}' data-priority="{{this.priority}}">
          {{#if this.label}}
          <span class="label">{{this.label}}</span>
          {{/if}}
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
        </div>
        {{/each}}
        
      </div>
    </section>

    <section class="tab-pane fade" data-tab="earclips">
      <div class="grid5">
        {{#each accessories}}
        <h2>{{{this.title}}}</h2>
        <div class="row">
          {{#each this.list}}
          <div class="span1 gallery-item">
            <div class="product-img ghost-center-wrap">
              <div class="ghost-center">
                <img src="{{this.img.src}}" alt="{{this.img.alt}}" width="{{this.img.width}}" height="{{this.img.height}}">
              </div>
            </div>
            <div class="product-content">
              <div class="p3 product-name">{{this.name}}</div>
              <div class="product-price">
                <p class="p5 price-title">Starting at</p>
                <p class="price"><span class="l2">${{this.price}}</span> <span class="p5 msrp">MSRP</span></p>
              </div>
            </div>
          </div>
          {{/each}}
          {{#if this.hasMore}}
          <div class="span1 gallery-item ghost-center-wrap see-all">
            <div class="ghost-center">
              <p>See all</p>
              <p class="text-number-callout-large">{{this.total}}</p>
            </div>
          </div>
          {{/if}}
        </div>
        {{/each}}
      </div>
    </section>

    <section class="tab-pane fade" data-tab="neck">
      <h3><code>data-tab="products-5"</code></h3>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse
      cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </section>

  </div>

  <section>
    <h1>Another section</h1>
    <p class="lead">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  </section>
</div>

<section>
  <div class="container">
    <h2>Griddlin'</h2>
    <div class="row">
      <div class="span3 box" style="height:20px;background:lightblue;"></div>
      <div class="span3 box" style="height:20px;background:lightblue;"></div>
      <div class="span3 box" style="height:20px;background:lightblue;"></div>
      <div class="span3 box" style="height:20px;background:lightblue;"></div>
      <div class="span3 box" style="height:20px;background:lightblue;"></div>
    </div>
  </div>
</section>