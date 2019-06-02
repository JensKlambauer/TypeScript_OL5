import { Control } from "ol/control";
import { Options as ControlOptions } from "ol/control/control"
import { Coordinate } from 'ol/coordinate';
import Map from "ol/map";

interface IResetOptions extends ControlOptions {
    center?: Coordinate;
    zoom?: number;
    tipLabel?: string;
}

class ResetControl extends Control {

    constructor(options?: IResetOptions) {
        super(options);

        options = options || {};
        const tipLabel = options.tipLabel ?
            options.tipLabel : "Reset-Button";

        const button = document.createElement("button");
        button.innerHTML = "R";
        button.setAttribute("title", tipLabel);

        button.addEventListener("click", (ev: MouseEvent): any => {
            this.resetMap(this.getMap(), options.center, options.zoom);
        });

        const element = document.createElement("div");
        element.className = "reset-map ol-control";
        element.appendChild(button);

        super({
            element: element,
            target: options.target
        });
    }

    // get Control(): Control {
    //     return this;
    // }

    private resetMap(map: Map, center: Coordinate, zoom: number): void {
        map.getView().setCenter(center);
        map.getView().setZoom(zoom);
    }
}

export { ResetControl };
