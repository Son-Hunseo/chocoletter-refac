import { useEffect, useState } from "react";

interface UseScriptOptions {
  src: string;
  integrity?: string;
  crossorigin?: string;
}

const useScript = ({ src, integrity, crossorigin }: UseScriptOptions) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 이미 스크립트가 로드된 경우
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;

    if (integrity) {
      script.integrity = integrity;
    }

    if (crossorigin) {
      script.crossOrigin = crossorigin;
    }

    const onScriptLoad = () => setLoaded(true);
    const onScriptError = () => setError(true);

    script.addEventListener("load", onScriptLoad);
    script.addEventListener("error", onScriptError);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", onScriptLoad);
      script.removeEventListener("error", onScriptError);
    };
  }, [src, integrity, crossorigin]);

  return { loaded, error };
};

export default useScript;
