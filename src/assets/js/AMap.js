export default function MapLoader() {
    return new Promise((resolve, reject) => {
        if (window.AMap) {
            resolve(window.AMap)
        } else {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src =
                'http://webapi.amap.com/maps?v=1.4.11&callback=initAMap&key=84fd5492fc4347f796de12a67de1df84';
            script.onerror = reject;
            document.head.appendChild(script);
        }
        window.initAMap = () => {
            resolve(window.AMap);
        }
    })
}