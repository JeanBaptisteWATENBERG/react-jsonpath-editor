import { css } from 'docz-plugin-css';
import { svgr } from 'docz-plugin-svgr';

export default {
    themeConfig: {
        mode: 'dark'
    },
    plugins: [
        svgr(),
        css()
    ]
};