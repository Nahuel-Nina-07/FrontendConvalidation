export interface Career {
  id: number;
  carreraId: number; // Asegúrate de que coincida con la respuesta de la API
  careerName: string;
  carreraNombre: string; // Asegúrate de que coincida con la respuesta de la API
  materias: any[]; // Define `materias` structure if you know the details
  pensums: Pensum[];
}
  
  export interface MateriaAprobada {
    id: number;
    materiaNombre: string;
    materiaCodigo:string;
    materiaId: number;
    calificacion: number;
    nombre: string;
  }
  
  export interface Student {
    id: number;
    materiaId: number;
    nombre: string;
    carrera: Career; // Aquí se espera un objeto Career
    pensum:Pensum;
    materiasAprobadas: MateriaAprobada[];
    pensums: Pensum[];
    materias: Materia[];  
    estado: boolean;
    pensumId: number;
    carreraId: number;

  }

  export interface Materia {
    id: number;
    codigo: string;
    nombre: string;
  }

  export interface Pensum{
    pensumId: number;
    id: number;
    anio: number;
    materias: Materia[];
    materiaNombre: string;
    materiasAprobadas: MateriaAprobada[];
    anioPensumDestino : number;
    anioPensumOrigen: number;
    estado: boolean;
    pensumDestinoId: number;
    pensumOrigenId: number;
  }

  export interface Homologacion{
    id: number;
    materiaOrigenId: number;
    materiaDestinoId: number;
    codigoMateriaOrigen: string;  // Add these fields
  nombreMateriaOrigen: string;
  codigoMateriaDestino: string;
  nombreMateriaDestino: string;
  idMateriaDestino: number;
  idMateriaOrigen: number;
  }

  export interface HomologationPensumEstudent{
    id: number;
    estudianteId: number;
    pensumOrigenId: number;
    pensumDestinoId: number;
    estado: boolean;
  }

  export interface UpdatedStudent {
    id: number;
    nombre: string;
    carreraId: number;
    estado: boolean;
    pensumId: number;
    // Agrega las propiedades adicionales que necesites, como `materiaId`, `pensum`, etc.
  }