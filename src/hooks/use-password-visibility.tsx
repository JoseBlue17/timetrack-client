import { useState, useCallback } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';

export function usePasswordVisibility() {
  const [visible, setVisible] = useState(false);

  const toggle = useCallback(() => setVisible((previous) => !previous), []);

  const iconRender = useCallback(
    (isVisible: boolean) => (isVisible ? <LuEyeOff size={18} /> : <LuEye size={18} />),
    [],
  );

  return {
    visible,
    setVisible,
    toggle,
    iconRender,
  };
}
