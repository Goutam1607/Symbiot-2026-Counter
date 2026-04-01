import { useState, useEffect, useRef, useCallback } from 'react';

export function useAudioAnalyser() {
  const [decibel, setDecibel] = useState(0);
  const [frequencyData, setFrequencyData] = useState(new Uint8Array(0));
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);

  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const dataArrayRef = useRef(null);

  const start = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      setIsListening(true);

      const tick = () => {
        if (!analyserRef.current) return;
        
        const dataArray = dataArrayRef.current;
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculate RMS decibel level
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sum / dataArray.length);
        const db = Math.round(rms); // Simplified 0-255 scale
        
        setDecibel(db);
        setFrequencyData(new Uint8Array(dataArray));
        
        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      setError(err.message || 'Microphone access denied');
      setIsListening(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    setIsListening(false);
    setDecibel(0);
    setFrequencyData(new Uint8Array(0));
  }, []);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { decibel, frequencyData, isListening, error, start, stop };
}
