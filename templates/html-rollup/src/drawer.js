import mixin from './../node_modules/custom-select-mixins/src/selector-mixin'

export default customElements.define('$project-drawer', class extends mixin(HTMLElement) {
  constructor() {
    super()
    
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = this.template
  }
  get template() {
    return `
    <style>
      :host {
        position: absolute;
        z-index: 101;
        top: 0;
        bottom: 0;
        left: 0;
        width: 256px;
        pointer-events: none;
        opacity: 0;
        transform: translateX(-105%);
        transition: transform 160ms ease-out, opacity 160ms ease-out;
        background: var(--light-primary-color);
      }
      
      :host([opened]) {
        pointer-events: auto;
        opacity: 1;
        transform: translateX(0);
        transition: transform 160ms ease-out, opacity 160ms ease-out;
      }
      
      .top {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: var(--app-header-height);
      }
      
      .flex {
        flex: 1;
      }
    </style>
    <span class="top">
      <slot name="top"></slot>
    </span>
    
    <slot name="content"></slot>
    
    <span class="flex"></span>
    
    <slot name="bottom"></slot>
    `
  }
})