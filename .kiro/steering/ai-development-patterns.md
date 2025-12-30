---
inclusion: always
---

# AI Development Patterns for जीवनामृत

## AI-First Development Approach

This steering guide establishes patterns and best practices for developing AI-powered features in the जीवनामृत platform. These patterns ensure consistent, reliable, and maintainable AI integrations throughout the application.

## Core AI Development Principles

### 1. Fail-Safe AI Design
Every AI integration must have fallback mechanisms and graceful degradation:

```typescript
// Pattern: AI with Fallback
async function withFallback<T>(
  primaryAI: () => Promise<T>,
  fallback: () => Promise<T>,
  validator: (result: T) => boolean
): Promise<T> {
  try {
    const result = await primaryAI();
    if (validator(result)) {
      return result;
    }
    throw new Error('AI result validation failed');
  } catch (error) {
    console.warn('Primary AI failed, using fallback:', error);
    return await fallback();
  }
}
```

### 2. Confidence-Based Responses
All AI responses must include confidence levels and appropriate user messaging:

```typescript
interface AIResponse<T> {
  data: T;
  confidence: number; // 0-1
  reasoning?: string;
  limitations?: string[];
  suggestions?: string[];
}

// Usage pattern
const handleLowConfidence = (response: AIResponse<HerbIdentification>) => {
  if (response.confidence < 0.7) {
    return {
      ...response,
      userMessage: "I'm not very confident about this identification. Please consider taking another photo or consulting an expert.",
      showAlternatives: true
    };
  }
  return response;
};
```

### 3. Context-Aware Processing
AI requests should include relevant context for better results:

```typescript
interface AIContext {
  userLocation?: string;
  weatherConditions?: string;
  previousAnalyses?: HerbAnalysis[];
  userExpertiseLevel?: 'beginner' | 'intermediate' | 'expert';
  culturalContext?: 'indian' | 'global';
}

const enhancePromptWithContext = (basePrompt: string, context: AIContext): string => {
  let enhancedPrompt = basePrompt;
  
  if (context.userLocation) {
    enhancedPrompt += `\nLocation context: ${context.userLocation}`;
  }
  
  if (context.userExpertiseLevel === 'beginner') {
    enhancedPrompt += '\nProvide explanations suitable for beginners with simple terminology.';
  }
  
  return enhancedPrompt;
};
```

## AI Flow Patterns

### 1. Parallel Processing Pattern
For complex analyses requiring multiple AI calls:

```typescript
// Pattern: Parallel AI Processing
const analyzeHerbComprehensively = async (image: string, context: AIContext) => {
  const startTime = Date.now();
  
  try {
    // Execute AI flows in parallel for better performance
    const [identification, categorization, ayurvedicInfo] = await Promise.allSettled([
      identifyHerb({ image, context }),
      categorizeHerb({ herbName: 'pending', context }), // Will be updated
      getAyurvedicApplications({ herbName: 'pending', context })
    ]);
    
    // Handle partial failures gracefully
    const result = {
      identification: identification.status === 'fulfilled' ? identification.value : null,
      categorization: categorization.status === 'fulfilled' ? categorization.value : null,
      ayurvedic: ayurvedicInfo.status === 'fulfilled' ? ayurvedicInfo.value : null,
      processingTime: Date.now() - startTime,
      partialFailures: [identification, categorization, ayurvedicInfo]
        .filter(result => result.status === 'rejected')
        .map(result => result.reason)
    };
    
    return result;
  } catch (error) {
    throw new AIProcessingError('Comprehensive analysis failed', error);
  }
};
```

### 2. Progressive Enhancement Pattern
Start with basic AI features and progressively add more sophisticated ones:

```typescript
// Pattern: Progressive AI Enhancement
class HerbAnalyzer {
  async analyzeBasic(image: string): Promise<BasicAnalysis> {
    // Simple identification only
    return await this.identifyHerb(image);
  }
  
  async analyzeDetailed(image: string, context: AIContext): Promise<DetailedAnalysis> {
    const basic = await this.analyzeBasic(image);
    
    // Add detailed information if basic analysis succeeds
    const [details, applications] = await Promise.all([
      this.getHerbDetails(basic.herbName),
      this.getAyurvedicApplications(basic.herbName, context)
    ]);
    
    return { ...basic, details, applications };
  }
  
  async analyzeExpert(image: string, context: AIContext): Promise<ExpertAnalysis> {
    const detailed = await this.analyzeDetailed(image, context);
    
    // Add expert-level analysis
    const expertInsights = await this.getExpertInsights(detailed, context);
    
    return { ...detailed, expertInsights };
  }
}
```

