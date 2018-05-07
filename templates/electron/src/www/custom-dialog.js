export default customElements.define('custom-dialog', class CustomDialog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = this.template
  }
  
  connectedCallback() {
    this.addEventListener('mouseup', ev => {
      const target = ev.composedPath()[0]
      if (target.dataset.action) this.parentNode.removeChild(this)
    })
    
  }
  get template() {
    return `<style>
      :host {
        display: flex;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      }
      .dialog {
        display: flex;
        flex-direction: column;
        width: 320px;
        height: 320px;
        border: 1px solid rgba(0,0,0,0.5);
        background: #fff;
      }
      .flex {
        flex: 1;
      }
      .row {
        display: flex;
      }
    </style>
    <span class="dialog">
      <slot></slot>
      <span class="flex"></span>
      <span class="row">
        <button data-action="cancel">cancel</button>
        <span class="flex"></span>
        <button data-action="confirm">confirm</button>
      </span>
    </span>
    `
  }
});