interface IShowSuccess {
  title: string;
  description?: string;
}

export const useShowSuccess = () => {
  const showSuccess = ({ title, description }: IShowSuccess) => {
    console.info(title, description);
    // Sustituir por tu sistema de notificaciones (toast, etc.)
  };
  return { showSuccess };
};
