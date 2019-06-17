import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/iron-list/iron-list.js';
import { MutableData } from '@polymer/polymer/lib/mixins/mutable-data.js';
import { AppLocalizeBehavior } from '@polymer/app-localize-behavior/app-localize-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import './nc-items-grid-item.js';

class NcItemsGrid extends mixinBehaviors([AppLocalizeBehavior], MutableData(PolymerElement)) {
  static get template() {
    return html`
      <style>
        ::-webkit-scrollbar {
          width: 15px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
          box-shadow: inset 0 0 1px var(--app-scrollbar-color);
          background-color: #EEEEEE;
          border-radius: 10px;
        }
        
        /* Handle */
        ::-webkit-scrollbar-thumb {
          background: var(--app-scrollbar-color);
          border-radius: 10px;
        }

        :host {
          display: block;
          height: 100%;
          display: flex;
          flex-direction: column;
          --items-grid-margin-left: 0px;
          --items-grid-margin-right: 0px;
          --items-grid-item-content-border-radius: 5px;
          --items-grid-item-content-box-shadow: none;
          --items-grid-item-content-folder-font-size: 1.3em;
          --items-grid-item-content-default-font-size: 1em;
          --items-grid-item-content-default-price-font-size: 1em;
        }

        ul.breadcrumb {
          padding: 0 10px;
          margin: 4px;
          height: 20px;
          line-height: 20px;
          list-style: none;
          font-size: 17px;
          border-bottom: 1px solid black;
        }

        /* Display list items side by side */
        ul.breadcrumb li {
          display: inline;
          -webkit-touch-callout: none; /* iOS Safari */
          -webkit-user-select: none; /* Safari */
          -khtml-user-select: none; /* Konqueror HTML */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently
                                    supported by Chrome and Opera */
        }

        ul.breadcrumb li:last-child {
          float: right;
        }

        /* Add a slash symbol (/) before/behind each list item */
        ul.breadcrumb li+li:before {
          padding: 2px;
          content: "/\\00a0";
        }

        /* Add a color on mouse-over */
        ul.breadcrumb li span:hover {
          text-decoration: underline;
          cursor: pointer;
        }


        .items-container {
          @apply --layout-horizontal;
          @apply --layout-wrap;
          margin-left: var(--items-grid-margin-left);
          /* margin-right: var(--items-grid-margin-right); */
        }

        .justified {
          @apply --layout-center-justified;
        }

        .loading{
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0.6;
          background-color: #EEEEEE;
          z-index: 99999999;
          
        }
        
        paper-spinner{
          width: 50px;
          height: 50px;
          --paper-spinner-layer-1-color: var(--app-accent-color);
          --paper-spinner-layer-2-color: var(--app-accent-color);
          --paper-spinner-layer-3-color: var(--app-accent-color);
          --paper-spinner-layer-4-color: var(--app-accent-color);
        }

        .spinnerLoading{
          text-align: center;
          position: relative;
          top: 40%;
        }

        nc-items-grid-item{
          --item-content-border-radius: var(--items-grid-item-content-border-radius);
          --item-content-box-shadow: var(--items-grid-item-content-box-shadow);
          --item-content-folder-font-size: var(--items-grid-item-content-folder-font-size);
          --item-content-default-font-size: var(--items-grid-item-content-default-font-size);
          --item-content-default-price-font-size: var(--items-grid-item-content-default-price-font-size);
        }
      </style>
      

      <template is="dom-if" if="[[breadcrumb]]">
        <ul class="breadcrumb">
          <template is="dom-repeat" items="[[breadcrumbList]]">
            <li><span on-tap="_selectFolder">[[item.name]]</span></li>
          </template>
          <li>[[currentLevelPageBreadcrumb]] / [[currentLevelTotalPages]]</li>
        </ul>
      </template>
      <div class="container">
        <div class$="{{itemsContainerClassName}}">
          <template is="dom-repeat" items="[[level]]">
          
            <nc-items-grid-item 
                id="slot[[item.code]]" 
                language="{{language}}" 
                item-data="[[item]]" 
                item-width="[[itemWidth]]" 
                item-height="[[itemHeight]]" 
                item-margin="[[itemMargin]]" 
                item-view-mode="[[itemViewMode]]" 
                hide-item-name="[[hideItemName]]" 
                on-item-selected="_itemSelected"
                keep-item-selected="[[keepItemSelected]]" 
                item-selected-id="[[itemSelectedId]]" 
                on-parent-folder-selected="_parentFolderSelected" 
                on-next-button-pressed="_nextButtonPressed" 
                on-previous-button-pressed="_previousButtonPressed" 
                on-folder-selected="_folderSelected">
            </nc-items-grid-item>
          </template>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      itemsGridData: {
        type: Array,
        observer: '_itemsGridDataChanged'
      },
      loading: {
        type: Boolean,
        value: false
      },
      language: String,
      itemWidth:{
        type: Number,
        value: 100,
        reflectToAttribute: true,
      },
      itemHeight:{
        type: Number,
        value: 100,
        reflectToAttribute: true
      },
      itemMargin:{
        type: Number,
        value: 2,
        reflectToAttribute: true
      },
      itemViewMode:{
        type: String,
        value: 'default',
        reflectToAttribute: true
      },
      hideItemName: Boolean,
      levels: {
        type: Array,
        value: []
      },
      level: {
        type: Array,
        value: [],
        observer: '_setCurrentLevelTotalPages'
      },
      currentLevel: {
        type: Number,
        value: 0
      },
      levelIndexFrom: {
        type: Number,
        value: 0
      },
      levelIndexTo: {
        type: Number,
        value: 0
      },
      currentLevelPage: {
        type: Number,
        value: 0
      },
      currentLevelPageBreadcrumb: {
        type: Number,
        computed: '_computeCurrentLevelPageBreadcrumb(currentLevelPage)'
      },
      currentLevelTotalPages: {
        type: Number,
        value: 0
      },
      limitItemsPerLevel: {
        type: Number,
        value: 0
      },
      parentFolder: {
        type: Object,
        value: {
          backgroundColor: "",
          code: "",
          name: "..",
          type: "parentFolder",
          urlImage: ""
        }
      },
      nextButton: {
        type: Object,
        value: {
          backgroundColor: "",
          code: "",
          name: "Siguiente",
          type: "nextButton",
          urlImage: ""
        }
      },
      previousButton: {
        type: Object,
        value: {
          backgroundColor: "",
          code: "",
          name: "Anterior",
          type: "previousButton",
          urlImage: ""
        }
      },
      breadcrumb: {
        type: Boolean,
        value: false,
//          observer: '_changeBreadcrumbVisibility'
      },
      autoFlow: {
        type: Boolean,
        value: false
      },
      breadcrumbList: {
        type: Array,
        value: [],
        notify: true
      },
      isPaginated: {
        type: Boolean,
        value: false
      },
      isJustified: {
        type: Boolean,
        value: false
      },
      itemsGridCenter: {
        type: Boolean,
        value: false
      },
      firstItemSelected:{
        type: Boolean,
        value: false
      },
      keepItemSelected:{
        type: Boolean,
        value: false
      },
      itemSelectedId: {
        type: String,
        notify: true
      }
    }
  }

  static get importMeta() { 
    return import.meta; 
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this._appResize.bind(this));
    this.useKeyIfMissing = true;
    this.loadResources(this.resolveUrl('./static/translations.json'));
  }

  gridResize(){
    let h = 0;
    let cols = 0;
    let rows = 0;
    if (this.isPaginated) {
      if ((this.offsetHeight !== 0) && (this.offsetHeight !== 0 )){
        h = this.offsetHeight;
        
        cols = Math.trunc(this.offsetWidth / (this.itemWidth + (this.itemMargin * 2) + 2)); /* 2: 1px left border + 1px right border */
        
        if (this.breadcrumb){
          h = h - 28;
        }
        
        rows = Math.trunc(h / (this.itemHeight + (this.itemMargin * 2) + 2)); /* 2: 1px left border + 1px right border */
        this.limitItemsPerLevel = cols*rows;

        let itemsGridMargin = 0;
        let itemWidth = this.itemWidth + (this.itemMargin * 2) + 2;

        itemsGridMargin = (this.offsetWidth - (cols * itemWidth)) / 2;
        itemsGridMargin = itemsGridMargin + 'px';
        

        this.updateStyles({
          '--items-grid-margin-left': itemsGridMargin,
          '--items-grid-margin-right': itemsGridMargin
        });
      }

    } else {
      this.limitItemsPerLevel = 0;
    }
  }

  _computeCurrentLevelPageBreadcrumb(currentLevelPage){
    return currentLevelPage + 1
  }

  _setCurrentLevelTotalPages(){
    if (this.levels) {
      if (this.levels[this.currentLevel]) {
        if (this.limitItemsPerLevel != 0)

          if (this.levels[this.currentLevel].length % (this.limitItemsPerLevel - 2) > 1) {
            this.currentLevelTotalPages = Math.trunc(this.levels[this.currentLevel].length / (this.limitItemsPerLevel - 2)) + 1;
          } else {
            this.currentLevelTotalPages = Math.trunc(this.levels[this.currentLevel].length / (this.limitItemsPerLevel - 2));
          }
          if (this.currentLevelTotalPages == 0 )
            this.currentLevelTotalPages = 1;
      } else {
        this.currentLevelTotalPages = 1;
      }
    }
  }

  _itemsGridDataChanged(e){  
    this.itemsContainerClassName = 'items-container';
    if (this.isJustified){
      this.itemsContainerClassName = this.itemsContainerClassName + ' justified';
    }

    this.currentLevel = 0;
    this.currentLevelPage = 0;
    this.levelIndexFrom = 0;
    this.levelIndexTo = 0;
    this.set('level',[]);
    this.set('levels', []);

    let showNextButton = false;
    let showParentFolder = false;
    let showPreviousButton = false;

    if (this.itemsGridData) {
      if (this.itemsGridData.length > 0){

        this._resizeDebouncer = Debouncer.debounce(this._resizeDebouncer,
          timeOut.after(100),
          () => {
            this.gridResize();
            // Remove folder without elements (starting from the end)
            for (let i = this.itemsGridData.length - 1; i >= 0; i--){
              if (this.itemsGridData[i].content){
                if (this.itemsGridData[i].content.length == 0){
                  this.itemsGridData.splice(i,1);
                }
              }
            }

            this.levels.push(this.itemsGridData);
            
            // console.log('_itemsGridDataChanged', this.levels[this.currentLevel].length, this.limitItemsPerLevel)
            showNextButton = this.levels[this.currentLevel].length > this.limitItemsPerLevel;
            if (showNextButton) {
              this.levelIndexTo = this.levelIndexTo + this.limitItemsPerLevel - 1 - 1;
            } else{
              this.levelIndexTo = this.levels[this.currentLevel].length - 1;
            }
            this._setPage(showPreviousButton, showParentFolder, showNextButton, this.levelIndexFrom, this.levelIndexTo );
          }
        );
        
      }
    }

    if (this.breadcrumbList){
      this.push ('breadcrumbList', {
        level: 0,
        name: this.localize('ITEMS_GRID_BREADCRUMB_ALL')
      });
    }

    if (this.autoFlow) {
      if (this.currentLevel==0) {
        if (this.level.length == 1) {
          if (this.level[0].type == "folder") {
            this._folderSelected({detail:this.level[0]});
          }
        }
      }
    }
  }

  _setPage(_showPrevious, _showParent, _showNext, _from, _to) {
    
    if (this.limitItemsPerLevel != 0 ) {
      this.set('level', this.levels[this.currentLevel].slice(this.levelIndexFrom, this.levelIndexTo + 1));


      if (_showPrevious) {
        this.level.unshift(this.previousButton);
      }
      if (_showNext) {
        this.level.push(this.nextButton);
      }
    } else {
      this.set('level', this.levels[this.currentLevel]);
    }

    if (_showParent) {
      if (this.level[0]){
        if (this.level[0].type != 'parentFolder'){
          this.level.unshift(this.parentFolder);
        }
      } else{
        this.level.unshift(this.parentFolder);
      }
    }

    if ((this.firstItemSelected) && (!this.itemSelectedId)){
      this.dispatchEvent(new CustomEvent('item-selected', {detail: this.level[0], bubbles: true, composed: true }));
      this.selectItem(this.level[0].code);
    }
  }

  _parentFolderSelected(){
    this.currentLevel--;
    this.currentLevelPage = 0;
    this.levelIndexFrom = 0;
    // Remove the last element of an array:
    this.levels.pop();
    let showNextButton = false;
    let showParentFolder = false;
    let showPreviousButton = false;

    if (this.currentLevel > 0){
      showParentFolder = true;
    }
    showNextButton = this.levels[this.currentLevel].length -1 > this.limitItemsPerLevel;

    if (showNextButton){
      this.levelIndexTo = this.levelIndexFrom + this.limitItemsPerLevel - 1 - 1;
      if (this.currentLevel > 0) { 
        this.levelIndexTo = this.levelIndexTo - 1;
      }
    } else {
      this.levelIndexTo = this.levels[this.currentLevel].length - 1;
    }

    this._setPage(showPreviousButton, showParentFolder, showNextButton, this.levelIndexFrom, this.levelIndexTo );

    this.pop('breadcrumbList');

    if (this.autoFlow) {
      if (this.level.length <= 2) { //parent folder & and the folder itself
        if (this.level[0].type == "parentFolder") {
          if (this.level[1].type == "folder") {
            this._parentFolderSelected();
          }
        }
      }
    }
  }

  _nextButtonPressed(){
    this.currentLevelPage++;
    this.levelIndexFrom = this.levelIndexTo + 1;
    let showNextButton = false;
    let showParentFolder = false;
    let showPreviousButton = true;

    if ( this.levels[this.currentLevel].length - this.levelIndexFrom <= this.limitItemsPerLevel - 1){ //-1 del previous //ulyima página
      this.levelIndexTo = this.levels[this.currentLevel].length - 1;
    } else { //necesario next
      this.levelIndexTo = this.levelIndexFrom + this.limitItemsPerLevel - 1 - 1 - 1; //-1 previous -1 next -1 0based
      showNextButton = true;
    }

    this._setPage(showPreviousButton, showParentFolder, showNextButton, this.levelIndexFrom, this.levelIndexTo );
  }

  _previousButtonPressed(){
    this.currentLevelPage--;
    this.levelIndexTo = this.levelIndexFrom - 1;
    let showNextButton = true;
    let showParentFolder = false;
    let showPreviousButton = false;

    if (this.currentLevelPage>0){
      showPreviousButton = true;
    } else {
      if (this.currentLevel>0) {
        showParentFolder = true;
      }
    }

    if ( showParentFolder || showPreviousButton){
      this.levelIndexFrom = this.levelIndexTo - (this.limitItemsPerLevel - 2) + 1; //-2 per parent/previous i next, +1 0 based
      if (this.levelIndexFrom<0) this.levelIndexFrom = 0;
    } else { //necesario next
      this.levelIndexFrom = 0;
    }

    this._setPage(showPreviousButton, showParentFolder, showNextButton, this.levelIndexFrom, this.levelIndexTo )
  }

  _selectFolder (item) {
    let itemSelected = item.model.item;
    for (let i=this.currentLevel; i>itemSelected.level; i--) {
      this._parentFolderSelected();
    }
  }

  _folderSelected(item) {
    // console.log('_folderSelected')
    this.currentLevel++;
    this.currentLevelPage = 0;

    this.levelIndexFrom = 0;
    this.levels.push(item.detail.content);

    // Remove folder without elements (starting from the end)
    for (let i = item.detail.content.length - 1; i >= 0; i--){
      if (item.detail.content[i].content){
        if (item.detail.content[i].content.length == 0){
          item.detail.content.splice(i,1);
        }
      }
    }

    let showParentFolder = true;
    let showPreviousButton = false;
    let showNextButton = this.levels[this.currentLevel].length > this.limitItemsPerLevel - 1;

    if (showNextButton) {
      this.levelIndexTo = this.limitItemsPerLevel - 1 - 1 - 1; //-1 de 0 based -1 parent folder -1 next
    } else {
      this.levelIndexTo = this.levels[this.currentLevel].length - 1;
    }

    this._setPage(showPreviousButton, showParentFolder, showNextButton, this.levelIndexFrom, this.levelIndexTo);

    if (this.breadcrumbList) {
      this.push('breadcrumbList', {
        level: this.currentLevel,
        name: item.detail.name
      });
    }

    if (this.autoFlow) {
      if (this.level.length == 2) { //parent folder and the folder itself
        if (this.level[1].type == "folder") { // 1 'cause 0 is parent
          this._folderSelected({detail:this.level[1]});
        }
      }
    }
  }

  _itemSelected(item){
    if (!this.keepItemSelected) return;
    this.itemSelectedId = item.model.item.code;
  }

  selectItem(item){
    this.itemSelectedId = item;
  }

  selectTopFolder(){
    for (let i=this.currentLevel; i>0; i--) {
      this._parentFolderSelected();
    }

    for (let i=this.currentLevelPage; i>0; i--) {
      this._previousButtonPressed();
    }
  }

  _appResize(){
    this._itemsGridDataChanged();
  }
}
window.customElements.define('nc-items-grid', NcItemsGrid);
