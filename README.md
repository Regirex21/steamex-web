# Project STEAMex, sitio web

Astro + Tailwind, en español. Se abre primero en local.

## Correr en local

```
npm install
npm run dev
```

Abre http://localhost:4321

## Dónde editar

- `src/data/teams.ts`: equipos y sus Instagram (solo el usuario, sin @).
- `src/data/destacados.ts`: top 3 FTC y top 3 FRC por temporada.
- `src/data/site.ts`: correo, Instagram principal y enlace al dossier.
- `src/styles/global.css`: colores y tipografías (tokens del manual de marca).
- `src/components/Logo.astro`: reemplazar por el logotipo oficial.
- Todo lo marcado como PLACEHOLDER en cualquier archivo está pendiente de reemplazar.

## Pendiente del manual de marca

El texto pegado del manual se cortó antes de la paleta oficial (HEX, RGB, CMYK) y de los usos de color.
Confirmados: #002A30, #12474B, #85120F, Orbitron. Myriad Pro es de pago, por eso se usa Source Sans 3 de sustituto.
