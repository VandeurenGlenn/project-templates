import './../../node_modules/custom-header/src/custom-header.js'
import './../../node_modules/custom-drawer/custom-drawer.js'
import './../../node_modules/custom-pages/src/custom-pages.js'
import './../../node_modules/custom-selector/src/index'

export default customElements.define('app-shell', class AppShell extends HTMLElement {
  get selector() {
    return this.shadowRoot.querySelector('custom-selector')
  }
  get pages() {
    return this.shadowRoot.querySelector('custom-pages')
  }
  get template() {
    return `
    <style>
      :host {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
      }
      main {
        display: flex;
        height: 100%;
      }
      custom-drawer {
        opacity: 1;
      }
      button {
        height: 48px;
        user-select: none;
        background: transparent;
        border-radius: 24px;
      }
      .fab {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: green;
      }
    </style>
    <button class="fab">+</button>
    <custom-header></custom-header>
    <main>
      <custom-drawer>
        <custom-selector slot="content" attr-for-selected="data-route" style="height: 100%;">
          <span data-route="home">home</span>
        </custom-selector>
        
        
        
      </custom-drawer>
      <custom-pages attr-for-selected="data-route">
        <home-section data-route="dashboard"></home-section>
      </custom-pages>
      
    </main>
    
    <slot></slot>
    `
  }
  
  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = this.template
  }
  
  async load() {
    if (!customElements.get(`${this.selector.selected}-section`)) {
      await import(`./sections/${this.selector.selected}.js`)
    }
    this.pages.select(this.selector.selected)
  }
  
  connectedCallback() {
    this.selector.addEventListener('selected', async () => {
      this.load()
    })
    this.selector.selected = 'home'
    this.load()
  }
  
  
})