### 3. Conversation Context Pattern
For chatbot interactions that maintain context:

```typescript
// Pattern: Conversation Context Management
class ConversationManager {
  private context: ConversationContext = {
    messages: [],
    topics: [],
    userPreferences: {},
    sessionId: generateSessionId()
  };
  
  async processMessage(userMessage: string): Promise<string> {
    // Add user message to context
    this.context.messages.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });
    
    // Extract topics and intent
    const intent = await this.analyzeIntent(userMessage, this.context);
    
    // Generate contextual response
    const response = await this.generateResponse(intent, this.context);
    
    // Update context with response
    this.context.messages.push({
      role: 'assistant',
      content: response,
      timestamp: new Date()
    });
    
    // Maintain context window (keep last N messages)
    this.maintainContextWindow();
    
    return response;
  }
  
  private maintainContextWindow(maxMessages: number = 20) {
    if (this.context.messages.length > maxMessages) {
      this.context.messages = this.context.messages.slice(-maxMessages);
    }
  }
}
```

## Error Handling Patterns

### 1. Graceful AI Degradation
```typescript
// Pattern: Graceful AI Degradation
class AIService {
  async processWithDegradation<T>(
    request: AIRequest,
    processors: AIProcessor<T>[]
  ): Promise<T> {
    for (const processor of processors) {
      try {
        const result = await processor.process(request);
        if (this.isValidResult(result)) {
          return result;
        }
      } catch (error) {
        console.warn(`AI processor ${processor.name} failed:`, error);
        // Continue to next processor
      }
    }
    
    throw new Error('All AI processors failed');
  }
}

// Usage
const processors = [
  new AdvancedAIProcessor(), // Try advanced AI first
  new BasicAIProcessor(),    // Fallback to basic AI
  new RuleBasedProcessor()   // Final fallback to rules
];
```

### 2. Circuit Breaker for AI APIs
```typescript
// Pattern: AI API Circuit Breaker
class AICircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private readonly threshold = 5;
  private readonly timeout = 60000; // 1 minute
  
  async execute<T>(aiOperation: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      throw new Error('AI service temporarily unavailable');
    }
    
    try {
      const result = await aiOperation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private isOpen(): boolean {
    return this.failures >= this.threshold && 
           (Date.now() - this.lastFailureTime) < this.timeout;
  }
  
  private onSuccess() {
    this.failures = 0;
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
  }
}
```

## Testing Patterns for AI Features

### 1. AI Response Validation
```typescript
// Pattern: AI Response Testing
describe('AI Herb Identification', () => {
  test('should return valid herb identification', async () => {
    const testImage = await loadTestImage('tulsi.jpg');
    const result = await identifyHerb(testImage);
    
    // Validate structure
    expect(result).toHaveProperty('commonName');
    expect(result).toHaveProperty('latinName');
    expect(result).toHaveProperty('confidence');
    
    // Validate confidence range
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    
    // Validate content quality
    expect(result.commonName).toBeTruthy();
    expect(result.latinName).toMatch(/^[A-Z][a-z]+ [a-z]+$/); // Binomial nomenclature
  });
  
  test('should handle low-quality images gracefully', async () => {
    const blurryImage = await loadTestImage('blurry.jpg');
    const result = await identifyHerb(blurryImage);
    
    if (result.confidence < 0.5) {
      expect(result.suggestions).toContain('better image quality');
    }
  });
});
```

