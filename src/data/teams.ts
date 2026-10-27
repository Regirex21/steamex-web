// Equipos de la red STEAMex. Edita este archivo y las páginas se actualizan solas.
// instagram: escribe solo el usuario, sin @ ni URL (ejemplo: 'ariasteamex').
// Si se deja vacío, el botón aparece como "Instagram por agregar".

export type Team = {
  name: string;
  program: 'FRC' | 'FTC';
  number?: string;
  city: string;
  description: string;
  instagram: string;
  pending?: boolean;
};

export const teams: Team[] = [
  {
    name: 'ARIA STEAMex',
    program: 'FRC',
    number: '11040',
    city: 'PLACEHOLDER ciudad',
    description:
      'Primer equipo comunitario de FRC conformado solo por mujeres en México. No pertenece a una sola institución: abre espacios para niñas y jóvenes en ingeniería y tecnología.',
    instagram: '', // PLACEHOLDER
  },
  {
    name: 'ACRIS STEAMex',
    program: 'FTC',
    city: 'PLACEHOLDER ciudad',
    description:
      'Equipo de FTC formado por jóvenes mujeres. Desarrolla habilidades técnicas, liderazgo y resolución de problemas a través de la robótica.',
    instagram: '', // PLACEHOLDER
  },
  {
    name: 'Equipo FRC por agregar',
    program: 'FRC',
    city: 'PLACEHOLDER ciudad',
    description: 'PLACEHOLDER. Descripción breve del equipo, en dos o tres líneas.',
    instagram: '',
    pending: true,
  },
  {
    name: 'Equipo FTC por agregar',
    program: 'FTC',
    city: 'PLACEHOLDER ciudad',
    description: 'PLACEHOLDER. Descripción breve del equipo, en dos o tres líneas.',
    instagram: '',
    pending: true,
  },
];

export const instagramUrl = (handle: string) =>
  handle ? `https://www.instagram.com/${handle.replace(/^@/, '')}/` : '';
