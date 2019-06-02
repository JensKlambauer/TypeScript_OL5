import Vector from "ol/layer/Vector";
import VectorSource, { Options as VectorOptions } from "ol/source/Vector";
import GeoJSON from "ol/format/geojson";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Circle from "ol/style/Circle";
import Collection from "ol/Collection";
import Feature from "ol/Feature";
import WKT from "ol/format/wkt";
import { bbox } from 'ol/loadingstrategy';
import { Extent } from 'ol/extent';
import Projection from 'ol/proj/Projection';
import axios from "axios";

class KartenFeatures extends Vector {
    private vectorSource: VectorSource;

    constructor(title: string) {
        super();    // {title: title}
        this.set("title", title);
        this.setVisible(false);

        // VectorSource, Options
        let features = new Collection<Feature>();
        const options: VectorOptions = {
            features: features,
            format: new GeoJSON(),
            strategy: bbox,
        };
        options.loader = this.loader;
        this.vectorSource = new VectorSource(options);
        this.setSource(this.vectorSource);
        // Style
        const style = new Style({
            fill: new Fill({ color: "rgba(255, 0, 0, 0.1)" }),
            image: new Circle({ fill: new Fill({ color: "#ff0000" }), radius: 5 }),
            stroke: new Stroke({ color: "#ff0000", width: 2 })
        });
        this.setStyle(style);
        // super({source: vectorSource, visible: false, style: style });
    }

    private addFeatures(features: Array<Feature>): void {
        if (features == null) {
            return;
        }

        features.forEach((feat, index, feats) => {
            // console.log("idx: " + index);
            this.vectorSource.addFeature(feat);
        });
    }

    private loader = (extent: Extent, resolution: number, proj: Projection): void => {
        const url = "http://localhost:50777/api/v1/PrintRbach/Features/";
        // const daten = JSON.stringify({ "IdProj": 5, "Content": "Täßste" });
        (async () => {
            const feats = new Array<Feature>();
            const response = await this.callWebApi(url, 29);
            if (response) {
                const { data } = response;
                if (data.error === 0) {
                    const format = new WKT();
                    data.data.features.forEach((feat) => {
                        const feature = format.readFeature(feat.Wkt, {
                            dataProjection: "EPSG:4326",
                            featureProjection: "EPSG:3857"
                        });
                        if (feature) {
                            feature.setId(feat.FeatId);
                            feats.push(feature);
                        }
                    });
                    this.addFeatures(feats);
                } else {
                    console.log("Fehler - " + data.message);
                }
            } else {
                console.log("Fehler - Server");
            }
        })();
        // console.log("Loader Call");
    }

    private async callWebApi(url: string, id: number): Promise<any> {
        return axios.get(`${url}/${id}`, { responseType: "json" })
            .catch((err) => { console.log("** An error occurred during the XMLHttpRequest " + err) });
        // const ret = { "error": 1, "message": "Fehler - Abfrage nicht erfolgreich." };
        // let dataset = await new Promise(resolve => {
        //     let xhr = new XMLHttpRequest();
        //     xhr.open("GET", url + "/" + id, true);
        //     xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        //     xhr.onload = function(e) {
        //       resolve(xhr.response);
        //     };
        //     xhr.onerror = function () {
        //       resolve(undefined);
        //       console.error("** An error occurred during the XMLHttpRequest");
        //     };
        //     xhr.send();
        //  });

        //  return dataset;
    }
}

export { KartenFeatures };
