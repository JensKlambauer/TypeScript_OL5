import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/geojson";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import TileLayer from "ol/layer/tile";
import TileWMS from "ol/source/tilewms";
import { Options as VectorOptions} from "ol/source/Vector";

class LandkreiseLayer extends VectorLayer {
    private title: string;

    constructor(title: string) {
        const options: VectorOptions = {
            url : "files/landkreiseSachsen.json",
            format: new GeoJSON(),  // { featureProjection: "EPSG:3857", defaultDataProjection: "EPSG:4326" }
        };
        const vs = new VectorSource(options);
        const style = new Style({
            fill: new Fill({color: "rgba(255, 0, 0, 0.0)"}),
            stroke: new Stroke({ color: "#0000ff", width: 1})
        });

        super({source: vs, visible: false, style: style });
        this.title = title;
        this.set("title", this.title);
    }
}

class SachsenWMSDop extends TileLayer {
    constructor() {
        const src = new TileWMS({
            url: "https://geodienste.sachsen.de/wms_geosn_dop-rgb/guest",
            params: {
                LAYERS: ["sn_dop_020"], // , "sn_dop_020_info"
                SRID: "3857",
            },
        });

        super({ source: src, visible: false });
        this.set("title", "SachenDop");
        this.set("type", "base");
    }
}

class Siedlung extends TileLayer {
    constructor() {
        const src = new TileWMS({
            url: "https://geodienste.sachsen.de/wms_geosn_webatlas-sn/guest",
            params: {
                "LAYERS": "Siedlung",
                "SRID": "3857",
                "MAP_TYPE": "Siedlung"
            },
            // crossOrigin: 'anonymous'
        });
        super({source: src, visible: false});
        this.set("title", "Siedlung");
    }
}

class Gemeinden extends TileLayer {

    constructor() {
        const src = new TileWMS({
            url: "http://sg.geodatenzentrum.de/wms_vg250",
            params: {
                "LAYERS": ["vg250_gem", "vg250_krs"].join(),
                "SRID": "3857"
            }
        });
        super({source: src, visible: false});
        this.set("title", "Gemeinden");
    }
}

export { LandkreiseLayer, SachsenWMSDop, Siedlung, Gemeinden };

