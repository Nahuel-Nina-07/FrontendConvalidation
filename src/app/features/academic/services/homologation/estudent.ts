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
  
  export interface MateriasAprobadas{
      id: number,
      estudianteId: number,
      materiaId: number,
      calificacion: number
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
    estudiantePensumId:number;
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
  }

  export interface MateriaNoHomologada{
    id  : number,
    estudiantePensumId  : number,
    materiaOrigenId : number,
    calificacion  : number,
  }

  export interface MateriaHomologada {
    id: number,
    estudiantePensumId: number,
    materiaOrigenId: number,
    materiaDestinoId: number,
    calificacion: number,
    estado: boolean,
    justificacion: string
  }  

  export interface MateriasNoHomologadas {
    materiaOrigenId: number;
    codigoMateria: string;
    nombreMateria: string;
    calificacion: number;
    idMateria: number;
  }

  export interface MateriasNoHomologadasResponse {
    estudiantePensumId: number;
    materiasNoHomologadas: MateriasNoHomologadas[];
  }

  export interface MateriasHomologadas {
    id: number,
    idMateriaOrigen: number,
    codigoMateriaOrigen: string,
    nombreMateriaOrigen: string,
    calificacion: number,
    idMateriaDestino: number,
    codigoMateriaDestino: string,
    nombreMateriaDestino: string,
    estado: boolean,
    justificacion: string
  }

  export interface MateriasHomologadasResponse {
    estudiantePensumId: number;
    materiasHomologadas: MateriasHomologadas[];
  }