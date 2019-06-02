// import "ol/ol.css";
import "./app.css";
import "promise-polyfill/src/polyfill";

import { Karte } from "./MapService";
import { Searchresult } from "./OsmSearchresults";
import SearchService from "./SearchService";

let map: Karte = null;

// ready(function () {
// console.log("Karte ready!");
map = new Karte();
map.initMap();
// });

document.querySelector("#ortsuchen").addEventListener("click", (evt) => {
    const suchTxt = document.querySelector<HTMLInputElement>("#suchText").value;
    (async function () {
        const sucheService = new SearchService();
        const data = await sucheService.SucheOsmAdressen(suchTxt);
        addErgebnisLinks(data);
        refreshLinks();
    })();
});

document.querySelector("#printMap").addEventListener("click", () => {
    // console.log("Karte export");
    map.printMap();
});

function addErgebnisLinks(osmresult?: Searchresult[]): void {
    // console.log(osmresult);
    document.querySelector("#suchergebnisse").innerHTML = "";
    if (!osmresult || osmresult.length === 0) {
        document.querySelector("#suchergebnisse").innerHTML = "<ul><li>Keine Ergebnisse gefunden!</li></ul>";
        return;
    }

    const ulElem = document.createElement("ul");
    for (let res of osmresult) {
        const liElem = document.createElement("li");
        const linkElem = document.createElement("a");
        linkElem.id = res.osmId;
        linkElem.href = "#";
        linkElem.className = "jumptolonlat";
        linkElem.innerHTML = res.anzeigeTxt;
        linkElem.setAttribute("data-request-lon", res.lon);
        linkElem.setAttribute("data-request-lat", res.lat);
        // linkElem.onclick = jumptolonlat(parseFloat(res.lon), parseFloat(res.lat));
        liElem.appendChild(linkElem);
        ulElem.appendChild(liElem);
    }
    document.querySelector("#suchergebnisse").appendChild(ulElem);
}

function refreshLinks(): void {
    let links = document.querySelectorAll(".jumptolonlat");
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener("click", () => {
            const lon = parseFloat(links[i].getAttribute("data-request-lon"));
            const lat = parseFloat(links[i].getAttribute("data-request-lat"));
            jumptolonlat(lon, lat);
        });
    }
}

function jumptolonlat(lon?: number, lat?: number): any {
    if (lon && lat) {
        if (map.jumpToPosition(lon, lat)) {
            document.querySelector("#suchergebnisse").innerHTML = "";
            return true;
        }
    }

    // alert("Ergebnis ausserhalb " + lon + " / " + lat);
    return false;
}

// function ready(callback) {
//     // in case the document is already rendered
//     if (document.readyState !== "loading") {
//         callback();
//     } else if (document.addEventListener) {
//         document.addEventListener("DOMContentLoaded", callback);
//     } else {
//         document.addEventListener("onreadystatechange", function () {
//             if (document.readyState === "complete") {
//                 callback();
//             }
//         });
//     }
// }
