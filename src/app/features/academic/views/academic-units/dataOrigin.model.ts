export interface UniversityOrigin{
    id: number;
    name: string;
}

export interface CareerOrigin{
    id: number;
    name: string;
    facultyName: string;
}

export interface SourceSubject{
    id: number;
    name: string;
    code: string;
}

export interface Subject{
    id: number;
    subjectName: string;
    subjectFaculty: string;
    subjectCareer:string;
    subjectCode: string;
}

export interface SourceUnit{
    number: number,
    name: string,
    topic: string
}

export interface Units{
    number: number,
    name: string,
    topic: string
}

export interface UnitConvalidation{
    id: number,
    percentageContent: number,
    sourceUnitId: number,
    targetUnitId: number,
    relationSubjectsId: number,
}