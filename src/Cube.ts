customElements.define(
    'cube-volume',
    class extends HTMLElement {
        public constructor() {
            super();
            let template = document.getElementById('cube-volume') as HTMLTemplateElement;
            let templateContent = template.content;

            this.attachShadow({ mode: 'open' }).appendChild(templateContent.cloneNode(true));
        }

        public connectedCallback(): void {
            const cube = this.shadowRoot.querySelector('.cube') as HTMLElement;
            window.onmousemove = e => {
                console.log((window.innerWidth - e.pageX) / 2, (window.innerHeight - e.pageY) / 2);
                const xOneUnit = window.innerWidth / 200;
                const yOneUnit = window.innerHeight / 200;
                const xPercent = (e.pageX - window.innerWidth / 2) / xOneUnit + 50;
                const yPercent = (e.pageY - window.innerHeight / 2) / yOneUnit + 50;
                cube.style['perspective-origin'] = `${xPercent}% ${yPercent}%`;
            };
        }
    },
);
