export interface IProject {
  id: string;
  name: string;
  description: string;
}

export interface IProjectsResponse {
  data: IProject[];
  nextCursor: string | null;
}

export interface IProjectFormModalProps {
  open: boolean;
  onClose: () => void;
  project?: IProject;
}

export interface ICreateProjectValues {
  name: string;
  description?: string;
}

export interface IUpdateProjectValues {
  name?: string;
  description?: string;
}
