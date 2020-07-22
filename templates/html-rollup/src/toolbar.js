export default customElements.define('$project-toolbar', class extends HTMLElement {
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
        background: var(--dark-primary-color);
      }
    </style>
      <slot name="left"></slot>
      <slot></slot>
      <slot name="right"></slot>
    `
  }
})