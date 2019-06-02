import VectorLayer from "ol/layer/Vector";
import VectorSource, {Options as VectorOptions} from "ol/source/Vector";
import Collection from "ol/Collection";
import Feature from "ol/Feature";
import GeoJSON from "ol/format/geojson";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Circle from "ol/style/Circle";
import { bbox } from 'ol/loadingstrategy';
import Projection from 'ol/proj/Projection';
import { Extent } from 'ol/extent';

class DrawVector extends VectorLayer {
    private vectorSource: VectorSource;

    constructor() {
        super();
        this.set("title", "Zeichentools");
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
            image: new Circle({fill: new Fill({color: "#ff0000"}), radius: 5 }),
            stroke: new Stroke({ color: "#ff0000", width: 2 })
        });
        this.setStyle(style);
    }

    private loader = (extent: Extent, resolution: number, proj: Projection): void => {
        (async () => {
            const feats = new Array<Feature>();
        })();
    }
}

export { DrawVector };
