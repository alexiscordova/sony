
<h1>Cameras Overflow Page 2</h1>
<section class="gallery" data-mode="{{productCards.mode}}">
      {{#if productCards.filterSet}}
      
      <div class="filter-display-bar container-fluid padded">
        {{#if productCards.sortSet}}
        <div class="sort-options pull-right">
          <span class="l4">Sort By:&nbsp;</span>
          <div class="dropdown ib hidden-phone">
            <button class="btn dropdown-toggle dropdown-toggle-alt" data-toggle="dropdown"><span class="js-toggle-text">{{productCards.sortSet.[0].label}}</span> <i class="icon-ui-arrowheads-up-down-gray"></i></button>
            <ul class="dropdown-menu" role="menu">
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
        <button class="btn btn-alt-special compare-toggle">Compare</button>
      </div>

      <div class="container-fluid padded filter-arrow-under fade"><div class="filter-container-arrow"></div></div>
      <div class="container-fluid padded filter-arrow-over fade"><div class="filter-container-arrow"></div></div>

      <div class="collapse product-filter" id="{{productCards.name}}-filters">
        <div class="filter-options container-fluid padded">
          <div class="row-fluid">
            {{#each productCards.filterSet}}

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


      <div class="container-fluid padded active-filters"></div>

      <div class="container-fluid padded">
        <div class="products row-fluid">
          {{#each productCards.list}}
          <div class="span4 gallery-item" data-filter-set='{{{json this.filterSet}}}' data-priority="{{this.priority}}">
            {{#if this.label}}
            <span class="label label-success">{{this.label}}</span>
            {{/if}}
            <div class="product-img">
              <div class="ghost-center-wrap">
                <div class="ghost-center">
                  <img class="iq-img" alt="{{this.img.alt}}" data-src="{{this.img.src}}">
                  <noscript>
                    <img src="{{this.img.src}}" alt="{{this.img.alt}}">
                  </noscript>
                </div>
              </div>
              {{#if this.colors}}
              <div class="color-swatches">
                {{#each this.colors}}<span class="mini-swatch swatch-{{this}}"></span>{{/each}}
              </div>
              {{/if}}
            </div>
            <div class="product-content">
              <div class="p3 product-name">{{this.name}}</div>
              <div class="p5 product-model">{{this.model}}</div>
              <div class="p5 product-rating" data-stars="{{this.rating.stars}}">
                <i class="icon-ui-star"></i
                ><i class="icon-ui-star"></i
                ><i class="icon-ui-star"></i
                ><i class="icon-ui-star"></i
                ><i class="icon-ui-star"></i>
                ( {{this.rating.reviews}} user reviews)
              </div>
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
      </div>

      {{#if productCards.nextLink}}
      <div class="navigation invisible">
        <a href="{{productCards.nextLink}}">Camera Overflow</a>
      </div>
      <div class="infscr-holder text-center"></div>
      {{/if}}
    </section>
    