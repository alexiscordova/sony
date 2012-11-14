
<div class="hero">
  <img src="http://placekitten.com/1170/400" alt="">
  <div class="container">
    <div class="ghost-center-wrap full">
      <div class="hero-text ghost-center">
        <div class="hidden-phone">Cameras</div>
        <h1>Cyber-shot</h1>
        <h2>On the go shooting</h2>
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
      <div class="tab active" data-target="products-1" data-toggle="tab">
        All
      </div><div class="tab" data-target="products-2" data-toggle="tab">
        Cameras
      </div><div class="tab" data-target="products-3" data-toggle="tab">
        Accesories
      </div><div class="tab" data-target="products-4" data-toggle="tab">
        Lorem-4
      </div><div class="tab" data-target="products-5" data-toggle="tab">
        Lorem-5
      </div><div class="tab" data-target="products-6" data-toggle="tab">
        Lorem-6
      </div><div class="tab" data-target="products-7" data-toggle="tab">
        Lorem-7
      </div><div class="tab" data-target="products-8" data-toggle="tab">
        Lorem-8
      </div>
    </div>
  </div>

</div>

<div class="container padded">

  <div class="tab-content">

    <section class="tab-pane fade active in gallery all" data-tab="products-1">
      {{#if all.filters}}
      <button class="js-filter-toggle btn">Filters</button>
      <div class="product-filter">
        <div class="filter-options row">

          <div class="span3">
            <span>Price</span>
            <div class="range-control-wrap"><div class="range-control price-range-control"></div></div>
            <div class="price-range-output"></div>
          </div>

          <ul class="span3 unstyled megapixels">
            <li data-megapixels="14-16" class="btn">14-16MP</li>
            <li data-megapixels="16-18" class="btn">16-18MP</li>
            <li data-megapixels="18-20" class="btn">18-20MP</li>
            <li data-megapixels="20+" class="btn">20MP+</li>
          </ul>

          <ul class="span3 unstyled features">
            <li>
              <label><input type="checkbox" value="lcd"> LCD</label>
            </li>
            <li>
              <label><input type="checkbox" value="touchscreen"> Touchscreen LCD</label>
            </li>
            <li>
              <label><input type="checkbox" value="panorama"> Intelligent Sweep Panorama</label>
            </li>
            <li>
              <label><input type="checkbox" value="lightweight"> Lightweight</label>
            </li>
          </ul>

          <ul class="span3 unstyled best-for">
            <li>Getting Close</li>
            <li>Adventurer</li>
            <li>Pocket Video</li>
          </ul>

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

      <h3>{{all.total}} Products</h3>

      <div class="products grid5" data-filters="{{all.filters}}">
          {{#each all.list}}
          <div class="gallery-item {{#if this.tile.large}}span3 h2 large{{/if}}{{#if this.tile.promo}}span2 promo{{/if}}{{#if this.tile.normal}}span1{{/if}} {{#if this.tile.copy}}promo-copy{{/if}}" data-groups="{{this.categories}}" data-megapixels="{{this.megapixels}}" data-price="{{this.price}}" data-priority="{{this.priority}}">
            {{#if this.tile.promo}}
              {{#if this.tile.copy}}
              <h3>{{this.title}}</h3>
              <p class="p2">{{this.text}}</p>
              {{else}}
              <div class="product-img">
                <img src="{{this.img.src}}" alt="{{this.img.alt}}">
                <div class="product-content">
                  <p class="text-promo-title"><strong>{{this.title}}</strong><br>{{this.subtitle}}</p>
                  <a class="btn" href="#">{{this.callout}}</a>
                </div>
              </div>  
              {{/if}}
            {{else}}
            <div class="product-img table-center-wrap">
              <img class="table-center" src="{{this.img.src}}" alt="{{this.img.alt}}">
            </div>
            <div class="product-content">
              <p class="p3 product-name">{{this.name}}</p>
              <div class="product-price">
                <span class="p5 muted">Starting at</span>
                <br>
                <b class="p2">${{this.price}}</b> <span class="p5 muted">MSRP</span>
              </div>
            </div>

            {{/if}}
          </div>
          {{/each}}
          

      </div>
    </section>

    <section class="tab-pane fade gallery simple-gallery" data-tab="products-2">
      <button class="js-filter-toggle btn">Filters</button>
      <div class="product-filter">
        <div class="filter-options row">

          <div class="span3">
            <span>Price</span>
            <div class="range-control-wrap"><div class="range-control price-range-control"></div></div>
            <div class="price-range-output"></div>
          </div>

          <ul class="span3 unstyled megapixels">
            <li data-megapixels="14-16" class="btn">14-16MP</li>
            <li data-megapixels="16-18" class="btn">16-18MP</li>
            <li data-megapixels="18-20" class="btn">18-20MP</li>
            <li data-megapixels="20+" class="btn">20MP+</li>
          </ul>

          <ul class="span3 unstyled features">
            <li>
              <label><input type="checkbox" value="lcd"> LCD</label>
            </li>
            <li>
              <label><input type="checkbox" value="touchscreen"> Touchscreen LCD</label>
            </li>
            <li>
              <label><input type="checkbox" value="panorama"> Intelligent Sweep Panorama</label>
            </li>
            <li>
              <label><input type="checkbox" value="lightweight"> Lightweight</label>
            </li>
          </ul>

          <ul class="span3 unstyled best-for">
            <li>Getting Close</li>
            <li>Adventurer</li>
            <li>Pocket Video</li>
          </ul>

        </div>
      </div>

      <div class="pull-right">
        <select>
          <option>Featured</option>
          <option>not featured</option>
          <option>featured and not featured</option>
        </select>
      </div>
      <h3>{{cameras.total}} Products</h3>
      <div class="products">
        {{#each cameras.list}}
        <div class="span4 gallery-item" data-groups="{{this.categories}}" data-megapixels="{{this.megapixels}}" data-price="{{this.price}}">
          <div class="product-img">
            <img src="{{this.img.src}}" alt="{{this.img.alt}}">
          </div>
          <div class="product-content">
            <div class="product-model">{{this.model}}</div>
            <div class="product-name">{{this.name}}</div>
            <div class="product-rating">{{this.rating.stars}}* ({{this.rating.reviews}})</div>
            <ul class="product-meta">
              {{#each this.meta}}
              <li>{{{this.value}}} <span class="product-meta-name">{{this.name}}</span></li>
              {{/each}}
            </ul>
            <div class="product-price">
              <span class="muted">Starting at</span>
              <br>
              <b>${{this.price}}</b> <span class="muted">MSRP</span>
            </div>
          </div>
        </div>
        {{/each}}
        
      </div>

    </section>

    <section class="tab-pane fade" data-tab="products-3">
      {{#each accessories}}
      <h2>{{{this.title}}}</h2>
      <div class="row">
        {{#each this.list}}
        <div class="span2" style="height:300px;">
          <div class="product-img">
            <img src="{{this.img.src}}" alt="{{this.img.alt}}">
          </div>
          <div class="product-content">
            <div class="product-name">{{this.name}}</div>
            <div class="product-price">
              <span class="muted">Starting at</span>
              <br>
              <b>${{this.price}}</b> <span class="muted">MSRP</span>
            </div>
          </div>
        </div>
        {{/each}}
        {{#if this.hasMore}}
        <div class="span2 ghost-center-wrap see-all" style="height:300px;text-align:center;">
          <div class="ghost-center">
            <p>See all</p>
            <p class="l1">{{this.total}}</p>
          </div>
        </div>
        {{/if}}
      </div>
      {{/each}}
    </section>

    <section class="tab-pane fade" data-tab="products-4">
      <h3><code>data-tab="products-4"</code></h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
      quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
      cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </section>

    <section class="tab-pane fade" data-tab="products-5">
      <h3><code>data-tab="products-5"</code></h3>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse
      cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </section>

    <section class="tab-pane fade" data-tab="products-6">
      <h3><code>data-tab="products-6"</code></h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et doloamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
      cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </section>

    <section class="tab-pane fade" data-tab="products-7">
      <h3><code>data-tab="products-7"</code></h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
      quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit es.</p>
    </section>

    <section class="tab-pane fade" data-tab="products-8">
      <h3><code>data-tab="products-8"</code></h3>
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
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