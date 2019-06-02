import Overlay, {Options as OverlayOptions} from "ol/Overlay";
import { Coordinate } from 'ol/coordinate';

class Popup extends Overlay {

    private content: HTMLDivElement;
    private closer: HTMLAnchorElement;
    private container: HTMLDivElement;

    constructor(optOptions?: OverlayOptions) {

        const options = optOptions || {};
        if (options.autoPan == null) {
            options.autoPan = true;
        }

        if (options.autoPanAnimation == null) {
            options.autoPanAnimation = { duration: 250 };
        }

        super(options);

        this.container = document.createElement("div");
        this.container.className = "ol-popup";
        // this.container.setAttribute("id", "popup");

        this.closer = document.createElement("a");
        this.closer.className = "ol-popup-closer";
        this.closer.href = "#";
        this.container.appendChild(this.closer);

        this.closer.addEventListener("click", (evt) => {
            this.container.style.display = "none";
            this.closer.blur();
            evt.preventDefault();
        }, false);

        this.content = document.createElement("div");
        this.content.className = "ol-popup-content";
        this.container.appendChild(this.content);

        // Apply workaround to enable scrolling of content div on touch devices
        this.enableTouchScroll(this.content);

        this.setElement(this.container);
    }

    public show (coord: Coordinate, html: any): void {
        if (html instanceof HTMLElement) {
            this.content.innerHTML = "";
            this.content.appendChild(html);
        } else {
            this.content.innerHTML = html;
        }
        this.container.style.display = "block";
        this.content.scrollTop = 0;
        this.setPosition(coord);
    }

    public hide (): void {
        this.container.style.display = "none";
    }

    public isOpened (): boolean {
        return this.container.style.display === "block";
    }

    private isTouchDevice(): boolean {
        try {
            document.createEvent("TouchEvent");
            return true;
        } catch (e) {
            return false;
        }
    }

    private enableTouchScroll(elm: any): void {
        if (this.isTouchDevice()) {
            let scrollStartPos = 0;
            elm.addEventListener("touchstart", function (event) {
                scrollStartPos = this.scrollTop + event.touches[0].pageY;
            }, false);
            elm.addEventListener("touchmove", function (event) {
                this.scrollTop = scrollStartPos - event.touches[0].pageY;
            }, false);
        }
    }
}

export { Popup };
