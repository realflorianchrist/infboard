'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Switch } from '@workspace/ui/components/switch'

export default function ThemeSwitch() {
    const { setTheme, theme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const isDark = resolvedTheme === 'dark'

    return (
        <Switch
            checked={isDark}
            onCheckedChange={(checked: boolean) => {
                setTheme(checked ? 'dark' : 'light')
            }}
        />
    )
}
