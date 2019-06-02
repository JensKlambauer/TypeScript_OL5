import { IOsmSearchresult, Searchresult } from "./OsmSearchresults";
import axios from "axios";
// import "whatwg-fetch";
import { JsonConvert, OperationMode, ValueCheckingMode } from "json2typescript";

interface ISearchService {
    SucheOsmAdressen: (suchtext: string) => Promise<Array<Searchresult>>;
}

class SearchService implements ISearchService {

    private url: string;
    constructor() {
        this.url = "https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=de&addressdetails=1&q=";
    }

    public async SucheOsmAdressen(suchtext: string): Promise<Array<Searchresult>> {
        if (!suchtext || suchtext === "") {
            return;
        }
        
        // const getReq = await axios.get(this.url + encodeURIComponent(suchtext), { responseType: "json" })
        //     .catch((err) => { console.log("** An error occurred during the XMLHttpRequest " + err) });
        // // console.log("getReq", getReq)        
        // if (getReq && getReq.data) {            
        //     const res = getReq.data.map((item) => {
        //         return { osmId: item.osm_id, lat: item.lat, lon: item.lon, type: item.type, anzeigeTxt: item.display_name };
        //     })
        //     // console.log("res", res)
        //     return res;
        // }

        const getReq = await axios.get(this.url + encodeURIComponent(suchtext), { responseType: "json" })
                            .catch((err) => console.log(err));  
        // console.log("data", getReq)        
        if (getReq && getReq.data)  {
            const data = getReq.data;
            const jsonConvert = new JsonConvert();
            jsonConvert.ignorePrimitiveChecks = true;
            // jsonConvert.operationMode = OperationMode.LOGGING; // print some debug data
            // const res = data.map(obj =>  jsonConvert.deserialize(obj, Searchresult))
            const res = jsonConvert.deserializeArray(data, Searchresult);
            // console.log("res", res)
            return res;
        }

        return;
    }
}

export default SearchService;
