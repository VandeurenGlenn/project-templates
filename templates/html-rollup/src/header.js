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
        border-bottom: 1px solid rgba(0, 0, 0, 0.72)
      }
    </style>

      <slot name="top"></slot>
      <slot></slot>
      <slot name="bottom"></slot>

    `
  }
})