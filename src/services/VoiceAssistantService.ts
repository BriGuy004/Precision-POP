
// Voice shopping assistant service

// Add proper type declarations for Web Speech API
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
  item(index: number): SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
  item(index: number): SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start(): void;
  stop(): void;
}

interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

class VoiceAssistantService {
  recognition: SpeechRecognition | null = null;
  isListening: boolean = false;
  
  constructor() {
    // Initialize speech recognition if available in the browser
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();
      this.configureRecognition();
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }
  
  private configureRecognition() {
    if (!this.recognition) return;
    
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
  }
  
  startListening(
    onResult: (result: VoiceRecognitionResult) => void,
    onError: (error: any) => void
  ): boolean {
    if (!this.recognition) {
      onError(new Error('Speech recognition not supported'));
      return false;
    }
    
    if (this.isListening) {
      return true; // Already listening
    }
    
    try {
      // Set up event handlers
      this.recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;
        
        onResult({
          transcript,
          confidence,
          isFinal: result.isFinal
        });
      };
      
      this.recognition.onerror = (event) => {
        onError(event.error);
      };
      
      // Start listening
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      onError(error);
      return false;
    }
  }
  
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
  
  // Parse voice input to extract shopping items
  parseShoppingItems(transcript: string): string[] {
    // Basic parsing - in a real app, this would use NLP
    const lowercaseText = transcript.toLowerCase();
    
    // Look for patterns like "add [item]" or "I need [item]"
    const patterns = [
      /add (.*?)(?:to my list|to shopping list|to cart|$)/g,
      /i need (.*?)(?:from|at the store|$)/g,
      /(?:get|buy|purchase) (.*?)(?:from|at|$)/g,
    ];
    
    let items: string[] = [];
    
    // Extract items using patterns
    patterns.forEach(pattern => {
      const matches = lowercaseText.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          // Clean up the item text
          const item = match[1].trim()
            .replace(/(?:some|a|an) /, '') // Remove articles
            .replace(/\s+/g, ' '); // Normalize spaces
          
          if (item.length > 0) {
            items.push(item);
          }
        }
      }
    });
    
    // If no patterns match, try to extract a comma or "and" separated list
    if (items.length === 0) {
      const listItems = lowercaseText.split(/(?:,|\sand\s)/);
      items = listItems
        .map(item => item.trim())
        .filter(item => item.length > 0 && item.length < 30); // Basic filtering
    }
    
    return items;
  }
  
  // Get voice feedback for an action
  generateFeedback(action: 'added' | 'removed' | 'found' | 'error', item?: string): string {
    switch (action) {
      case 'added':
        return `Added ${item} to your shopping list.`;
      case 'removed':
        return `Removed ${item} from your shopping list.`;
      case 'found':
        return `I found ${item} in aisle 5.`;
      case 'error':
        return `I'm sorry, I couldn't understand that. Please try again.`;
      default:
        return `I'm listening...`;
    }
  }
}

// Add type definition for global window object
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export const voiceAssistantService = new VoiceAssistantService();
