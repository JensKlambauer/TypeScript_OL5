import {JsonObject, JsonProperty} from "json2typescript";

interface IOsmSearchresult {
    osm_id: string;
    lat: string;
    lon: string;
    type: string;
    display_name: string;
}

@JsonObject("Searchresult")
class Searchresult {
    @JsonProperty("osm_id", String)
    public osmId: string  = undefined;
    @JsonProperty("lat", String)
    public lat: string  = undefined;
    @JsonProperty("lon", String)
    public lon: string  = undefined;
    @JsonProperty("type", String)
    public type: string  = undefined;
    @JsonProperty("display_name", String)
    public anzeigeTxt: string  = undefined;
}

export { IOsmSearchresult, Searchresult };
