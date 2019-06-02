interface IMapService {
    // Karte: Map;
    initMap: () => void;
    jumpToPosition: (lon: number, lat: number) => boolean;
    changeLayer: () => void;
    printMap: () => void;
}

export default IMapService;