### 2. Property-Based Testing for AI
```typescript
// Pattern: Property-Based AI Testing
import fc from 'fast-check';

describe('AI Chatbot Properties', () => {
  test('should always include disclaimers for medical advice', () => {
    fc.assert(fc.property(
      fc.string().filter(s => s.includes('medicine') || s.includes('treatment')),
      async (medicalQuery) => {
        const response = await chatbot.processMessage(medicalQuery);
        
        expect(response.toLowerCase()).toMatch(
          /disclaimer|consult.*doctor|educational.*purpose/
        );
      }
    ), { numRuns: 50 });
  });
  
  test('should reject off-topic questions', () => {
    fc.assert(fc.property(
      fc.constantFrom('weather today', 'stock prices', 'movie recommendations'),
      async (offTopicQuery) => {
        const response = await chatbot.processMessage(offTopicQuery);
        
        expect(response.toLowerCase()).toMatch(
          /plants|herbs|ayurveda|botanical/
        );
      }
    ), { numRuns: 20 });
  });
});
```

## Performance Optimization Patterns

### 1. AI Response Caching
```typescript
// Pattern: Intelligent AI Caching
class AICache {
  private cache = new Map<string, CachedResponse>();
  
  async getCachedOrProcess<T>(
    key: string,
    processor: () => Promise<T>,
    ttl: number = 3600000 // 1 hour
  ): Promise<T> {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data as T;
    }
    
    const result = await processor();
    this.cache.set(key, {
      data: result,
      timestamp: Date.now()
    });
    
    return result;
  }
  
  generateImageKey(imageData: string): string {
    // Generate hash of image for caching
    return crypto.createHash('sha256').update(imageData).digest('hex');
  }
}
```

### 2. Batch AI Processing
```typescript
// Pattern: Batch AI Processing
class BatchAIProcessor {
  private queue: AIRequest[] = [];
  private processing = false;
  
  async addToQueue(request: AIRequest): Promise<AIResponse> {
    return new Promise((resolve, reject) => {
      this.queue.push({ ...request, resolve, reject });
      this.processQueue();
    });
  }
  
  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    const batch = this.queue.splice(0, 10); // Process 10 at a time
    
    try {
      const results = await this.processBatch(batch);
      batch.forEach((request, index) => {
        request.resolve(results[index]);
      });
    } catch (error) {
      batch.forEach(request => request.reject(error));
    } finally {
      this.processing = false;
      if (this.queue.length > 0) {
        setTimeout(() => this.processQueue(), 100);
      }
    }
  }
}
```

## Monitoring and Observability

### 1. AI Performance Metrics
```typescript
// Pattern: AI Performance Monitoring
class AIMetrics {
  static trackAICall(operation: string, duration: number, success: boolean) {
    // Track AI operation metrics
    metrics.histogram('ai_operation_duration', duration, { operation });
    metrics.counter('ai_operation_total', 1, { operation, success: success.toString() });
  }
  
  static trackConfidenceDistribution(confidence: number, operation: string) {
    metrics.histogram('ai_confidence_score', confidence, { operation });
  }
  
  static trackTokenUsage(tokens: number, operation: string) {
    metrics.counter('ai_tokens_used', tokens, { operation });
  }
}

// Usage in AI operations
const withMetrics = async <T>(
  operation: string,
  aiCall: () => Promise<T>
): Promise<T> => {
  const startTime = Date.now();
  try {
    const result = await aiCall();
    AIMetrics.trackAICall(operation, Date.now() - startTime, true);
    return result;
  } catch (error) {
    AIMetrics.trackAICall(operation, Date.now() - startTime, false);
    throw error;
  }
};
```

## Implementation Guidelines

### 1. Always Use These Patterns When:
- Making any AI API call
- Processing user-generated content
- Handling uncertain or probabilistic results
- Building conversational interfaces
- Implementing image or text analysis

### 2. Code Review Checklist for AI Features:
- [ ] Fallback mechanisms implemented
- [ ] Confidence levels included and handled
- [ ] Error handling covers AI-specific failures
- [ ] Performance monitoring added
- [ ] Testing includes edge cases and failures
- [ ] User feedback mechanisms in place
- [ ] Cultural sensitivity validated (for Ayurvedic content)

### 3. Documentation Requirements:
- Document expected AI behavior and limitations
- Include examples of typical inputs and outputs
- Explain confidence thresholds and their meanings
- Provide troubleshooting guides for common AI failures

This steering guide ensures consistent, reliable, and maintainable AI integrations throughout the जीवनामृत platform while maintaining the highest standards of user experience and cultural authenticity.