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

          --item-content-header-height: 20px;
          --item-content-image-height: 80px;
          --item-content-footer-height: 20px;

          --item-margin: 2px;
        }

        :host([item-selected]) > div.item-container > div.default {
          filter: brightness(80%);
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
          background-color: transparent;
          border-color: transparent;
          box-shadow: none;
        }

        .previous-button{
          background-color: transparent;
          border-color: transparent;
          box-shadow: none;
        }

        .parent-folder{
          border-color: var(--app-secondary-color, #253855);
          background-color: var(--app-secondary-color, #253855);
          overflow: hidden;
          color: white;
          font-size: 2.2em;
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
          font-size: 1.5em;
        }

        .default{
          border-color: var(--app-secondary-color, #253855);
          background-image: var(--item-content-background-image);
          background-color: var(--item-content-background-color);
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          
        }


        .item-content-header{
          height: var(--item-content-header-height);
          background: #FFA726;
          @apply --layout-horizontal;
          @apply --layout-center-justified;
          @apply --layout-center;
          padding: 0 10px;
        }

        .item-content-header-price{
          /* @apply --layout-flex; */
          /* text-align: right; */
          font-size: 1.5em;
          font-weight: bolder;
          overflow: hidden;
          color: white;
          color: black;
        }

        .item-content-image{
          height: var(--item-content-image-height);
        }

        .item-content-footer{
          height: var(--item-content-footer-height);
          background-color: #FFA726;
          @apply --layout-horizontal;
          @apply --layout-center-justified;
          @apply --layout-center;
          text-align: center;
          padding: 0 10px;
        }

        .item-content-footer-name{
          font-size: 1.3em;
          color: white;
          color: black;
          overflow: hidden;
        }

        .item-content-name {
          white-space:pre-wrap;
          vertical-align: middle;
          width: 100%;
          text-align: center;
          position: absolute;
          bottom: 0px;
          left: 0;
          right: 0;
          background: linear-gradient(to bottom, rgba(37, 56, 85, 0.8) 100%, rgba(37, 56, 85, 0.8) 100%);
          color: white;
          overflow: hidden;
          padding: 5px 0;
        }

        .item-content-name-center {
          white-space:pre-wrap;
          vertical-align: middle;
          width: 100%;
          text-align: center;
          position: absolute;
          top: 50%;
          transform: translate(0,-50%);
          overflow: hidden;
          padding: 5px 0;
        }
        
        .product-price{
          float: right;
          width: fit-content;
          background: linear-gradient(to bottom, rgba(0,0,0,0.5) 100%, rgba(0,0,0,0.5) 100%);
          color: white;
          padding: 0 2px;
          font-size: 0.8em;
        } 

        .required{
          color :red;
        }

        paper-fab {
          --paper-fab-background: var(--app-secondary-color, #253855);
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      </style>

      <div class="item-container">
        <template is="dom-if" if="[[_checkType('parentFolder', itemData.type)]]">
          <div class="item-content parent-folder" on-tap="_selectItem">
            <paper-ripple></paper-ripple>
            <div class\$="{{itemContentNameClassName}}">{{localize('ITEM_GRID_PARENT_FOLDER')}}</div>
          </div>
        </template>

        <template is="dom-if" if="[[_checkType('nextButton', itemData.type)]]">
          <div class="item-content next-button" on-tap="_selectItem">
            <paper-fab icon="chevron-right"></paper-fab>
          </div>
        </template>

        <template is="dom-if" if="[[_checkType('previousButton', itemData.type)]]">
          <div class="item-content previous-button" on-tap="_selectItem">
            <paper-fab icon="chevron-left"></paper-fab>
          </div>
        </template>

        <template is="dom-if" if="[[_checkType('folder', itemData.type)]]">
          <div class="item-content folder" on-tap="_selectItem">
            <paper-ripple></paper-ripple>
            <div class\$="{{itemContentNameClassName}}">[[itemData.name]]</div>
          </div>
        </template>

        <template is="dom-if" if="[[_checkType('default', itemData.type)]]">
          <template is="dom-if" if="[[_checkViewMode('default')]]">
            <div class="item-content default" on-tap="_selectItem">
              <paper-ripple></paper-ripple>
              <div class="product-price">
                [[itemData.price]]
              </div>
              <div class\$="{{itemContentNameClassName}}" hidden\$="[[hideItemName]]">[[itemData.name]]</div>
            </div>
          </template>

          <template is="dom-if" if="[[_checkViewMode('kiosk')]]">
            <div class="item-content" on-tap="_selectItem">
              <paper-ripple></paper-ripple>
              <div class="item-content-header">
                <div class="item-content-header-price">[[_formatPrice(itemData.price)]]</div>
              </div>
              <div class="item-content-image default"></div>
              <div class="item-content-footer">
                <div class="item-content-footer-name">
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

    if (this.itemHeight > this.itemWidth){
      let diffHeight = this.itemHeight - this.itemWidth

      let itemContentHeaderHeight =  diffHeight * 0.5; 
      let itemContentImageHeight = this.itemWidth;
      let itemContentFooterHeight = diffHeight * 0.5;

      this.updateStyles({
        '--item-content-header-height': itemContentHeaderHeight + 'px',
        '--item-content-image-height': itemContentImageHeight + 'px',
        '--item-content-footer-height': itemContentFooterHeight + 'px'
      });
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
    priceText = formatMoney(price, {symbol: "€", precision: 2, thousand: ".", decimal: ",", format: "%v %s"});
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
