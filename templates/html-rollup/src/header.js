export default customElements.define('$project-header', class extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = this.template
  }
  
  get template() {
    return `
    <style>
      :host {
        display: flex;
        flex-direction: column;
        background: var(--primary-color);
        border-bottom: 1px solid rgba(0, 0, 0, 0.72);
        padding: 12px 24px;
        box-sizing: border-box;
        height: var(--app-header-height);
      }
      
      ::slotted(*) {
        margin: 0;
      }
      
      .flex {
        flex: 1;
      }
    </style>

    <slot name="top"></slot>
    
    <span class="flex"></span>
    
    <slot></slot>
    
    <span class="flex"></span>
    
    <slot name="bottom"></slot>

    `
  }
})