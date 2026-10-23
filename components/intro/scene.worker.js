// Runs the intro's drawing (scene.js) off the main thread, on the canvas
// IntroCanvas.jsx hands over. Messages in: init, resize, freeze. Messages out:
// whatever the scene reports - box, pupil, formed.
import { createIntroScene } from './scene';

let scene = null;

self.onmessage = ({ data }) => {
    if (data.type === 'init') {
        scene = createIntroScene(data.canvas, data.options, (type, payload) => self.postMessage({ type, payload }));
    } else if (data.type === 'resize') {
        scene?.resize(data.width, data.height, data.dpr);
    } else if (data.type === 'freeze') {
        scene?.freeze();
    }
};
