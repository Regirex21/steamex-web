// Datos generales del sitio. Todo lo marcado como PLACEHOLDER se debe reemplazar.

export const site = {
  name: 'Project STEAMex',
  tagline: 'Robótica FIRST hecha por jóvenes mexicanos',
  instagram: {
    handle: '@steamex.mx', // tomado del análisis de canales, confirmar
    url: 'https://www.instagram.com/steamex.mx/',
  },
  email: 'contacto@PLACEHOLDER.mx', // PLACEHOLDER
  dossierUrl: '', // PLACEHOLDER: enlace al dossier de patrocinio en PDF cuando exista
};

// Cifras de la portada. Las marcadas con pendiente se muestran con aviso hasta confirmarlas.
export const stats = [
  { valor: '+30', etiqueta: 'equipos de robótica a nivel nacional', pendiente: false },
  { valor: '3', etiqueta: 'programas FIRST: FLL, FTC y FRC', pendiente: false },
  { valor: '+000', etiqueta: 'estudiantes en la red', pendiente: true }, // PLACEHOLDER
  { valor: '00', etiqueta: 'estados con equipos', pendiente: true }, // PLACEHOLDER
];

export const nav = [
  { href: '/', label: 'Inicio' },
  { href: '/equipos', label: 'Equipos' },
  { href: '/first', label: 'Qué es FIRST' },
  { href: '/destacados', label: 'Destacados' },
  { href: '/patrocinadores', label: 'Patrocinadores' },
  { href: '/contacto', label: 'Contacto' },
];
