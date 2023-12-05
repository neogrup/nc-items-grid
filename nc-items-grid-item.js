import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/iron-list/iron-list.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/paper-fab/paper-fab.js';
import '@polymer/iron-icons/iron-icons.js';
import { MutableData } from '@polymer/polymer/lib/mixins/mutable-data.js';
import { AppLocalizeBehavior } from '@polymer/app-localize-behavior/app-localize-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import {formatMoney} from 'accounting-js';

class NcItemsGridItem extends mixinBehaviors([AppLocalizeBehavior], MutableData(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host{
          --item-content-background-image: none;
          --item-content-background-color: transparent;
          --item-content-color: black;
          --item-content-width: 100px;
          --item-content-height: 100px;

          --item-content-icon-width: 24px;
          --item-content-icon-height: 24px;

          --item-content-border-radius: 5px;
          --item-content-icon-content-border-radius: 15px;
          --item-content-box-shadow: none;

          --item-content-kiosk-header-height: 20px;
          --item-content-kiosk-image-height: 80px;
          --item-content-kiosk-footer-height: 20px;

          --item-margin: 2px;

          --item-content-folder-font-size: 1.3em;
          --item-content-default-font-size: 1em;
          --item-content-default-price-font-size: 1em;
          --item-content-default-used-qty-font-size: 1.1em;
        }

        :host([item-selected]) > div.item-container > div.default, :host([item-selected]) > div.item-container > div.item-content-icon-content {
          /* filter: brightness(90%); */
          /* filter: drop-shadow(1px 1px  var(--app-secondary-color, #253855)); */
          /* box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14),
                      0 1px 18px 0 rgba(0, 0, 0, 0.12),
                      0 3px 5px -1px rgba(0, 0, 0, 0.4); */
          background-color: var(--app-accent-color, #FF9800);
          border-color: black;
          box-shadow: inset 0px 0px 0px 2px var(--app-accent-color, #FF9800);
          font-weight: bolder;
        }


        .item-container{
          -webkit-touch-callout: none; /* iOS Safari */
          -webkit-user-select: none; /* Safari */
          -khtml-user-select: none; /* Konqueror HTML */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently
                                    supported by Chrome and Opera */
        }

        .item-content {
          border-radius: var(--item-content-border-radius);
          overflow: hidden;
          position: relative;
          width: var(--item-content-width);
          height: var(--item-content-height);
          margin: var(--item-margin);
          cursor: pointer;
          border: 1px solid var(--app-secondary-color, #253855);
          box-shadow: var(--item-content-box-shadow);
        }

        .item-content-icon-content {
          border-radius: var(--item-content-icon-content-border-radius);
          overflow: hidden;
          position: relative;
          width: var(--item-content-width);
          height: var(--item-content-height);
          margin: var(--item-margin);
          cursor: pointer;
          border: 1px solid var(--app-secondary-color, #253855);
          box-shadow: var(--item-content-box-shadow);
          background-color: var(--item-content-background-color);
          color: var(--item-content-color);
          font-size: var(--item-content-default-font-size);
          @apply --layout-vertical;
          @apply --layout-center-justified;
          @apply --layout-center;
        }

        .item-content-icon > iron-icon{
          width: var(--item-content-icon-width);
          height: var(--item-content-icon-height);
          color: #424242;
        }

        .item-content-icon-name {
          white-space: pre-line;
          width: 100%;
          text-align: center;
          overflow: hidden;
          padding: 5px 0;
          z-index: 1;
        }

        .item-content-kiosk {
          border-radius: 100px;
          overflow: hidden;
          position: relative;
          width: var(--item-content-width);
          height: var(--item-content-height);
          margin: var(--item-margin);
          cursor: pointer;
          border: 1px solid #c9c9c9;
          box-shadow: var(--item-content-box-shadow);
        }

        .next-button{
          border-color: transparent;
          background-color: transparent;
          box-shadow: none;
          @apply --layout-horizontal;
          @apply --layout-center-justified;
          @apply --layout-center;
        }

        .next-button-kiosk{
          background-color: #c9c9c9;
          color: black;
          font-size: var(--item-content-folder-font-size);
          text-transform: uppercase;
          height: calc(var(--item-content-height) - 40px);
          margin-top: calc(var(--item-margin) + 20px);
          @apply --layout-horizontal;
          @apply --layout-center-justified;
          @apply --layout-center;
        }

        .previous-button{
          border-color: transparent;
          background-color: transparent;
          box-shadow: none;
          @apply --layout-horizontal;
          @apply --layout-center-justified;
          @apply --layout-center;
        }

        .previous-button-kiosk{
          background-color: #c9c9c9;
          color: black;
          font-size: var(--item-content-folder-font-size);
          text-transform: uppercase;
          height: calc(var(--item-content-height) - 40px);
          margin-top: calc(var(--item-margin) + 20px);
          @apply --layout-horizontal;
          @apply --layout-center-justified;
          @apply --layout-center;
        }


        .parent-folder{
          border-color: transparent;
          background-color: transparent;
          box-shadow: none;
          @apply --layout-horizontal;
          @apply --layout-center-justified;
          @apply --layout-center;
        }

        .parent-folder-kiosk{
          background-color: #c9c9c9;
          color: black;
          font-size: var(--item-content-folder-font-size);
          text-transform: uppercase;
          height: calc(var(--item-content-height) - 40px);
          margin-top: calc(var(--item-margin) + 20px);
          @apply --layout-horizontal;
          @apply --layout-center-justified;
          @apply --layout-center;
        }

        .folder{
          border-color: var(--app-secondary-color, #253855);
          background-color: var(--app-secondary-color, #253855);
          background-image: var(--item-content-background-image);
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          overflow: hidden;
          color: white;
          font-size: var(--item-content-folder-font-size);
        }

        .default{
          border-color: var(--app-secondary-color, #253855);
          background-image: var(--item-content-background-image);
          background-color: var(--item-content-background-color);
          color: var(--item-content-color);
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          font-size: var(--item-content-default-font-size);
        }


        .item-content-kiosk-header{
          height: var(--item-content-kiosk-header-height);
          background: #FFA726;
          @apply --layout-horizontal;
          @apply --layout-center-justified;
          @apply --layout-center;
          padding: 0 10px;
        }

        .item-content-kiosk-header-price{
          /* @apply --layout-flex; */
          /* text-align: right; */
          font-size: 1.5em;
          font-weight: bolder;
          overflow: hidden;
          color: white;
          color: black;
        }

        .item-content-kiosk-header-info{
          position: absolute;
          left: 0;
          margin-left: 5px;
          text-align: center;
          width: fit-content;
          vertical-align: middle;
          padding: 2px;
          z-index: 3;
        }

        .item-content-kiosk-header-info > iron-icon{
          height: 36px;
          width: 36px;
          color: #FFCC80;
        }

        .item-content-kiosk-header-used-qty{
          position: absolute;
          right: 0;
          margin-right: 5px;
          text-align: center;
          min-width: 15px;
          width: fit-content;
          vertical-align: middle;
          padding: 2px;
          border-radius: 25%;
          border: 2px solid black;
          background: white;
          font-size: 1.5em;
          font-weight: bolder;
          z-index: 3;
        }
        
        .item-content-kiosk-header-used-qty:empty{
          background: transparent;
        }

        .item-content-kiosk-image{
          height: var(--item-content-kiosk-image-height);
        }

        .item-content-kiosk-footer{
          height: var(--item-content-kiosk-footer-height);
          background-color: #FFA726;
          @apply --layout-horizontal;
          @apply --layout-center-justified;
          @apply --layout-center;
          text-align: center;
          padding: 0 10px;
        }

        .item-content-kiosk-footer-name{
          font-size: 1.3em;
          color: white;
          color: black;
          overflow: hidden;
        }

        :host([item-selected]) > div.item-container > div.default > div.item-content-name {
          background: rgba(255, 152, 0, 0.85);
          /* background: #FF9800D9; */
        }

        .item-content-name {
          white-space: pre-line;
          vertical-align: middle;
          width: 100%;
          text-align: center;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(37, 56, 85, 0.85);
          /* background: #253855D9; */
          color: white;
          overflow: hidden;
          padding: 5px 0;
          z-index: 1;
        }

        :host([item-selected]) > div.item-container > div.default > div.item-content-name-center {
          /* font-weight: bolder; */
        }

        .item-content-name-center {
          white-space: pre-line;
          vertical-align: middle;
          width: 100%;
          text-align: center;
          position: absolute;
          top: 50%;
          transform: translate(0,-50%);
          overflow: hidden;
          padding: 5px 0;
          z-index: 1;
        }
        

        .item-content-header{
          @apply --layout-horizontal;
        }
        
        .item-content-header-used-qty{
          position: absolute;
          left:0;
          right:0;
          margin-left:auto;
          margin-right:auto;
          text-align: center;
          min-width: 15px;
          width: fit-content;
          vertical-align: middle;
          padding: 2px;
          border-radius: 25%;
          border: 2px solid white;
          background: var(--app-accent-color, #FF9800);
          font-size: var(--item-content-default-used-qty-font-size);
          font-weight: bolder;
          z-index: 3;
        }
        
        .item-content-header-used-qty:empty{
          background: transparent;
        }

        .item-content-header-price{
          position: absolute;
          top: 0;
          right: 0;
          text-align: center;
          min-width: 15px;
          width: fit-content;
          vertical-align: middle;
          background: rgba(37, 56, 85, 0.9);
          color: white;
          padding: 2px;
          border-radius: 25%;
          font-size: var(--item-content-default-price-font-size);
          z-index: 2;
        } 
        .item-content-header-price:empty{
          background: transparent;
        }

        .required{
          color :red;
        }

        paper-fab.parent-folder-paper-fab {
          --paper-fab-background: var(--app-accent-color, #FF9800);
          --paper-fab-keyboard-focus-background: var(--app-accent-color, #FF9800);
        }

        paper-fab.next-paper-fab {
          --paper-fab-background: var(--app-secondary-color, #253855);
          --paper-fab-keyboard-focus-background: var(--app-secondary-color, #253855);
        }

        paper-fab.previous-paper-fab {
          --paper-fab-background: var(--app-secondary-color, #253855);
          --paper-fab-keyboard-focus-background: var(--app-secondary-color, #253855);
        }

      </style>

      <div class="item-container" on-click="_selectItem">
        <template is="dom-if" if="[[_checkType('parentFolder', itemData.type)]]">
          <div class$="{{parentFolderClassName}}">
            <template is="dom-if" if="[[animations]]">
              <paper-ripple></paper-ripple>
            </template>
            <template is="dom-if" if="[[!_checkViewMode('kiosk')]]">
              <paper-fab class="parent-folder-paper-fab" icon="chevron-left"></paper-fab>
            </template>
            <template is="dom-if" if="[[_checkViewMode('kiosk')]]">
              <div>[[localize('ITEM_GRID_PARENT_FOLDER')]]</div>
            </template>
          </div>
        </template>

        <template is="dom-if" if="[[_checkType('nextButton', itemData.type)]]">
          <div class$="{{nextButtonClassName}}">
            <template is="dom-if" if="[[animations]]">
              <paper-ripple></paper-ripple>
            </template>
            <template is="dom-if" if="[[!_checkViewMode('kiosk')]]">
              <paper-fab class="next-paper-fab" icon="chevron-right"></paper-fab>
            </template>
            <template is="dom-if" if="[[_checkViewMode('kiosk')]]">
            <div>[[localize('ITEM_GRID_NEXT_FOLDER')]]</div>
            </template>
          </div>
        </template>

        <template is="dom-if" if="[[_checkType('previousButton', itemData.type)]]">
          <div class$="{{previousButtonClassName}}">
            <template is="dom-if" if="[[animations]]">
              <paper-ripple></paper-ripple>
            </template>
            <template is="dom-if" if="[[!_checkViewMode('kiosk')]]">
              <paper-fab class="previous-paper-fab" icon="chevron-left"></paper-fab>
            </template>
            <template is="dom-if" if="[[_checkViewMode('kiosk')]]">
            <div>[[localize('ITEM_GRID_PREVIOUS_FOLDER')]]</div>
            </template>
          </div>
        </template>

        <template is="dom-if" if="[[_checkType('folder', itemData.type)]]">
          <div class="item-content folder">
            <template is="dom-if" if="[[animations]]">
              <paper-ripple></paper-ripple>
            </template>
            <div class\$="{{itemContentNameClassName}}">[[itemData.name]]</div>
          </div>
        </template>

        <template is="dom-if" if="[[_checkType('default', itemData.type)]]">
          <template is="dom-if" if="[[_checkViewMode('default')]]">

            <template is="dom-if" if="[[hideItemIcon]]">
              <div class="item-content default">
                <template is="dom-if" if="[[animations]]">
                  <paper-ripple></paper-ripple>
                </template>
                <div class="item-content-header">
                  <div class="item-content-header-used-qty" hidden$="{{hideUsedQty}}">[[itemData.usedQty]]</div>
                  <div class="item-content-header-price" hidden$="{{hideItemPrice}}">[[itemData.price]]</div>
                </div>
                <div hidden\$="[[hideItemIcon]]">
                  <iron-icon icon="[[itemIcon]]"></iron-icon>
                </div>
                <div class\$="{{itemContentNameClassName}}" hidden\$="[[hideItemName]]">[[itemData.name]]</div>
              </div>
            </template>

            <template is="dom-if" if="[[!hideItemIcon]]">
              <div class="item-content-icon-content">
                <template is="dom-if" if="[[animations]]">
                  <paper-ripple></paper-ripple>
                </template>
                <div class="item-content-icon">
                  <iron-icon icon="[[itemIcon]]"></iron-icon>
                </div>
                <div class="item-content-icon-name">[[itemData.name]]</div>
              </div>
            </template>

          </template>

          <template is="dom-if" if="[[_checkViewMode('kiosk')]]">
            <div class="item-content">
              <template is="dom-if" if="[[animations]]">
                <paper-ripple></paper-ripple>
              </template>
              <div class="item-content-kiosk-header" on-click="_selectItemHeader">
                <div class="item-content-kiosk-header-info">
                  <iron-icon icon="info"></iron-icon>
                </div>
                <div class="item-content-kiosk-header-price">[[_formatPriceCur(itemData.price, symbol)]]</div>
                <div class="item-content-kiosk-header-used-qty" hidden$="{{hideUsedQty}}">[[itemData.usedQty]]</div>
              </div>
              <div class="item-content-kiosk-image default"></div>
              <div class="item-content-kiosk-footer">
                <div class="item-content-kiosk-footer-name">
                  [[itemData.name]]
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>
    `;
  }

  static get properties() {
    return {
      animations:{
        type: Boolean,
        value: true
      },
      language: String,
      symbol: String,
      hideItemName:{
        type: Boolean,
        value: false
      },
      hideItemIcon:{
        type: Boolean,
        value: true
      },
      itemIcon: String,
      itemWidth:{
        type: Number
      },
      itemHeight:{
        type: Number
      },
      itemMargin:{
        type: Number
      },
      itemBorderRadiusVariable:{
        type: Boolean,
        value: false
      },
      itemViewMode: {
        type: String,
        value: 'default'
      },
      itemData: {
        type: Object,
        observer: '_itemDataChanged'
      },
      itemContentNameClassName: {
        type: String,
        value: 'item-content-name'
      },
      keepItemSelected:{
        type: Boolean,
        value: false
      },
      itemSelectedId: {
        type: String,
        notify: true,
        observer: '_itemSelectedIdChanged'
      },
      itemSelected: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      hideUsedQty: {
        type: Boolean,
        value: true
      },
      hideItemPrice: {
        type: Boolean,
        value: false
      },
      parentFolderClassName: {
        type: String,
        value: 'item-content'
      },
      nextButtonClassName: {
        type: String,
        value: 'item-content'
      },
      previousButtonClassName: {
        type: String,
        value: 'item-content'
      },
    }
  }

  static get importMeta() { 
    return import.meta; 
  }

  connectedCallback() {
    super.connectedCallback();
    this.useKeyIfMissing = true;
    this.loadResources(this.resolveUrl('./static/translations.json'));
  }

  _itemDataChanged(){
    let itemContentBackgroundColor = 'transparent';
    let itemContentColor = "black";
    let itemContentBackgroundImage = 'none';
    this.hideUsedQty = true;
    this.hideItemIcon = true;

    let itemContentIconContentBorderRadius = '5'
    let itemContentIconWidth = '24';
    let itemContentIconWiHeight = '24';

    this.updateStyles({
      '--item-content-background-color': itemContentBackgroundColor,
      '--item-content-color': itemContentColor,
      '--item-content-background-image': itemContentBackgroundImage,
      '--item-content-width': this.itemWidth + 'px',
      '--item-content-height': this.itemHeight + 'px',
      '--item-content-icon-content-border-radius': itemContentIconContentBorderRadius + 'px',
      '--item-content-icon-width': itemContentIconWidth + 'px',
      '--item-content-icon-height': itemContentIconWiHeight + 'px',
      '--item-margin': this.itemMargin + 'px'
    });

    if (this.itemData.icon){
      this.hideItemIcon = false;
      this.itemIcon = this.itemData.icon;
      if (this.itemBorderRadiusVariable){
        itemContentIconContentBorderRadius = '10';
      }
      if (this.itemWidth != '70') {
        itemContentIconWidth = '48';
        itemContentIconWiHeight = '48';
        if (this.itemBorderRadiusVariable){
          itemContentIconContentBorderRadius = '15';
        }
      }
    } 

    switch (this.itemData.type) {
      case "folder":
        if (this.itemData.urlImage){
          itemContentBackgroundImage = 'url(' +  this.itemData.urlImage + ')';
        }

        if ((!this.itemData.urlImage) || (this.itemData.urlImage == "")){
          this.itemContentNameClassName = 'item-content-name-center';
        } else{
          this.itemContentNameClassName = 'item-content-name';
        }
        break;
      
      default:
        if (this.itemData.urlImage){
          itemContentBackgroundImage = 'url(' +  this.itemData.urlImage + ')';
        } else{
          if (this.itemViewMode == 'kiosk'){
            itemContentBackgroundImage = 'url(frontimages/no_image.jpg)';
          }
        }

        if (this.itemData.backgroundColor){
          itemContentBackgroundColor = this.itemData.backgroundColor;
        }

        if ((!this.itemData.urlImage) || (this.itemData.urlImage == "")){
          this.itemContentNameClassName = 'item-content-name-center';
        } else{
          this.itemContentNameClassName = 'item-content-name';
        }

        // Only pack options has this properties
        if(this.itemData.hasOwnProperty('minQty')){
          if (this.itemData.minQty > this.itemData.used) {
            this.itemContentNameClassName = this.itemContentNameClassName + ' required';  
          }
        }

        break;
    }

    if (this.itemViewMode === 'kiosk') {  
      this.parentFolderClassName = 'item-content-kiosk parent-folder-kiosk';
      this.nextButtonClassName = 'item-content-kiosk next-button-kiosk';
      this.previousButtonClassName = 'item-content-kiosk previous-button-kiosk';

      if (this.itemHeight > this.itemWidth){
        let diffHeight = this.itemHeight - this.itemWidth

        let itemContentKioskHeaderHeight =  diffHeight * 0.5; 
        let itemContentKioskImageHeight = this.itemWidth;
        let itemContentKioskFooterHeight = diffHeight * 0.5;

        this.updateStyles({
          '--item-content-kiosk-header-height': itemContentKioskHeaderHeight + 'px',
          '--item-content-kiosk-image-height': itemContentKioskImageHeight + 'px',
          '--item-content-kiosk-footer-height': itemContentKioskFooterHeight + 'px'
        });
      }
    } else {
      this.parentFolderClassName = 'item-content parent-folder';
      this.nextButtonClassName = 'item-content next-button';
      this.previousButtonClassName = 'item-content previous-button';
    }

    if (itemContentBackgroundColor != 'transparent'){
      let hexcolor = itemContentBackgroundColor;

      if (hexcolor.slice(0, 1) === '#') {
        hexcolor = hexcolor.slice(1);
      }
    
      // If a three-character hexcode, make six-character
      if (hexcolor.length === 3) {
        hexcolor = hexcolor.split('').map(function (hex) {
          return hex + hex;
        }).join('');
      }
    
      // Convert to RGB value
      var r = parseInt(hexcolor.substr(0,2),16);
      var g = parseInt(hexcolor.substr(2,2),16);
      var b = parseInt(hexcolor.substr(4,2),16);
    
      // Get YIQ ratio
      var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
      // Check contrast
      itemContentColor = (yiq >= 128) ? 'black' : 'white';
    }

    this.updateStyles({
      '--item-content-background-color':   itemContentBackgroundColor,
      '--item-content-color':   itemContentColor,
      '--item-content-background-image': itemContentBackgroundImage,
      '--item-content-width': this.itemWidth + 'px',
      '--item-content-height': this.itemHeight + 'px',
      '--item-content-icon-content-border-radius': itemContentIconContentBorderRadius + 'px',
      '--item-content-icon-width': itemContentIconWidth + 'px',
      '--item-content-icon-height': itemContentIconWiHeight + 'px',
      '--item-margin': this.itemMargin + 'px'
    });
    
    if (this.keepItemSelected){
      if (this.itemSelectedId === this.itemData.code){
        this.itemSelected = true;  
      } else {
        this.itemSelected = false;  
      }
    }

    if (this.itemData.usedQty > 0){
      this.hideUsedQty = false;
    }
  }

  _selectItem(e) {
    this.itemData.target = e.target;
    switch (this.itemData.type) {
      case "parentFolder":
        this.dispatchEvent(new CustomEvent('parent-folder-selected', {bubbles: true, composed: true }));
        break;
      case "nextButton":
        this.dispatchEvent(new CustomEvent('next-button-pressed', {bubbles: true, composed: true }));
        break;
      case "previousButton":
        this.dispatchEvent(new CustomEvent('previous-button-pressed', {bubbles: true, composed: true }));
        break;
      case "folder":
        this.dispatchEvent(new CustomEvent('folder-selected', {detail: this.itemData, bubbles: true, composed: true }));
        break;
      default:
        this.dispatchEvent(new CustomEvent('item-selected', {detail: this.itemData, bubbles: true, composed: true }));
        break;
    }
  }

  _selectItemHeader(e){
    // prevent "selectItem" event of parent div
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
    
    this.dispatchEvent(new CustomEvent('item-kiosk-header-selected', {detail: this.itemData, bubbles: true, composed: true }));
  }

  _checkType(type, itemType){
    itemType = (itemType) ? (itemType) : 'default';
    return (type == itemType);
  }

  _checkViewMode(viewMode){
    return (viewMode == this.itemViewMode);
  }

  _formatPriceCur(price, symbol) {
    let priceText = "";
    let lPrice = (price) ? price : 0;
    if (symbol == '') symbol = '€';
    priceText = formatMoney(lPrice, {symbol: symbol, precision: 2, thousand: ".", decimal: ",", format: "%v %s"});
    return priceText;
  }

  _itemSelectedIdChanged(){
    if (this.itemData){
      if (this.itemSelectedId === this.itemData.code){
        this.itemSelected = true;  
      } else {
        this.itemSelected = false;  
      }
    }
  }
}
window.customElements.define('nc-items-grid-item', NcItemsGridItem);