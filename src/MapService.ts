import Map from "ol/Map"
import Attribution from "ol/control/Attribution";
import MousePosition from "ol/control/MousePosition";
import ScaleLine from "ol/control/ScaleLine";
import Zoom from "ol/control/Zoom";
// import ZoomSlider from "ol/control/ZoomSlider";
// import XYZ from "ol/source/xyz";
import View from "ol/View";
import Osm from "ol/source/osm";
import Group from "ol/layer/Group";
import IMapService from "./IMapService";
import { ResetControl } from "./ResetControl";
// import object from "ol/object";
import { LayerSwitcher } from "./LayerSwitcher";
// import render from "ol/render/event";
import { saveAs } from "file-saver";
import { SachsenWMSDop, Siedlung, Gemeinden, LandkreiseLayer } from "./Layers";
import { KartenFeatures } from "./Features";
import { Popup } from "./Popup";
// import { InfoOverlay } from "./InfoOverlay";
// import feature from "ol/render/feature";
// import Snap from "ol/interaction/Snap";
// import Projection from 'ol/proj/Projection';
import { addProjection, addCoordinateTransforms, transform, get, transformExtent } from 'ol/proj';
import TileLayer from "ol/layer/tile";
import VectorLayer from "ol/layer/Vector";
import { Coordinate, toStringHDMS, createStringXY } from 'ol/coordinate';
import { containsXY } from 'ol/extent';
// import { DrawTools } from "./DrawTools";

class MapService implements IMapService {
    private popup: Popup;
    private siedlung: TileLayer;
    private map: Map;
    private osmLayer: TileLayer;
    private sachsenLayer: TileLayer;
    private gemeinden: TileLayer;
    private landkreise: VectorLayer;
    private kartenFeats: VectorLayer;
    private zoomStufe = 12;
    private center = transform([12.302429, 50.624995], "EPSG:4326", "EPSG:3857"); // [13.2856, 51.2986]
    private deutschlandExtent = transformExtent([5.7, 47.00, 15.5, 55.20], "EPSG:4326", "EPSG:3857");

    constructor() {
        this.osmLayer = new TileLayer({ source: new Osm(), visible: true });
        this.osmLayer.set("title", "OpenStreetMap");
        this.osmLayer.set("type", "base");
        this.sachsenLayer = new SachsenWMSDop();
        this.siedlung = new Siedlung();
        this.gemeinden = new Gemeinden();
        this.landkreise = new LandkreiseLayer("Sachsen-LK");
        this.kartenFeats = new KartenFeatures("Features");
    }

    public initMap(): void {
        const controls = [
            new Attribution({
                collapsible: true
            }),
            new MousePosition({
                coordinateFormat: createStringXY(5),
                projection: "EPSG:4326",
                undefinedHTML: "außerhalb",
            }),
            new ScaleLine(),
            new Zoom(),
            // new ZoomSlider()
        ];

        const baseGrp = new Group({ layers: [this.sachsenLayer, this.osmLayer] });
        baseGrp.set("title", "Basis");
        const overlayGrp = new Group({ layers: [this.siedlung, this.gemeinden, this.landkreise, this.kartenFeats] });
        overlayGrp.set("title", "Overlays");

        this.map = new Map({
            controls: controls,
            layers: [baseGrp, overlayGrp],
            target: "map",
            view: new View({
                center: this.center,
                maxZoom: 23,
                minZoom: 7,
                projection: get("EPSG:3857"),
                zoom: 14,
            }),
        });

        const resetMapControl = new ResetControl({ center: this.center, zoom: this.zoomStufe, tipLabel: "Reset Karte" });
        this.map.addControl(resetMapControl);

        const switcher = new LayerSwitcher({ tipLabel: "Layeranzeige" });
        this.map.addControl(switcher);

        this.popup = new Popup();
        this.map.addOverlay(this.popup);
        this.map.on("singleclick", (evt) => this.popupShow(evt));

        // const infoOverlay = new InfoOverlay();
        // this.map.addOverlay(infoOverlay);
        // infoOverlay.show(this.map.getView().getCenter(),
        //     "<div> Bitte betroffene Region auf der Karte markieren: " +
        //     "<ul><li>Stift anklicken</li>" +
        //     "<li>Flächen zeichnen wählen</li>" +
        //     "<li>Einzelklick in Karte setzt Punkt (Mobilgeräte maximal 5 Punkte) </li>" +
        //     "<li>ansonsten auf den 1. Punkt klicken schließt Fläche</li><li>Hilfe: Tel: 0XXXXX XXXXXX </li>" +
        //     "</ul></div>");

        // this.map.on("moveend", () => {
        //     // Test Zentrierung die Info wenn die Karte bewegt wurde
        //     // https://openlayers.org/en/latest/examples/moveend.html
        //     infoOverlay.setPosition(this.map.getView().getCenter());
        // });

        // const drawtools = new DrawTools(this.kartenFeats);
        // this.map.addControl(drawtools);
        // const polygon = drawtools.Polygon();
        // this.map.addInteraction(polygon);
        // polygon.setActive(true);
        // const snap = new Snap({
        //     source: this.kartenFeats.getSource()
        // });
        // this.map.addInteraction(snap);
    }

    public jumpToPosition(lon: number, lat: number): boolean {
        try {
            const coord = transform([lon, lat], "EPSG:4326", "EPSG:3857");
            if (containsXY(this.deutschlandExtent, coord[0], coord[1])) {
                this.map.getView().setCenter(coord);
                this.map.getView().setZoom(13);
                return true;
            }
        } catch (Error) {
            console.log(Error.message);
            return false;
        }
        return false;
    }

    public printMap(): void {      
        const width = 800;
        const height = 600;
        const size = this.map.getSize();
        console.log("loading " + size);
        const extentorg = this.map.getView().calculateExtent(size);
        const map = this.map;

        map.once('rendercomplete', function (event) {
            const canvas = event.context.canvas;
            const targetCanvas = document.createElement("canvas");
            const size1 = map.getSize();
            console.log("targetCanvas " + map.getSize());
            targetCanvas.width = size1[0];
            targetCanvas.height = size1[1];
            targetCanvas.getContext("2d").drawImage(canvas,
                0, 0, canvas.width, canvas.height,
                0, 0, targetCanvas.width, targetCanvas.height);
            targetCanvas.toBlob(function (blob) {
                saveAs(blob, "karte.png");
                console.log("saveAs " + map.getSize());
            });
        });

        map.setSize([width, height]);
        map.getView().fit(extentorg, { size: [width, height] });
        // map.renderSync();
        console.log("renderSync end " + map.getSize());
    }

    public changeLayer(): void {
        // const layers = this.map.getLayers().getArray();
        /*layers.forEach(element => {
            console.log(element.get("title"));
        });*/

        // if (layers[0].get("title") === "Osm") {
        //     this.map.removeLayer(this.osmLayer);
        //     this.map.addLayer(this.sachsenLayer);
        //     return;
        // }

        // this.map.removeLayer(this.sachsenLayer);
        // this.map.addLayer(this.osmLayer);
    }

    private popupShow(evt: any): void {
        const prettyCoord = toStringHDMS(transform(evt.coordinate, "EPSG:3857", "EPSG:4326"), 2);
        this.popup.show(evt.coordinate, "<div><h3>Koordinaten</h3><code class='code'>" + prettyCoord + "</code></div>");
    }
}

// export {MapService};
export { MapService as Karte };
