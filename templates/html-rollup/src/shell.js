import './header'
import './toolbar'
import './pages'

export default customElements.define('$project-shell', class extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = this.template
  }
  
  get template() {
    return `
    <style></style>
    <slot name="header"></slot>
    <slot name="pages"></slot>
    `
  }
})