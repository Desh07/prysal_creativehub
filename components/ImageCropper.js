'use client';
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import * as Icons from 'lucide-react';

export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

export function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

export function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export default async function getCroppedImg(
  imageSrc,
  pixelCrop,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(data, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(file);
    }, 'image/webp', 0.85); // Compress as WebP for 10x smaller file sizes
  });
}

export const ImageCropper = ({ imageSrc, onCropDone, onCancel, aspect = 16 / 9 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) {
      alert("Please wait for the image to load completely.");
      return;
    }
    try {
      setIsProcessing(true);
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      if (!croppedBlob) {
        throw new Error("Failed to create blob");
      }
      // Save as WebP
      const file = new File([croppedBlob], 'cropped_image.webp', { type: 'image/webp' });
      await onCropDone(file);
    } catch (e) {
      console.error(e);
      alert('Failed to crop image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-sm" style={{ zIndex: 99999 }}>
      <div className="bg-white w-full max-w-5xl h-[90vh] md:h-[85vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-2xl font-black text-gray-900">Adjust Image</h2>
          <button onClick={onCancel} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-600">
            <Icons.X size={24} />
          </button>
        </div>

        {/* The Cropper container needs a defined height for react-easy-crop to render properly */}
        <div className="relative w-full flex-1 bg-gray-950 overflow-hidden" style={{ minHeight: '40vh' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
          />
        </div>

        <div className="p-6 md:p-8 bg-white shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center text-sm font-bold text-gray-700 uppercase tracking-wide">
                <span>Zoom</span>
                <span className="text-brand-purple">{Number(zoom).toFixed(1)}x</span>
              </div>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(e.target.value)}
                className="w-full accent-black h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center text-sm font-bold text-gray-700 uppercase tracking-wide">
                <span>Rotation</span>
                <span className="text-brand-purple">{rotation}°</span>
              </div>
              <input
                type="range"
                value={rotation}
                min={0}
                max={360}
                step={1}
                onChange={(e) => setRotation(e.target.value)}
                className="w-full accent-black h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-100">
            <button
              onClick={onCancel}
              className="px-8 py-4 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors w-full sm:w-auto text-center"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isProcessing}
              className="px-8 py-4 rounded-xl bg-black text-white font-bold hover:bg-gray-900 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 w-full sm:w-auto shadow-lg"
            >
              {isProcessing && <Icons.Loader2 className="animate-spin" size={20} />}
              <span>{isProcessing ? 'Saving...' : 'Crop & Save Image'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
