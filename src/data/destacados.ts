// Mejores equipos STEAMex por temporada: un top 3 de FTC y un top 3 de FRC.
// Para agregar una temporada nueva, copia el bloque y ponlo al inicio de la lista.

export type Destacado = {
  lugar: 1 | 2 | 3;
  equipo: string;
  logros: string[];
  caracteristicas: string[];
};

export type Temporada = {
  nombre: string;
  ftc: Destacado[];
  frc: Destacado[];
};

const vacio = (lugar: 1 | 2 | 3): Destacado => ({
  lugar,
  equipo: 'PLACEHOLDER nombre del equipo',
  logros: ['PLACEHOLDER logro o premio', 'PLACEHOLDER posición en torneo'],
  caracteristicas: ['PLACEHOLDER característica del robot', 'PLACEHOLDER característica del equipo'],
});

export const temporadas: Temporada[] = [
  {
    nombre: 'Temporada PLACEHOLDER',
    ftc: [vacio(1), vacio(2), vacio(3)],
    frc: [vacio(1), vacio(2), vacio(3)],
  },
];
