import _ from 'lodash';
import type {Layout, Layouts} from 'react-grid-layout';
import {ResizeHandle} from "@/src/types/grid";

export const generateLayout = (resizeHandles: ResizeHandle[]): Layouts => {
    const layout: Layout[] = _.range(0, 25).map((i) => {
        const h = Math.ceil(Math.random() * 4) + 1;
        return {
            x: (i * 2) % 12,
            y: Math.floor(i / 6) * h,
            w: 2,
            h: h,
            i: i.toString(),
            resizeHandles,
            isResizable: true,
        };
    });

    return { lg: layout };
};
