export interface Career {
    id: number;
    careerName: string;
    materias: any[]; // Define `materias` structure if you know the details
  }
  
  export interface MateriaAprobada {
    id: number;
    materiaId: number;
    fechaAprobacion: string;
    calificacion: number;
  }
  
  export interface Student {
    id: number;
    nombre: string;
    apellido: string;
    carrera: Career;
    materiasAprobadas: MateriaAprobada[];
  }