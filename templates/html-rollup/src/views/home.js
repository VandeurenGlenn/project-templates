import './../header'
import './../toolbar'

export default customElements.define('$project-home-view', class extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = this.template
  }
  
  get template() {
    return `
    <style>
      :host {
        color: var(--primary-text-color);
      }
    </style>
    `
  }
})