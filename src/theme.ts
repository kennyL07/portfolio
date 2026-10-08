import {
    Hct,
    SchemeTonalSpot,
    hexFromArgb,
} from '@material/material-color-utilities'

export function applyRandomTheme() {
    const seed = Hct.from(Math.random() * 360, 48, 50)
    const scheme = new SchemeTonalSpot(seed, true, 0)

    const colors = {
        primary: scheme.primary,
        'on-primary': scheme.onPrimary,
        'primary-container': scheme.primaryContainer,
        'on-primary-container': scheme.onPrimaryContainer,
        surface: scheme.surface,
        'on-surface': scheme.onSurface,
        'surface-container': scheme.surfaceContainer,
        outline: scheme.outline,
    }

    for (const [role, color] of Object.entries(colors)) {
        document.documentElement.style.setProperty(
            `--${role}`,
            hexFromArgb(color),
        )
    }
}