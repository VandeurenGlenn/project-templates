import mixin from './../node_modules/custom-select-mixins/src/select-mixin'

export default customElements.define('$project-pages', class extends mixin(HTMLElement) {
  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = this.template
  }
  
  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();
  }
  
  get template() {
    return `
    <style></style>
    <slot></slot>
    `
  }
})