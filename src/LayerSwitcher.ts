import {Control} from 'ol/control';
import BaseLayer from 'ol/layer/Base';
import { Options as ControlOptions } from "ol/control/control"

interface ILayerSwitcherOptions extends ControlOptions {
    tipLabel: string;
}

class LayerSwitcher extends Control {

    private panel: HTMLDivElement;
    private shownClassName: string;
    private hiddenClassName: string;
    private mapListeners: any[];

    constructor(optOptions?: ILayerSwitcherOptions) {
        super(optOptions);

        const element = document.createElement("div");
        const tipLabel = optOptions && optOptions.tipLabel ?
            optOptions.tipLabel : "Legend";

        this.mapListeners = [];
        this.hiddenClassName = "ol-unselectable ol-control layer-switcher";
        if (this.isTouchDevice()) {
            this.hiddenClassName += " touch";
        }
        this.shownClassName = "shown";

        element.className = this.hiddenClassName;
        const button = document.createElement("button");
        button.setAttribute("title", tipLabel);
        element.appendChild(button);

        this.panel = document.createElement("div");
        this.panel.className = "panel";
        element.appendChild(this.panel);
        this.enableTouchScroll(this.panel);

        button.onmouseover = (ev: MouseEvent): any => {
            this.showPanel();
        };

        button.onclick = (e: MouseEvent): any => {
            let ev: any = e || window.event;
            this.showPanel();
            ev.preventDefault();
        };

        this.panel.onmouseout = (e: MouseEvent): any => {
            let ev: any = e || window.event;
            if (!this.panel.contains(ev.toElement || ev.relatedTarget)) {
                this.hidePanel();
            }
        };

        Control.call(this, {
            element: element,
            target: optOptions.target
        });
    }

    private showPanel(): void {
        if (!this.element.classList.contains(this.shownClassName)) {
            this.element.classList.add(this.shownClassName);
            this.renderPanel();
        }
    }

    private hidePanel(): void {
        if (this.element.classList.contains(this.shownClassName)) {
            this.element.classList.remove(this.shownClassName);
        }
    }

    private renderPanel(): void {
        this.ensureTopVisibleBaseLayerShown();

        while (this.panel.firstChild) {
            this.panel.removeChild(this.panel.firstChild);
        }

        const ul = document.createElement("ul");
        this.panel.appendChild(ul);
        this.renderLayers(this.getMap(), ul);
    }

    private renderLayers(lyr, elm): void {
        const lyrs = lyr.getLayers().getArray().slice().reverse();
        for (let i = 0, l; i < lyrs.length; i++) {
            l = lyrs[i];
            if (l.get("title")) {
                elm.appendChild(this.renderLayer(l, i));
            }
        }
    }

    private renderLayer(lyr, idx: number): HTMLLIElement {

        const li = document.createElement("li");

        const lyrTitle = lyr.get("title");
        const lyrId = this.uuid();
        const label = document.createElement("label");

        if (lyr.getLayers && !lyr.get("combine")) {

            li.className = "group";
            label.innerHTML = lyrTitle;
            li.appendChild(label);
            const ul = document.createElement("ul");
            li.appendChild(ul);
            this.renderLayers(lyr, ul);

        } else {

            li.className = "layer";
            const input = document.createElement("input");
            if (lyr.get("type") === "base") {
                input.type = "radio";
                input.name = "base";
            } else {
                input.type = "checkbox";
            }
            input.id = lyrId;
            input.checked = lyr.get("visible");
            input.onchange = (ev: Event): any => {
                // console.log("onchange")
                let e: any = ev.target;
                this.setLayerVisible(lyr, e.checked);
            };
            li.appendChild(input);

            label.htmlFor = lyrId;
            label.innerHTML = lyrTitle;

            const rsl = this.getMap().getView().getResolution();
            if (rsl > lyr.getMaxResolution() || rsl < lyr.getMinResolution()) {
                label.className += " disabled";
            }

            li.appendChild(label);
        }

        return li;
    }

    private setLayerVisible(lyr: BaseLayer, visible: boolean): void {
        const map = this.getMap();
        lyr.setVisible(visible);
        if (visible && lyr.get("type") === "base") {
            // Hide all other base layers regardless of grouping
            this.forEachRecursive(map, (l, idx, a) => {
                // console.log(l.get("title"));
                if (l !== lyr && l.get("type") === "base") {
                    l.setVisible(false);
                }
            });
        }
    }

    private forEachRecursive(lyr: any, fn: any): void {
        let layers = lyr.getLayers();
        layers.forEach(element => {
            // console.log( "foreach " + element.get("title"));
            fn(element, element.idx, element.a);
            if (element.getLayers) {
                this.forEachRecursive(element, fn);
            }
        });
    }

    private uuid(): string {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            // tslint:disable-next-line:no-bitwise
            let r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    private ensureTopVisibleBaseLayerShown(): void {
        let lastVisibleBaseLyr;
        this.forEachRecursive(this.getMap(), (l: BaseLayer, idx: number, a: any) => {
            if (l.get("type") === "base" && l.getVisible()) {
                lastVisibleBaseLyr = l;
            }
        });

        if (lastVisibleBaseLyr) { this.setLayerVisible(lastVisibleBaseLyr, true); }
    }

    private enableTouchScroll(elm: any): void {
        if (this.isTouchDevice()) {
            let scrollStartPos = 0;
            elm.addEventListener("touchstart", function (event) {
                scrollStartPos = this.scrollTop + event.touches[0].pageY;
            }, false);
            elm.addEventListener("touchmove", function (event) {
                this.scrollTop = scrollStartPos - event.touches[0].pageY;
            }, false);
        }
    }

    private isTouchDevice(): boolean {
        try {
            document.createEvent("TouchEvent");
            return true;
        } catch (e) {
            return false;
        }
    }
}

export { LayerSwitcher };
