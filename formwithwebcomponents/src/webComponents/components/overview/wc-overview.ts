import { WcClass, type Overview } from "../../wc-class"
import overviewHtml from './overview.html?raw';
import failedOverviewHtml from './failedOverview.html?raw';
import { injectHtml } from "../utils";

class WcOverview extends WcClass {
    data = '';
    static get observedAttributes() {
        return ["data"];
    }
    constructor() {
        super('overview')
    }

    connectedCallback() {
        this.injectTailwind();
        const overViewData = JSON.parse(this.data) as Overview

        if (overViewData.acomodation && overViewData.owner) {
            this.inner.innerHTML = overviewHtml;
            injectHtml(this.inner, overViewData)
        } else {
            this.inner.innerHTML = failedOverviewHtml
        }

        const prevButton = this.inner.querySelector<HTMLButtonElement>('#prev');
        prevButton?.addEventListener('click', (e) => {
            e.preventDefault();
            this.emitStepChange('previous', this.name);
        });

        const nextButton = this.inner.querySelector<HTMLButtonElement>('#next');
        nextButton?.addEventListener('click', (e) => {
            e.preventDefault();
            this.emitStepChange('next', this.name);
        });
    }

    attributeChangedCallback(
        name: string,
        oldValue: any,
        newValue: string
    ) {
        console.log(`${name}, ${oldValue}, ${newValue} `)
        if (name === 'data') {
            this.data = JSON.parse(newValue)
        }
    };
}

window.customElements.define('wc-overview', WcOverview)