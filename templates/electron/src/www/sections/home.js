export default customElements.define('home-view', class HomeView extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = this.template
    
  }
  
  get template() {
    return `<style></style>
    <slot></slot>
    `
  }
})