'use client'
import {ComponentProps, useEffect, useState} from 'react'
import {useTheme} from 'next-themes'
import {Switch} from '@workspace/ui/components/switch'

type Props = Omit<ComponentProps<typeof Switch>, 'checked'>

export default function ThemeSwitch(props: Props) {
    const {setTheme, resolvedTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = resolvedTheme === 'dark';

    return (
        <Switch
            {...props}
            checked={isDark}
            onCheckedChange={(checked: boolean) => {
                setTheme(checked ? 'dark' : 'light');
                props.onCheckedChange?.(checked);
            }}
        />
    );
}
