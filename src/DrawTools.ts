import { Control } from "ol/control";
import Draw from "ol/interaction/Draw";
import VectorLayer from "ol/layer/Vector";
import { Options as ControlOptions } from "ol/control/control"
import GeometryType from 'ol/geom/GeometryType';

class DrawTools extends Control {
    private polygon: Draw;
    // private element: HTMLDivElement;
    private panel: HTMLDivElement;
    private shownClassName: string;
    private hiddenClassName: string;
    private vector: VectorLayer;

    constructor(vector: VectorLayer, optOptions?: ControlOptions) {
        const options = optOptions || {};

        const element = document.createElement("div");
        if (options.element == null) {
            options.element = element;
        }

        super(options);
        this.vector = vector;

        this.shownClassName = "shown";
        const hiddenClassName = "ol-unselectable ol-control draw-tools";
        element.className = hiddenClassName;
        const button = document.createElement("button");
        button.setAttribute("title", "Zeichnen");
        element.appendChild(button);

        this.panel = document.createElement("div");
        this.panel.className = "panel";
        element.appendChild(this.panel);

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

        this.polygon = new Draw({
            maxPoints: 5,
            minPoints: 3,
            source: this.vector.getSource(),
            // freehand: true,
            type: GeometryType.POLYGON
        });
    }

    public Polygon(): Draw {
        return this.polygon;
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
        // while (this.panel.firstChild) {
        //     this.panel.removeChild(this.panel.firstChild);
        // }

        // Panel-Form soll nur einmal gerendert werden
        if (this.panel.firstChild != null) {
            return;
        }

        let form = this.createDrawToolsForm();
        form.style.removeProperty("display");
        this.panel.appendChild(form);
    }

    private createDrawToolsForm(): HTMLFormElement {
        const form = document.createElement("form");
        form.setAttribute("id", "options-form");
        form.style.cssText = "display: none";
        form.autocomplete = "off";
        form.onchange = (ev: Event): any => {
            console.log("onchange");
            let target: any = ev.target;
            console.log("value " + target.value);
        };

        const ulLbl = document.createElement("ul");
        ulLbl.setAttribute("id", "radioButtons");
        const li = document.createElement("li");
        li.className = "group";
        const label = document.createElement("label");
        label.innerHTML = "Zeichenfunktionen";
        li.appendChild(label);
        const ul = document.createElement("ul");
        li.appendChild(ul);
        ul.appendChild(this.createInputElement("radio", "Polygon", "Fläche/Polygon"));
        ul.appendChild(this.createInputElement("radio", "LineString", "Linie"));
        ul.appendChild(this.createInputElement("radio", "modify", "Ändern"));
        ul.appendChild(this.createInputElement("radio", "remove", "Löschen"));
        ulLbl.appendChild(li);
        form.appendChild(ulLbl);
        return form;
    }

    private createInputElement(type: string, action: string, label?: string): HTMLElement {
        const li = document.createElement("li");
        li.className = "layer";
        const labelElem = document.createElement("label");
        const inputElem = document.createElement("input");
        inputElem.setAttribute("type", type);
        inputElem.setAttribute("name", "interaction");
        inputElem.setAttribute("value", action);
        labelElem.appendChild(inputElem);
        labelElem.innerHTML += " " + label + " ";
        li.appendChild(labelElem);
        return li;
    }
}

export { DrawTools };
