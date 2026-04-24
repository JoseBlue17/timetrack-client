import { useRef, useState, useEffect } from 'react';

export function useCloseMonthSignature(isModalOpen: boolean) {
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isUserDrawingSignature, setIsUserDrawingSignature] = useState(false);
  const [isSignatureCanvasEmpty, setIsSignatureCanvasEmpty] = useState(true);

  useEffect(() => {
    if (isModalOpen && signatureCanvasRef.current) {
      const signatureCanvas = signatureCanvasRef.current;
      const canvasRenderingContext = signatureCanvas.getContext('2d');
      if (canvasRenderingContext) {
        canvasRenderingContext.strokeStyle = 'bg-indigo-600';
        canvasRenderingContext.lineWidth = 2;
        canvasRenderingContext.lineCap = 'round';
      }
    }
  }, [isModalOpen]);

  const handleStartDrawingSignature = (pointerEvent: React.MouseEvent | React.TouchEvent) => {
    setIsUserDrawingSignature(true);
    setIsSignatureCanvasEmpty(false);
    handleDrawingStream(pointerEvent);
  };

  const handleStopDrawingSignature = () => {
    setIsUserDrawingSignature(false);
    const signatureCanvas = signatureCanvasRef.current;
    const canvasRenderingContext = signatureCanvas?.getContext('2d');
    canvasRenderingContext?.beginPath();
  };

  const handleDrawingStream = (pointerEvent: React.MouseEvent | React.TouchEvent) => {
    const isReadyToDraw = isUserDrawingSignature && signatureCanvasRef.current;
    if (!isReadyToDraw) return;

    const signatureCanvas = signatureCanvasRef.current as HTMLCanvasElement;
    const canvasRenderingContext = signatureCanvas.getContext('2d');
    if (!canvasRenderingContext) return;

    const canvasBoundingRect = signatureCanvas.getBoundingClientRect();
    let currentPointerClientX: number;
    let currentPointerClientY: number;

    if ('touches' in pointerEvent) {
      currentPointerClientX = pointerEvent.touches[0].clientX;
      currentPointerClientY = pointerEvent.touches[0].clientY;
      pointerEvent.preventDefault();
    } else {
      const currentMouseEvent = pointerEvent as React.MouseEvent;
      currentPointerClientX = currentMouseEvent.clientX;
      currentPointerClientY = currentMouseEvent.clientY;
    }

    const canvasCoordinateX = currentPointerClientX - canvasBoundingRect.left;
    const canvasCoordinateY = currentPointerClientY - canvasBoundingRect.top;

    canvasRenderingContext.lineTo(canvasCoordinateX, canvasCoordinateY);
    canvasRenderingContext.stroke();
    canvasRenderingContext.beginPath();
    canvasRenderingContext.moveTo(canvasCoordinateX, canvasCoordinateY);
  };

  const handleClearSignatureCanvas = () => {
    const signatureCanvas = signatureCanvasRef.current;
    const canvasRenderingContext = signatureCanvas?.getContext('2d');
    if (signatureCanvas && canvasRenderingContext) {
      canvasRenderingContext.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
      setIsSignatureCanvasEmpty(true);
    }
  };

  return {
    signatureCanvasRef,
    isSignatureCanvasEmpty,
    handleStartDrawingSignature,
    handleStopDrawingSignature,
    handleDrawingStream,
    handleClearSignatureCanvas,
  };
}
