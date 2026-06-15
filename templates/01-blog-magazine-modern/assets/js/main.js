const svgCache = new Map();

function replaceAllSVGs() {
    async function replace(imgElement) {
        const src = imgElement.src; // resolved absolute URL
        if (!src) return;

        let svgElement;
        if (svgCache.has(src)) {
            svgElement = svgCache.get(src).cloneNode(true);
        } else {
            const response = await fetch(src);
            const text = await response.text();

            const doc = new DOMParser().parseFromString(text, "image/svg+xml");
            const parsedSVG = doc.querySelector("svg");
            if (!parsedSVG) return;

            // store original
            svgCache.set(src, parsedSVG);

            // clone for this instance
            svgElement = parsedSVG.cloneNode(true);

            svgElement.classList.add(...imgElement.classList);
            imgElement.replaceWith(svgElement);
        }
    }

    document.querySelectorAll("img[data-svg]").forEach(replace);
}

function main() {
    replaceAllSVGs();
}

main();
