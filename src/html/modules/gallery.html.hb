
<div class="hero">
  <div class="hero-img-wrap">
    <img src="img/headphones-hero.jpg" alt="">
  </div>
  <div class="ghost-center-wrap hero-text-wrap">
    <div class="hero-text ghost-center">
      <div class="container-fluid">
        <div class="hidden-phone">Audio</div>
        <h1>Headphones</h1>
      </div>
    </div>
  </div>
</div>

<div class="tab-strip gallery-tabs">

  <div class="tab-nav-wrap container-fluid">
    <nav class="tab-nav-btns">
      <div class="tab-nav tab-nav-prev"></div>
      <div class="tab-nav tab-nav-next"></div>
    </nav>
  </div>

  <div class="tabs-container container-fluid">
    <div class="tabs">
      {{#each tabs}}<div class="tab ghost-center-wrap{{#if this.first}} active{{/if}}" data-target="{{this.slug}}" data-toggle="tab" data-hash="true">
        <div class="ghost-center">
          <div class="holder-for-icon"><i class="icon-tab-{{this.icon}}"></i></div>
          <div class="l3 tab-label">{{this.label}}</div>
        </div>
      </div>{{/each}}
    </div>
  </div>

</div>

<div class="tab-content">

  <div class="tab-pane fade active in" data-tab="{{tabs.[0].slug}}">
    {{#each featured}}
    <section class="container-fluid padded fade gallery" data-mode="{{this.mode}}">
      <h6>{{{this.title}}}</h6>
      <div class="products row-fluid">
          {{#each this.list}}
          <a class="gallery-item {{#if this.tile.large}}span3 h2 large{{/if}}{{#if this.tile.promo}}span2 promo{{/if}}{{#if this.tile.normal}}span1{{/if}}" data-priority="{{this.priority}}" href="{{#if this.href}}{{this.href}}{{else}}#{{/if}}">
            {{#if this.label}}
            <span class="label label-success">{{this.label}}</span>
            {{/if}}
            {{#if this.tile.promo}}
            <div class="product-img">
              <div class="iq-img" data-src="{{this.img.src}}"></div>
              <div class="product-content">
                <p class="text-promo-title"><strong>{{this.title}}</strong><br>{{this.emphasis}}</p>
                {{#if this.count}}<p class="text-count"><span class="number l2">{{this.count.number}}</span>&nbsp;<span class="text l3">{{this.count.text}}</span></p>{{/if}}
              </div>
            </div>
            {{else}}
            <div class="product-img ghost-center-wrap">
              <div class="ghost-center">
                {{#if this.imgCarousel}}
                  {{#each this.imgCarousel}}
                  <img class="iq-img" alt="{{this.alt}}" data-src="{{this.src}}">
                  <noscript>
                    <img src="{{this.src}}" alt="{{this.alt}}">
                  </noscript>
                  {{/each}}
                {{else}}
                <img class="iq-img" alt="{{this.img.alt}}" data-src="{{this.img.src}}">
                <noscript>
                  <img src="{{this.img.src}}" alt="{{this.img.alt}}">
                </noscript>
                {{/if}}
              </div>
            </div>
            <div class="product-content">
              <p class="p3 product-name">{{this.name}}</p>
              <div class="product-price">
                <p class="price"><span class="p5">Starting at</span> <span class="l2">${{this.price}}</span> <span class="p5 msrp">MSRP</span></p>
              </div>
            </div>

            {{/if}}
          </a>
          {{/each}}
      </div>

      <div class="see-all">
        <a class="btn btn-wide" href="#">{{{this.callout}}}</a>
      </div>

    </section>
    {{/each}}

    <!-- <div class="text-center"><button class="btn gallery-load-more">Clone some</button></div> -->
  </div>

  <div class="tab-pane fade" data-tab="{{tabs.[1].slug}}">
    <section class="gallery" data-mode="{{productCards.mode}}">
      {{#if productCards.filterSet}}
      
      <div class="filter-display-bar slide-toggle-parent container-fluid padded">
        {{#if productCards.sortSet}}
        <div class="sort-options pull-right">
          <span class="l4">Sort By:&nbsp;</span>
          <div class="dropdown dropdown-alt ib hidden-phone">
            <button class="btn btn-small dropdown-toggle dropdown-toggle-alt" data-toggle="dropdown"><span class="js-toggle-text">{{productCards.sortSet.[0].label}}</span> <i class="icon-ui-arrowheads-up-down-gray"></i></button>
            <ul class="dropdown-menu dropdown-menu-alt pull-right" role="menu">
            {{#each productCards.sortSet}}
              <li><a data-value="{{this.name}}" data-reverse="{{this.reverse}}" tabindex="-1" href="#">{{this.label}}</a></li>
            {{/each}}
            </ul>
          </div>

          <select class="native-dropdown visible-phone">
            {{#each productCards.sortSet}}
            <option value="{{this.name}}" data-reverse="{{this.reverse}}">{{this.label}}</option>
            {{/each}}
          </select>
        </div>
        {{/if}}

        <p class="ib"><span class="text-dark product-count">{{productCards.total}}</span> Products</p>
        <button class="btn btn-alt-special slide-toggle collapsed" data-toggle="collapse" data-target="#{{productCards.name}}-filters">Filter</button>
        <button class="btn btn-alt-special btn-alt-plus js-compare-toggle" data-target="#compare-tool">Compare</button>
      </div>

      <div class="container-fluid padded slide-arrow-under fade">
        <div class="relative">
          <div class="slide-toggle-arrow"></div>
        </div>
      </div>
      <div class="container-fluid padded slide-arrow-over fade">
        <div class="relative">
          <div class="slide-toggle-arrow"></div>
        </div>
      </div>

      <div class="collapse slide-toggle-target" id="{{productCards.name}}-filters">
        <div class="filter-options container-fluid padded">
          <div class="row-fluid">
            <div class="span8 regular-filters">
            {{#each productCards.filterSet}}
              {{#if this.type.color}}
              <div class="span6 filter-container">
                <p class="l3">{{this.label}}</p>
                <ul class="unstyled color-swatches" data-filter="{{this.name}}" data-filter-type="color">
                  {{#each this.filters}}<li class="swatch-{{this.value}}" data-label="{{this.label}}" data-{{../name}}="{{this.value}}"></li>{{/each}}
                </ul>
              </div>
              {{/if}}

              {{#if this.type.range}}
              <div class="span6 filter-container">
                <p class="l3">{{this.label}}</p>
                <div class="range-output-container">
                  <div class="range-output-min"></div>
                  <div class="range-output-max"></div>
                </div>
                <div class="range-control-wrap"><div class="range-control" data-label="{{this.label}}" data-filter="{{this.name}}" data-filter-type="range" data-min="{{this.min}}" data-max="{{this.max}}"></div></div>
              </div>
              {{/if}}

              {{#if this.type.button}}
              <div class="span6 filter-container">
                <p class="l3">{{this.label}}</p>
                <ul class="unstyled btn-group" data-filter="{{this.name}}" data-filter-type="button">
                  {{#each this.filters}}<li class="btn btn-square" data-label="{{this.label}}" data-{{../name}}="{{this.value}}">{{this.label}}</li>{{/each}}
                </ul>
              </div>
              {{/if}}

              {{#if this.type.checkbox}}
              <div class="span6 filter-container">
                <p class="l3">{{this.label}}</p>
                <ul class="unstyled" data-filter="{{this.name}}" data-filter-type="checkbox">
                  {{#each this.filters}}
                  <li class="control-inline"><input class="styled-checkbox" id="{{../name}}-{{this.value}}" data-label="{{this.label}}" type="checkbox" value="{{this.value}}"><label for="{{../name}}-{{this.value}}">{{this.label}}</label></li>
                  {{/each}}
                </ul>
              </div>
              {{/if}}
            {{/each}}
            </div>

            {{#each productCards.filterSet}}
            {{#if this.type.group}}
            <div class="span4 best-for filter-container">
              <p class="l3">{{this.label}}</p>
              <ul class="media-list" data-filter="{{this.name}}" data-filter-type="group">
                {{#each this.filters}}
                <li class="media clearfix" data-label="{{this.label}}" data-{{../name}}="{{this.value}}">
                  <div class="pull-left">
                    <button class="btn btn-square media-object"><i class="icon-bestfor-{{this.icon}}"></i></button>
                  </div>
                  <div class="media-body">
                    <p class="media-heading p3 text-dark">{{this.label}}</p>
                    <p class="p3">{{this.description}}</p>
                  </div>
                </li>
                {{/each}}
              </ul>
            </div>
            {{/if}}
            {{/each}}

          </div>
        </div>
      </div>
      {{/if}}


      <div class="container-fluid padded active-filters"></div>

      <div class="container-fluid padded">
        <div class="products row-fluid">
          {{#each productCards.list}}
          <a class="span4 gallery-item" data-filter-set='{{{json this.filterSet}}}' data-priority="{{this.priority}}" itemscope itemtype="http://schema.org/Product" itemprop="url" href="{{#if this.href}}{{this.href}}{{else}}#{{/if}}">
            {{#if this.label}}
            <span class="label label-success">{{this.label}}</span>
            {{/if}}
            <div class="product-img">
              <div class="ghost-center-wrap">
                <div class="ghost-center js-product-imgs">
                  <img class="iq-img js-product-img-main" itemprop="image" alt="{{this.img.alt}}" data-src="{{this.img.src}}">
                  <noscript>
                    <img src="{{this.img.src}}" itemprop="image" alt="{{this.img.alt}}">
                  </noscript>
                  {{#each this.img.colors}}
                  <img class="iq-img hidden" itemprop="image" data-color="{{this.color}}" alt="{{this.alt}}" data-src="{{this.src}}">
                  <noscript>
                    <img class="hidden" itemprop="image" src="{{this.src}}" alt="{{this.alt}}">
                  </noscript>
                  {{/each}}
                </div>
              </div>
              {{#if this.img.colors}}
              <div class="color-swatches">
                {{#each this.img.colors}}<span class="mini-swatch swatch-{{this.color}}" data-color="{{this.color}}" itemprop="color">{{this.color}}</span>{{/each}}
              </div>
              {{/if}}
            </div>
            <div class="product-content">
              <div class="p3 product-name" itemprop="name">{{this.name}}</div>
              <div class="p5 product-model" itemprop="model">{{this.model}}</div>
              <div class="p5 product-rating" data-stars="{{this.rating.stars}}" itemprop="reviews" itemscope itemtype="http://schema.org/AggregateRating">
                <meta itemprop="ratingValue" content="{{this.rating.stars}}">
                <i class="icon-ui-star"></i
                ><i class="icon-ui-star"></i
                ><i class="icon-ui-star"></i
                ><i class="icon-ui-star"></i
                ><i class="icon-ui-star"></i>
                ( <span itemprop="ratingCount">{{this.rating.reviews}}</span> user reviews)
              </div>
              <ul class="p3 product-meta">
                {{#each this.meta}}
                <li>{{{this.value}}} <span class="product-meta-name">{{this.name}}</span></li>
                {{/each}}
              </ul>
              <div class="product-price">
                <p class="price"><span class="p5">Starting at</span> <span class="l2" itemprop="price">${{this.price}}</span> <span class="p5 msrp">MSRP</span></p>
              </div>
            </div>
          </a>
          {{/each}}
          
        </div>
      </div>

      {{#if productCards.nextLink}}
      <div class="navigation invisible">
        <a href="{{productCards.nextLink}}">Camera Overflow</a>
      </div>
      <div class="infscr-holder text-center"></div>
      {{/if}}
    </section>
  </div>

  <div class="tab-pane fade" data-tab="{{tabs.[2].slug}}">
    <section>
      <div class="slide-toggle-parent container-fluid padded">
        <button class="btn btn-alt-special slide-toggle collapsed" data-toggle="collapse" data-target="#IDGOESHERE">Accessory Finder</button>
      </div>

      <div class="container-fluid padded slide-arrow-under fade">
        <div class="relative">
          <div class="slide-toggle-arrow"></div>
        </div>
      </div>
      <div class="container-fluid padded slide-arrow-over fade">
        <div class="relative">
          <div class="slide-toggle-arrow"></div>
        </div>
      </div>

      <div class="collapse slide-toggle-target" id="IDGOESHERE">
        <div class="container-fluid padded">
          <h1>Collapse</h1>
          <h2>Collapse</h2>
          <h3>Collapse</h3>
          <h4>Collapse</h4>
          <h5>Collapse</h5>
          <h6>Collapse</h6>
        </div>
      </div>

      <div class="grid5 container-fluid padded">
        {{#each accessories}}
        <div class="product-strip-wrap">
          <a class="tl pull-right" href="#">{{{this.callout}}}</a>
          <h6 class="product-strip-heading">{{{this.title}}}</h6>
          <div class="product-strip row-fluid">
            {{#each this.list}}
            <a class="span1 gallery-item" href="#">
              <div class="product-img">
                <div class="ghost-center-wrap">
                  <div class="ghost-center">
                    <img class="iq-img" alt="{{this.img.alt}}" data-src="{{this.img.src}}">
                    <noscript>
                      <img src="{{this.img.src}}" alt="{{this.img.alt}}">
                    </noscript>
                  </div>
                </div>
              </div>
              <div class="product-content">
                <div class="p3 product-name">{{this.name}}</div>
                <div class="product-price">
                  <p class="p5 price-title">Starting at</p>
                  <p class="price"><span class="l2">${{this.price}}</span> <span class="p5 msrp">MSRP</span></p>
                </div>
              </div>
            </a>
            {{/each}}
          </div>
        </div>
        {{/each}}
      </div>
    </section>
  </div>

  <!--
  <section class="tab-pane fade gallery" data-tab="simple" data-mode="{{simple.mode}}">
    {{#if simple.filterSet}}
    <div class="container-fluid padded">
      <button class="btn slide-toggle collapsed" data-toggle="collapse" data-target="#{{simple.name}}-filters">Filter Results</button>
      <span class="active-filters"></span>
    </div>
    <div class="collapse product-filter" id="{{simple.name}}-filters">
      <div class="filter-options container-fluid padded">
        <div class="row-fluid">
          {{#each simple.filterSet}}

          {{#if this.type.color}}
          <div class="span4 filter-container">
            <p class="l3">{{this.label}}</p>
            <ul class="unstyled color-swatches" data-filter="{{this.name}}" data-filter-type="color">
              {{#each this.filters}}<li class="swatch-{{this.value}}" data-label="{{this.label}}" data-{{../name}}="{{this.value}}"></li>{{/each}}
            </ul>
          </div>
          {{/if}}

          {{#if this.type.range}}
          <div class="span4 filter-container">
            <p class="l3">{{this.label}}</p>
            <div class="range-control-wrap"><div class="range-control" data-label="{{this.label}}" data-filter="{{this.name}}" data-filter-type="range" data-min="{{this.min}}" data-max="{{this.max}}"></div></div>
            <div class="range-output"></div>
          </div>
          {{/if}}

          {{#if this.type.button}}
          <div class="span4 filter-container">
            <p class="l3">{{this.label}}</p>
            <ul class="unstyled btn-group" data-filter="{{this.name}}" data-filter-type="button">
              {{#each this.filters}}<li class="btn btn-square" data-label="{{this.label}}" data-{{../name}}="{{this.value}}">{{this.label}}</li>{{/each}}
            </ul>
          </div>
          {{/if}}

          {{#if this.type.checkbox}}
          <div class="span4 filter-container">
            <p class="l3">{{this.label}}</p>
            <ul class="unstyled" data-filter="{{this.name}}" data-filter-type="checkbox">
              {{#each this.filters}}
              <li class="control-inline"><input class="styled-checkbox" id="{{../name}}-{{this.value}}" data-label="{{this.label}}" type="checkbox" value="{{this.value}}"><label for="{{../name}}-{{this.value}}">{{this.label}}</label></li>
              {{/each}}
            </ul>
          </div>
          {{/if}}

          {{#if this.type.group}}
          <div class="span4 filter-container">
            <p class="l3">{{this.label}}</p>
            <ul class="media-list" data-filter="{{this.name}}" data-filter-type="group">
              {{#each this.filters}}
              <li class="media clearfix" data-label="{{this.label}}" data-{{../name}}="{{this.value}}">
                <div class="pull-left">
                  <button class="btn btn-square media-object"><i class="icon-bestfor-{{this.icon}}"></i></button>
                </div>
                <div class="media-body">
                  <p class="media-heading p3 text-dark">{{this.label}}</p>
                  <p class="p3">{{this.description}}</p>
                </div>
              </li>
              {{/each}}
            </ul>
          </div>
          {{/if}}

          {{/each}}
        </div>
      </div>
    </div>
    {{/if}}

    <div class="gallery-title-bar container-fluid padded">
      {{#if simple.sortSet}}
      <div class="sort-options pull-right">
        <span class="l4">Sort By:&nbsp;</span>
        <div class="dropdown">
          <button class="btn dropdown-toggle dropdown-toggle-alt" data-toggle="dropdown"><span class="js-toggle-text">{{simple.sortSet.[0].label}}</span> <i class="icon-ui-arrowheads-up-down-gray"></i></button>
          <ul class="dropdown-menu" role="menu">
          {{#each simple.sortSet}}
            <li><a data-value="{{this.name}}" data-reverse="{{this.reverse}}" tabindex="-1" href="#">{{this.label}}</a></li>
          {{/each}}
          </ul>
        </div>

        <select class="native-dropdown visible-phone">
          {{#each simple.sortSet}}
          <option value="{{this.name}}" data-reverse="{{this.reverse}}">{{this.label}}</option>
          {{/each}}
        </select>
      </div>
      {{/if}}


      <p class="l4"><span class="text-dark product-count">{{simple.total}}</span> Products</p>
    </div>
    <div class="container-fluid padded">
      <div class="products row-fluid">
        {{#each simple.list}}
        <div class="span1 gallery-item" data-filter-set='{{{json this.filterSet}}}' data-priority="{{this.priority}}">
          {{#if this.label}}
          <span class="label label-success">{{this.label}}</span>
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
          </div>-->
          <!-- <i class="icon-ui-favorite{{#if this.isFavorited}} state3{{/if}} js-favorite"></i> -->
        <!-- </div>
        {{/each}}
        
      </div>
    </div>
  </section> -->

</div>

<div id="compare-tool" class="modal takeover hide fade" tabindex="-1" role="dialog" aria-labelledby="compare-tool-label" aria-hidden="true">
  <div class="modal-header container-fluid">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
    <h3 class="ib" id="compare-tool-label"><span class="js-compare-count">0</span>&nbsp;Products</h3>
    <button class="btn btn-small">Reset</button>
  </div>
  <div class="modal-body container-fluid"></div>
  <!-- <div class="modal-footer">
    <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
    <button class="btn btn-primary">Save changes</button>
  </div> -->
</div>



<div style="padding-bottom:100px"></div>
