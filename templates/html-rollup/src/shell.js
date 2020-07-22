import './header'
import './toolbar'
import './drawer'
import './pages'

export default customElements.define('$project-shell', class extends HTMLElement {
  
  static get observedAttributes() {
    return ['desktop']
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue
  }
  
  get _drawer() {
    return this.shadowRoot.querySelector('$project-drawer')
  }
  
  set desktop(value) {
    if (value) this._drawer.setAttribute('opened', '')
    else this._drawer.removeAttribute('opened')
  }
  
  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = this.template
    
    this._init()
  }
  
  async _init() {
    await import('./views/home.js')
    
    const updatePlatform = ({matches}) => {
      if (matches) this.setAttribute('desktop', false)
      else this.setAttribute('desktop', true)
    }
    
    const desktop = globalThis.matchMedia('(max-width: 720px)')
    updatePlatform(desktop)
    desktop.addListener(updatePlatform)
  }
  
  get template() {
    return `
    <style>
    :host {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
    }
    .container {
      position: absolute;
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      right: 0;
      bottom: 0;
      top: 0;
    }
    :host([desktop="true"][drawer-opened]) .container {
      width: calc(100% - 256px);
    }
    </style>
    <$project-drawer>
    
    </$project-drawer>
    
    <span class="container">
    
      <$project-header>
      
          <h1 slot="top">$project</h1>
        
          <h2 slot="bottom">subtitle</h2>
        
      </$project-header>
      
      <$project-pages>
        <$project-home-view></$project-home-view>
      </$project-pages>
    </span>
    `
  }
})