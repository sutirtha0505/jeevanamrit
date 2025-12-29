'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, X, MapPin, Cloud } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import Image from 'next/image';

interface FormContentProps {
  pending: boolean;
}

export function FormContent({ pending }: FormContentProps) {
  const [imageDataUri, setImageDataUri] = useState<string>('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [location, setLocation] = useState<string>('');
  const [weather, setWeather] = useState<string>('');
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getWeatherDescription = useCallback((code: number): string => {
    const weatherCodes: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };
    return weatherCodes[code] || 'Unknown';
  }, []);

  const getUserContext = useCallback(async () => {
    setIsLoadingContext(true);
    
    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          
          // Get weather from Open-Meteo API
          try {
            const weatherResponse = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            );
            const weatherData = await weatherResponse.json();
            
            if (weatherData.current_weather) {
              const temp = weatherData.current_weather.temperature;
              const windSpeed = weatherData.current_weather.windspeed;
              const weatherCode = weatherData.current_weather.weathercode;
              
              const weatherDescription = getWeatherDescription(weatherCode);
              setWeather(`${weatherDescription}, ${temp}°C, Wind: ${windSpeed} km/h`);
            }
          } catch (error) {
            console.error('Error fetching weather:', error);
            setWeather('Weather data unavailable');
          }
          
          setIsLoadingContext(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocation('Location unavailable');
          setWeather('Weather data unavailable');
          setIsLoadingContext(false);
        }
      );
    } else {
      setLocation('Geolocation not supported');
      setWeather('Weather data unavailable');
      setIsLoadingContext(false);
    }
  }, [getWeatherDescription]);

  // Get user location and weather on mount
  useEffect(() => {
    getUserContext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0);
        const dataUri = canvas.toDataURL('image/png');
        setImageDataUri(dataUri);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageDataUri('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Capture Herb Image</h2>
        
        {/* Context Information */}
        {isLoadingContext ? (
          <div className="mb-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">Loading location and weather...</p>
          </div>
        ) : (
          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Cloud size={16} />
              <span>{weather}</span>
            </div>
          </div>
        )}

        {/* Image Preview */}
        {imageDataUri && (
          <div className="relative mb-4">
            <Image
              src={imageDataUri}
              alt="Captured herb"
              width={400}
              height={300}
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              disabled={pending}
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Camera Modal */}
        {isCameraOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
            <div className="relative w-full max-w-2xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <Button onClick={capturePhoto} size="lg">
                  Capture Photo
                </Button>
                <Button onClick={stopCamera} variant="outline" size="lg">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!imageDataUri && (
          <div className="flex gap-4">
            <Button
              type="button"
              onClick={startCamera}
              className="flex-1"
              disabled={pending}
            >
              <Camera className="mr-2" size={20} />
              Open Camera
            </Button>
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex-1"
              disabled={pending}
            >
              <Upload className="mr-2" size={20} />
              Upload Image
            </Button>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Hidden Form Fields */}
        <input type="hidden" name="herbImage" value={imageDataUri} />
        <input type="hidden" name="location" value={location} />
        <input type="hidden" name="weather" value={weather} />

        {/* Canvas for capturing photos */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Submit Button */}
        {imageDataUri && (
          <Button
            type="submit"
            className="w-full mt-4"
            disabled={pending || !imageDataUri}
          >
            {pending ? 'Analyzing...' : 'Analyze Herb'}
          </Button>
        )}
      </Card>
    </div>
  );
}
