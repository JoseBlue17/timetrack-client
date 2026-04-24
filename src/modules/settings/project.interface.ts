export interface IProject {
  id: string;
  name: string;
  description: string;
}

export interface ICreateProjectValues {
  name: string;
  description?: string;
}

export interface IUpdateProjectValues {
  name?: string;
  description?: string;
}
