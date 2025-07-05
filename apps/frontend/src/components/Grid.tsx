'use client'
import {Responsive, WidthProvider} from 'react-grid-layout';
import {useEffect, useState} from 'react';
import {generateLayout} from "@/src/utils/girdHelper";
import {ResizeHandle} from "@/src/types/grid";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";


const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Grid() {
    const [mounted, setMounted] = useState(false);

    const [layouts, setLayouts] = useState(generateLayout(['se']));
    const [compactType, setCompactType] = useState<'vertical' | 'horizontal' | null>('vertical');
    const [resizeHandles, setResizeHandles] = useState<ResizeHandle[]>(['se']);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
            rowHeight={30}
            margin={[10, 10]}
            compactType={compactType}
            resizeHandles={resizeHandles}
            preventCollision={!compactType}
            onLayoutChange={(layout, allLayouts) => {
                setLayouts(allLayouts);
            }}
            measureBeforeMount={false}
        >
            {layouts.lg?.map((item) => (
                <div
                    key={item.i}
                    className={`${item.static ? 'static' : ''} dark:bg-gray-800 bg-gray-300`}
                >
                    {item.i}
                </div>
            ))}
        </ResponsiveGridLayout>
    );
};
