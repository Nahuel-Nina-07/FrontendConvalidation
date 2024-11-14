export interface Career {
    id: number;
    careerName: string;
    materias: any[]; // Define `materias` structure if you know the details
    pensums: Pensum[];
  }
  
  export interface MateriaAprobada {
    id: number;
    calificacion: number;
    nombre: string;
  }
  
  export interface Student {
    id: number;
    nombre: string;
    apellido: string;
    carrera: Career;
    materiasAprobadas: MateriaAprobada[];
  }

  export interface Materia {
    id: number;
    codigo: string;
    nombre: string;
  }

  export interface Pensum{
    id: number;
    anio: number;
    materias: Materia[];
  }

  export interface Homologacion{
    id: number;
    materiaOrigenId: number;
    materiaDestinoId: number;
    codigoMateriaOrigen: string;  // Add these fields
  nombreMateriaOrigen: string;
  codigoMateriaDestino: string;
  nombreMateriaDestino: string;
  }