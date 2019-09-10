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
          --item-content-width: 100px;
          --item-content-height: 100px;

          --item-content-border-radius: 5px;
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

        :host([item-selected]) > div.item-container > div.default {
          /* filter: brightness(90%); */
          /* filter: drop-shadow(1px 1px  var(--app-secondary-color, #253855)); */
          /* box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14),
                      0 1px 18px 0 rgba(0, 0, 0, 0.12),
                      0 3px 5px -1px rgba(0, 0, 0, 0.4); */
          background-color: var(--app-accent-color, #FF9800);
          border-color: black;
          box-shadow:inset 0px 0px 0px 2px var(--app-accent-color, #FF9800);
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

        .next-button{
          border-color: transparent;
          background-color: transparent;
          box-shadow: none;
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

        .parent-folder{
          border-color: transparent;
          background-color: transparent;
          box-shadow: none;
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
          <div class="item-content parent-folder" >
            <paper-fab class="parent-folder-paper-fab" icon="chevron-left"></paper-fab>
          </div>
        </template>

        <template is="dom-if" if="[[_checkType('nextButton', itemData.type)]]">
          <div class="item-content next-button">
            <paper-fab class="next-paper-fab" icon="chevron-right"></paper-fab>
          </div>
        </template>

        <template is="dom-if" if="[[_checkType('previousButton', itemData.type)]]">
          <div class="item-content previous-button">
            <paper-fab class="previous-paper-fab" icon="chevron-left"></paper-fab>
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
            <div class="item-content default">
              <template is="dom-if" if="[[animations]]">
                <paper-ripple></paper-ripple>
              </template>
              <div class="item-content-header">
                <div class="item-content-header-used-qty" hidden$="{{hideUsedQty}}">[[itemData.usedQty]]</div>
                <div class="item-content-header-price" hidden$="{{hidePrice}}">[[itemData.price]]</div>
              </div>
              <div class\$="{{itemContentNameClassName}}" hidden\$="[[hideItemName]]">[[itemData.name]]</div>
            </div>
          </template>

          <template is="dom-if" if="[[_checkViewMode('kiosk')]]">
            <div class="item-content">
              <template is="dom-if" if="[[animations]]">
                <paper-ripple></paper-ripple>
              </template>
              <div class="item-content-kiosk-header">
                <div class="item-content-kiosk-header-price">[[_formatPrice(itemData.price)]]</div>
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
      hideItemName:{
        type: Boolean,
        value: false
      },
      itemWidth:{
        type: Number
      },
      itemHeight:{
        type: Number
      },
      itemMargin:{
        type: Number
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
      hidePrice: {
        type: Boolean,
        value: false
      }
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
    let itemContentBackgroundImage = 'none';
    this.hideUsedQty = true;


    this.updateStyles({
      '--item-content-background-color':   itemContentBackgroundColor,
      '--item-content-background-image': itemContentBackgroundImage,
      '--item-content-width': this.itemWidth + 'px',
      '--item-content-height': this.itemHeight + 'px',
      '--item-margin': this.itemMargin + 'px'
    });

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
    }

    this.updateStyles({
      '--item-content-background-color':   itemContentBackgroundColor,
      '--item-content-background-image': itemContentBackgroundImage,
      '--item-content-width': this.itemWidth + 'px',
      '--item-content-height': this.itemHeight + 'px',
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

  _selectItem() {
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

  _checkType(type, itemType){
    itemType = (itemType) ? (itemType) : 'default';
    return (type == itemType);
  }

  _checkViewMode(viewMode){
    return (viewMode == this.itemViewMode);
  }

  _formatPrice(price) {
    let priceText = ""
    if (price){
      priceText = formatMoney(price, {symbol: "€", precision: 2, thousand: ".", decimal: ",", format: "%v %s"});
    }
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
