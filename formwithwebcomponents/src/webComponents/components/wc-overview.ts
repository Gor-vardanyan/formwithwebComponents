class WcOverview extends HTMLElement {
    inner = this.attachShadow({ mode: 'closed' })

    constructor() {
        super()
    }
    connectedCallback() {
        this.inner.innerHTML =/*html*/ `
        <div>
        overview
        </div>`
    }
}

window.customElements.define('wc-overview', WcOverview)