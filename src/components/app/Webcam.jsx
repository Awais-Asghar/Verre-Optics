import { useEffect, useRef, useState } from "react";
import { IconCamera, IconArrowLeft } from "../Icons.jsx";

// Live webcam capture. Streams the front camera, overlays a framing guide, and
// on capture draws the current frame to a canvas -> File, handed back to the parent.
export default function Webcam({ onCapture, onCancel }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
          setReady(true);
        }
      } catch (e) {
        setError(
          e?.name === "NotAllowedError"
            ? "Camera permission was denied. Allow access or upload a photo instead."
            : "Couldn't access a camera. Try uploading a photo instead."
        );
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;
    const w = video.videoWidth, h = video.videoHeight;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    // Mirror so the saved photo matches the (mirrored) preview the user sees.
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        streamRef.current?.getTracks().forEach((t) => t.stop());
        onCapture(new File([blob], "camera-photo.jpg", { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92
    );
  };

  return (
    <div className="mx-auto max-w-[560px] px-6 py-6">
      <button onClick={onCancel} className="mb-4 flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-strong">
        <IconArrowLeft size={16} /> Back to options
      </button>

      <div className="relative overflow-hidden rounded-2xl border border-line bg-ink" style={{ aspectRatio: "3 / 4" }}>
        {!error && (
          <video ref={videoRef} playsInline muted className="h-full w-full object-cover" style={{ transform: "scaleX(-1)" }} />
        )}

        {/* framing guide */}
        {ready && !error && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[62%] w-[52%] rounded-[50%] border-2 border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.25)]" />
          </div>
        )}

        {!ready && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/25 border-t-white" />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <p className="text-sm text-ink-fg">{error}</p>
          </div>
        )}
      </div>

      {!error ? (
        <>
          <button
            onClick={capture}
            disabled={!ready}
            className="btn-accent mt-5 w-full disabled:opacity-50"
          >
            <IconCamera size={18} /> Capture Photo
          </button>
          <p className="mt-3 text-center text-xs text-muted">Center your face in the oval, with even lighting.</p>
        </>
      ) : (
        <button onClick={onCancel} className="btn-outline mt-5 w-full">Choose another method</button>
      )}
    </div>
  );
}
