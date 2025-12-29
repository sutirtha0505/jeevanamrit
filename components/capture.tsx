'use client';

import { useActionState, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FormContent } from './form-content';
import { Results } from './results';
import { AILoadingScreen } from './ai-loading-screen';
import { getHerbInformation } from '@/app/actions';
import { HerbInfoState } from '@/types/herb';
import { Button } from './ui/button';
import { Upload, Loader2, Download } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';

const initialState: HerbInfoState = {
  success: false,
};

function FormWithStatus({
  pending,
  formAction,
}: {
  pending: boolean;
  formAction: (payload: FormData) => void;
}) {
  return (
    <form action={formAction}>
      <FormContent pending={pending} />
    </form>
  );
}

function CaptureForm({
  formAction,
  state,
  pending,
}: {
  formAction: (payload: FormData) => void;
  state: HerbInfoState;
  pending: boolean;
}) {
  return (
    <>
      {/* AI Loading Screen */}
      {pending && <AILoadingScreen message="Analyzing herb with Our AI..." />}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="md:sticky md:top-24 md:self-start">
          <FormWithStatus formAction={formAction} pending={pending} />
        </div>

        {/* Right Column - Results */}
        <div>
          <Results state={state} pending={pending} />
        </div>
      </div>
    </>
  );
}

