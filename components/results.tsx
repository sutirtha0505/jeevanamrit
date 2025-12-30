'use client';

import { HerbInfoState } from '@/types/herb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ResultsProps {
  state: HerbInfoState;
  pending: boolean;
}

export function Results({ state, pending }: ResultsProps) {
  if (pending) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!state.success || !state.identification) {
    return (
      <div className="flex items-center justify-center h-64 bg-primary/10">
        <p className="text-gray-500 text-center">
          {state.error || 'Capture or upload an herb image to begin analysis.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Identification */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl">{state.identification.commonName}</CardTitle>
            <Badge variant="secondary" className="text-lg">
              {state.identification.confidenceLevel}
            </Badge>
          </div>
          <CardDescription className="text-lg italic">
            {state.identification.latinName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{state.identification.description}</p>
        </CardContent>
      </Card>

      {/* Details */}
      {state.details && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Uses & Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {state.details.uses}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chemical Constituents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{state.details.chemicalConstituents}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cultivation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {state.details.cultivation}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Origin & History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Region of Origin</h4>
                  <p className="text-gray-700">{state.details.origin}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Historical Context</h4>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {state.details.historicalContext}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preservation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{state.details.preservation}</p>
            </CardContent>
          </Card>
        </>
      )}

      {/* Category */}
      {state.category && (
        <Card>
          <CardHeader>
            <CardTitle>Categorization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Category</h4>
              <Badge>{state.category.category}</Badge>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Medicinal Properties</h4>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {state.category.medicinalProperties}
                </ReactMarkdown>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Cultivation Methods</h4>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {state.category.cultivationMethods}
                </ReactMarkdown>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Climatic Requirements</h4>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {state.category.climaticRequirements}
                </ReactMarkdown>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ayurvedic Applications */}
      {state.ayurvedic && state.ayurvedic.ayurvedicApplications !== 'Not applicable' && (
        <Card>
          <CardHeader>
            <CardTitle>Ayurvedic Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {state.ayurvedic.ayurvedicApplications}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Context Information */}
      {(state.location || state.weather) && (
        <Card>
          <CardHeader>
            <CardTitle>Collection Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {state.location && (
              <div>
                <h4 className="font-semibold mb-1">Location</h4>
                <p className="text-gray-700">{state.location}</p>
              </div>
            )}
            {state.weather && (
              <div>
                <h4 className="font-semibold mb-1">Weather Conditions</h4>
                <p className="text-gray-700">{state.weather}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
