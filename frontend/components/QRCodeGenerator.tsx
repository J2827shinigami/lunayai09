import React, { useState } from 'react';

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ url, size = 180 }) => {
  const [loaded, setLoaded] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  // High-reliability QR generation endpoint producing standard scannable matrix images for iOS & Android cameras
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedUrl}&margin=8`;

  return (
    <div className="bg-white p-3 rounded-2xl shadow-xl border border-purple-200 inline-flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center min-h-[160px] min-w-[160px]">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 rounded-lg text-xs font-mono text-purple-700 animate-pulse p-4 text-center">
            <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mb-2"></div>
            Generating Live QR Code...
          </div>
        )}
        <img
          src={qrImageUrl}
          alt={`Scannable QR Code pointing to ${url}`}
          width={size}
          height={size}
          onLoad={() => setLoaded(true)}
          className={`rounded-lg transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
      <div className="text-center max-w-[180px]">
        <span className="text-[10px] font-mono text-purple-900 font-bold tracking-tight block uppercase">
          SCAN WITH PHONE CAMERA
        </span>
        <span className="text-[9px] font-mono text-gray-500 truncate block mt-0.5" title={url}>
          {url}
        </span>
      </div>
    </div>
  );
};