export default function Capture() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const lastToastStateRef = useRef<string>('');

  const [state, formAction, isPending] = useActionState(getHerbInformation, initialState);

  // Check authentication
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/auth/login');
        return;
      }

      setUser({
        id: authUser.id,
        email: authUser.email || '',
      });
      setLoading(false);
    };

    checkUser();
  }, [router, supabase]);

  // Capture the original image when analysis completes
  useEffect(() => {
    if (state.success && state.identification) {
      // Try to get the uploaded image from the form
      const imageInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (imageInput && imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setOriginalImage(e.target?.result as string);
        };
        reader.readAsDataURL(imageInput.files[0]);
      }
    }
  }, [state.success, state.identification]);

  // Show toast notifications based on state changes
  useEffect(() => {
    const stateKey = state.error || (state.success && state.identification?.commonName) || '';

    // Only show toast if state has changed
    if (stateKey && stateKey !== lastToastStateRef.current) {
      lastToastStateRef.current = stateKey;

      if (state.error) {
        toast.error('Analysis Failed: ' + state.error, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else if (state.success && state.identification) {
        toast.success(`Analysis Complete! ${state.identification.commonName} has been successfully identified.`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  }, [state]);

  const handleDownloadPDF = async () => {
    if (!state.success || !state.identification) {
      toast.error('No analysis data available for PDF generation.');
      return;
    }

    setIsDownloadingPDF(true);

    try {
      toast.info('Generating PDF report...', { toastId: 'pdf-progress' });

      // Create new jsPDF instance
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Enhanced helper function to add formatted text with markdown parsing
      const addFormattedText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10, lineHeight = 1.4) => {
        pdf.setFontSize(fontSize);
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const testWidth = pdf.getTextWidth(testLine);

          if (testWidth > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }

        if (currentLine) {
          lines.push(currentLine);
        }

        let currentY = y;
        for (const line of lines) {
          // Parse markdown formatting
          const processedLine = line;
          const segments = [];

          // Split by markdown patterns while preserving formatting info
          const parts = processedLine.split(/(\*\*.*?\*\*|\*.*?\*)/g);

          for (const part of parts) {
            if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
              // Bold text
              segments.push({ text: part.slice(2, -2), style: 'bold' });
            } else if (part.startsWith('*') && part.endsWith('*') && part.length > 2 && !part.startsWith('**')) {
              // Italic text
              segments.push({ text: part.slice(1, -1), style: 'italic' });
            } else if (part.trim()) {
              // Normal text - handle special characters and line breaks
              const cleanText = part.replace(/\\n/g, ' ').replace(/\\\\/g, '\\');
              segments.push({ text: cleanText, style: 'normal' });
            }
          }

          // Render segments with appropriate styling
          let currentX = x;
          for (const segment of segments) {
            if (segment.style === 'bold') {
              pdf.setFont('helvetica', 'bold');
            } else if (segment.style === 'italic') {
              pdf.setFont('helvetica', 'italic');
            } else {
              pdf.setFont('helvetica', 'normal');
            }

            pdf.text(segment.text, currentX, currentY);
            currentX += pdf.getTextWidth(segment.text);
          }

          currentY += fontSize * lineHeight * 0.35;
        }

        return currentY;
      };

      // Helper function for bullet points and lists
      const addBulletText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10) => {
        // Clean and normalize the text first
        const cleanText = text.replace(/\n\s*\n/g, '\n').trim();
        const bulletPoints = cleanText.split('\n').filter(line => line.trim());
        let currentY = y;

        for (const point of bulletPoints) {
          const trimmedPoint = point.trim();

          if (trimmedPoint.startsWith('-') || trimmedPoint.startsWith('•') || trimmedPoint.startsWith('*')) {
            // Handle existing bullet points
            const cleanPoint = trimmedPoint.replace(/^[-•*]\s*/, '');
            if (cleanPoint) {
              pdf.setFont('helvetica', 'normal');
              pdf.text('•', x, currentY);
              currentY = addFormattedText(cleanPoint, x + 8, currentY, maxWidth - 8, fontSize);
              currentY += 3;
            }
          } else if (trimmedPoint.match(/^\d+\.\s/)) {
            // Handle numbered lists
            const numberMatch = trimmedPoint.match(/^(\d+)\.(\s*)(.*)/);
            if (numberMatch) {
              const [, number, , content] = numberMatch;
              pdf.setFont('helvetica', 'normal');
              pdf.text(`${number}.`, x, currentY);
              currentY = addFormattedText(content, x + 12, currentY, maxWidth - 12, fontSize);
              currentY += 3;
            }
          } else if (trimmedPoint) {
            // Regular line, treat as bullet point if in a list context, otherwise as paragraph
            if (bulletPoints.length > 1 && bulletPoints.some(p => p.trim().match(/^[-•*]/))) {
              pdf.setFont('helvetica', 'normal');
              pdf.text('•', x, currentY);
              currentY = addFormattedText(trimmedPoint, x + 8, currentY, maxWidth - 8, fontSize);
            } else {
              currentY = addFormattedText(trimmedPoint, x, currentY, maxWidth, fontSize);
            }
            currentY += 3;
          }
        }

        return currentY;
      };

      // Simple text helper for backward compatibility
      const addText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10) => {
        return addFormattedText(text, x, y, maxWidth, fontSize);
      };

      // Header
      pdf.setFillColor(34, 197, 94); // Green background
      pdf.rect(0, 0, pageWidth, 30, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('जीवनामृत - Herb Analysis Report', 20, 20);

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, 40);

      yPosition = 45;
      pdf.setTextColor(0, 0, 0);

      // Add original image if available
      if (originalImage) {
        try {
          const imgWidth = 70;
          const imgHeight = 70;
          const imgX = pageWidth - imgWidth - 20;
          const imgY = yPosition;

          // Add image
          pdf.addImage(originalImage, 'JPEG', imgX, imgY, imgWidth, imgHeight);

          // Add image caption
          pdf.setFontSize(8);
          pdf.setTextColor(128, 128, 128);
          pdf.setFont('helvetica', 'italic');
          const captionText = 'Original Image';
          const captionWidth = pdf.getTextWidth(captionText);
          pdf.text(captionText, imgX + (imgWidth - captionWidth) / 2, imgY + imgHeight + 8);

          // Reset text color
          pdf.setTextColor(0, 0, 0);
        } catch (error) {
          console.warn('Could not add image to PDF:', error);
          // Add placeholder text if image fails
          pdf.setFontSize(10);
          pdf.setTextColor(128, 128, 128);
          pdf.setFont('helvetica', 'italic');
          pdf.text('[Image could not be loaded]', pageWidth - 100, yPosition + 20);
          pdf.setTextColor(0, 0, 0);
        }
      }

      // Basic Information Section
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(34, 197, 94);
      yPosition = addText('IDENTIFICATION', 20, yPosition, pageWidth - 40, 18);

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);

      // Draw separator line
      pdf.setDrawColor(34, 197, 94);
      pdf.line(20, yPosition + 2, pageWidth - 20, yPosition + 2);
      yPosition += 10;

      // Common Name
      pdf.setFont('helvetica', 'bold');
      yPosition = addText(`Common Name: ${state.identification.commonName}`, 20, yPosition, pageWidth - 100, 14);
      yPosition += 5;

      // Latin Name
      pdf.setFont('helvetica', 'italic');
      yPosition = addText(`Latin Name: ${state.identification.latinName}`, 20, yPosition, pageWidth - 100, 12);
      yPosition += 5;

      // Confidence Level
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(34, 197, 94);
      yPosition = addText(`Confidence Level: ${state.identification.confidenceLevel}`, 20, yPosition, pageWidth - 100, 12);
      yPosition += 15;

      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 20;
      }

      // Details Section
      if (state.details) {
        pdf.setTextColor(34, 197, 94);
        pdf.setFont('helvetica', 'bold');
        yPosition = addText('DETAILED INFORMATION', 20, yPosition, pageWidth - 40, 18);

        pdf.setDrawColor(34, 197, 94);
        pdf.line(20, yPosition + 2, pageWidth - 20, yPosition + 2);
        yPosition += 10;

        pdf.setTextColor(0, 0, 0);

        const details = [
          { label: 'Primary Uses', value: state.details.uses },
          { label: 'Chemical Constituents', value: state.details.chemicalConstituents },
          { label: 'Cultivation Methods', value: state.details.cultivation },
          { label: 'Preservation Methods', value: state.details.preservation },
          { label: 'Origin', value: state.details.origin },
          { label: 'Historical Context', value: state.details.historicalContext },
        ];

        for (const detail of details) {
          if (detail.value) {
            // Check if we need a new page
            if (yPosition > pageHeight - 40) {
              pdf.addPage();
              yPosition = 20;
            }

            pdf.setFont('helvetica', 'bold');
            yPosition = addText(`${detail.label}:`, 20, yPosition, pageWidth - 40, 11);
            yPosition += 2;

            pdf.setFont('helvetica', 'normal');
            // Use enhanced formatting for bullet points and markdown
            if (detail.value.includes('\n') && (detail.value.includes('-') || detail.value.includes('•'))) {
              yPosition = addBulletText(detail.value, 25, yPosition, pageWidth - 45, 10);
            } else {
              yPosition = addFormattedText(detail.value, 20, yPosition, pageWidth - 40, 10);
            }
            yPosition += 6;
          }
        }
      }

      // Category Information
      if (state.category) {
        // Check if we need a new page
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setTextColor(34, 197, 94);
        pdf.setFont('helvetica', 'bold');
        yPosition = addText('CATEGORY & PROPERTIES', 20, yPosition, pageWidth - 40, 18);

        pdf.setDrawColor(34, 197, 94);
        pdf.line(20, yPosition + 2, pageWidth - 20, yPosition + 2);
        yPosition += 10;

        pdf.setTextColor(0, 0, 0);

        const categories = [
          { label: 'Category', value: state.category.category },
          { label: 'Medicinal Properties', value: state.category.medicinalProperties },
          { label: 'Cultivation Methods', value: state.category.cultivationMethods },
          { label: 'Climatic Requirements', value: state.category.climaticRequirements },
        ];

        for (const category of categories) {
          if (category.value) {
            // Check if we need a new page
            if (yPosition > pageHeight - 30) {
              pdf.addPage();
              yPosition = 20;
            }

            pdf.setFont('helvetica', 'bold');
            yPosition = addText(`${category.label}:`, 20, yPosition, pageWidth - 40, 11);
            yPosition += 2;

            pdf.setFont('helvetica', 'normal');
            // Use enhanced formatting for bullet points and markdown
            if (category.value.includes('\n') && (category.value.includes('-') || category.value.includes('•'))) {
              yPosition = addBulletText(category.value, 25, yPosition, pageWidth - 45, 10);
            } else {
              yPosition = addFormattedText(category.value, 20, yPosition, pageWidth - 40, 10);
            }
            yPosition += 6;
          }
        }
      }

      // Ayurvedic Applications
      if (state.ayurvedic?.ayurvedicApplications) {
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setTextColor(34, 197, 94);
        pdf.setFont('helvetica', 'bold');
        yPosition = addText('AYURVEDIC APPLICATIONS', 20, yPosition, pageWidth - 40, 18);

        pdf.setDrawColor(34, 197, 94);
        pdf.line(20, yPosition + 2, pageWidth - 20, yPosition + 2);
        yPosition += 10;

        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');

        // Use enhanced formatting for Ayurvedic applications
        if (state.ayurvedic.ayurvedicApplications.includes('\n') &&
          (state.ayurvedic.ayurvedicApplications.includes('-') || state.ayurvedic.ayurvedicApplications.includes('•'))) {
          yPosition = addBulletText(state.ayurvedic.ayurvedicApplications, 25, yPosition, pageWidth - 45, 10);
        } else {
          yPosition = addFormattedText(state.ayurvedic.ayurvedicApplications, 20, yPosition, pageWidth - 40, 10);
        }
      }

      // Environmental Context
      if (state.location || state.weather) {
        yPosition += 15;

        // Check if we need a new page
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setTextColor(34, 197, 94);
        pdf.setFont('helvetica', 'bold');
        yPosition = addText('ENVIRONMENTAL CONTEXT', 20, yPosition, pageWidth - 40, 18);

        pdf.setDrawColor(34, 197, 94);
        pdf.line(20, yPosition + 2, pageWidth - 20, yPosition + 2);
        yPosition += 10;

        pdf.setTextColor(0, 0, 0);

        if (state.location) {
          pdf.setFont('helvetica', 'bold');
          yPosition = addText('Location:', 20, yPosition, pageWidth - 40, 11);
          yPosition += 2;

          pdf.setFont('helvetica', 'normal');
          yPosition = addText(state.location, 20, yPosition, pageWidth - 40, 10);
          yPosition += 8;
        }

        if (state.weather) {
          pdf.setFont('helvetica', 'bold');
          yPosition = addText('Weather Conditions:', 20, yPosition, pageWidth - 40, 11);
          yPosition += 2;

          pdf.setFont('helvetica', 'normal');
          yPosition = addText(state.weather, 20, yPosition, pageWidth - 40, 10);
        }
      }

      // Footer
      const footerY = pageHeight - 15;
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Generated by Jeevanamrit - Plant Healing Assistant', 20, footerY);
      pdf.text(`Page 1 of ${pdf.getNumberOfPages()}`, pageWidth - 40, footerY);

      // Add disclaimer
      pdf.setFontSize(8);
      pdf.setTextColor(255, 0, 0);
      const disclaimer = 'Disclaimer: This information is for educational purposes only. Please consult with a qualified healthcare professional for medical advice.';
      pdf.text(pdf.splitTextToSize(disclaimer, pageWidth - 40), 20, footerY - 5);

      // Generate filename and save
      const fileName = `${state.identification.commonName.replace(/\s+/g, '-').toLowerCase()}-analysis-${new Date().getTime()}.pdf`;

      toast.dismiss('pdf-progress');
      pdf.save(fileName);

      toast.success('PDF downloaded successfully! 📄', {
        position: 'top-right',
        autoClose: 3000,
      });

    } catch (error) {
      console.error('PDF generation error:', error);
      toast.dismiss('pdf-progress');
      toast.error('Failed to generate PDF. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const handleConvert = async () => {
    if (!state.success || !state.identification || !user) {
      toast.error('No Data to Convert - Please complete an herb analysis first.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setIsConverting(true);
    setUploadProgress(0);

    // Show progress toast
    const progressToastId = toast.loading('Preparing your herb report...', {
      position: 'top-right',
    });

    try {
      // Step 1: Generate report
      toast.dismiss(progressToastId);
      toast.info('Generating report...', { autoClose: false, toastId: 'convert-progress' });
      setUploadProgress(25);

      // Generate a simple canvas (in production, use html2canvas for full report)
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Could not create canvas context');

      // Enhanced report rendering
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 32px Arial';
      ctx.fillText('🌿 Herb Analysis Report', 50, 60);

      // Herb details
      ctx.font = 'bold 28px Arial';
      ctx.fillText(state.identification.commonName, 50, 120);
      ctx.font = 'italic 20px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(state.identification.latinName, 50, 150);

      // Confidence badge
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 18px Arial';
      ctx.fillText(`Confidence: ${state.identification.confidenceLevel}`, 50, 180);

      // Additional details
      if (state.details?.uses) {
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Primary Uses:', 50, 220);
        ctx.font = '14px Arial';
        const usesLines = state.details.uses.substring(0, 200) + '...';
        ctx.fillText(usesLines, 50, 250);
      }

      // Timestamp
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px Arial';
      ctx.fillText(`Generated on ${new Date().toLocaleDateString()}`, 50, canvas.height - 20);

      // Step 2: Convert to blob
      toast.update('convert-progress', { render: 'Converting report to image...' });
      setUploadProgress(50);

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 0.9);
      });

      // Step 3: Upload to Supabase
      toast.update('convert-progress', { render: 'Uploading to cloud storage...' });
      setUploadProgress(75);

      const fileName = `${state.identification.commonName.replace(/\\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('herb-images')
        .upload(filePath, blob, {
          contentType: 'image/png',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('herb-images').getPublicUrl(filePath);

      // Step 4: Save to database
      toast.dismiss('convert-progress');
      toast.info('Saving to your profile...', { autoClose: false, toastId: 'save-progress' });
      setUploadProgress(90);

      const { error: dbError } = await supabase.from('herb_analyses').insert({
        user_id: user.id,
        user_email: user.email,
        common_name: state.identification.commonName,
        latin_name: state.identification.latinName,
        confidence_level: state.identification.confidenceLevel,
        uses: state.details?.uses || '',
        chemical_constituents: state.details?.chemicalConstituents || '',
        cultivation: state.details?.cultivation || '',
        preservation: state.details?.preservation || '',
        origin: state.details?.origin || '',
        historical_context: state.details?.historicalContext || '',
        medicinal_properties: state.category?.medicinalProperties || '',
        cultivation_methods: state.category?.cultivationMethods || '',
        climatic_requirements: state.category?.climaticRequirements || '',
        category: state.category?.category || '',
        ayurvedic_applications: state.ayurvedic?.ayurvedicApplications || '',
        location: state.location || '',
        weather: state.weather || '',
        image_url: publicUrl,
      });

      if (dbError) throw dbError;

      // Success!
      setUploadProgress(100);
      toast.dismiss('save-progress');
      toast.success('Report saved successfully! 🎉 Your herb analysis has been saved to your profile.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset the page after a short delay to show the success message
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Conversion error:', error);
      toast.dismiss('convert-progress');
      toast.dismiss('save-progress');
      toast.error(`Failed to save report: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsConverting(false);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <div id="capture" className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div id="capture" className="min-h-screen pt-32 bg-background py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-center">Herb Identification</h1>
          <p className="text-gray-600 text-center">
            Capture or upload an image of an herb to identify it and learn about its properties.
          </p>
        </div>

        <CaptureForm formAction={formAction} state={state} pending={isPending} />

        {/* Action Buttons */}
        {state.success && state.identification && (
          <div className="mt-8 flex justify-center gap-4">
            {/* Download PDF Button */}
            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloadingPDF}
              size="lg"
              variant="outline"
              className="min-w-50"
            >
              {isDownloadingPDF ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={20} />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="mr-2" size={20} />
                  Download PDF
                </>
              )}
            </Button>

            {/* Save Report Button */}
            <Button
              onClick={handleConvert}
              disabled={isConverting}
              size="lg"
              className="min-w-50 relative overflow-hidden"
            >
              {isConverting ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={20} />
                  Saving Report...
                  {uploadProgress > 0 && (
                    <div
                      className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  )}
                </>
              ) : (
                <>
                  <Upload className="mr-2" size={20} />
                  Save Report
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
