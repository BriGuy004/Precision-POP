
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { voiceAssistantService } from "@/services/VoiceAssistantService";

interface VoiceShoppingAssistantProps {
  onAddItem: (name: string, notes?: string) => void;
  isListening?: boolean;
  className?: string;
}

const VoiceShoppingAssistant = ({ 
  onAddItem,
  isListening: externalIsListening,
  className = ""
}: VoiceShoppingAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [processing, setProcessing] = useState(false);
  const [recognizedItems, setRecognizedItems] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const isControlled = externalIsListening !== undefined;
  const listening = isControlled ? externalIsListening : isListening;
  
  // Check browser support on mount
  useEffect(() => {
    const supported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    if (!supported) {
      setErrorMessage("Voice recognition is not supported in this browser. Try Chrome or Edge.");
    }
  }, []);
  
  const handleToggleListening = () => {
    if (isControlled) return; // Don't manage state if controlled externally
    
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };
  
  const startListening = () => {
    setTranscript("");
    setRecognizedItems([]);
    setErrorMessage(null);
    
    const success = voiceAssistantService.startListening(
      (result) => {
        setTranscript(result.transcript);
        
        if (result.isFinal) {
          processVoiceInput(result.transcript);
        }
      },
      (error) => {
        console.error("Voice recognition error:", error);
        setErrorMessage(typeof error === 'string' ? error : "Error with voice recognition. Please try again.");
        setIsListening(false);
      }
    );
    
    if (success) {
      setIsListening(true);
      toast.success("Listening for shopping items...");
    }
  };
  
  const stopListening = () => {
    voiceAssistantService.stopListening();
    setIsListening(false);
    
    if (transcript) {
      processVoiceInput(transcript);
    }
  };
  
  const processVoiceInput = (text: string) => {
    setProcessing(true);
    
    try {
      // Extract shopping items from voice input
      const items = voiceAssistantService.parseShoppingItems(text);
      
      if (items.length > 0) {
        setRecognizedItems(items);
        toast.success(`Found ${items.length} items in your request`);
      } else {
        toast.error("No shopping items recognized. Try being more specific.");
      }
    } catch (error) {
      console.error("Error processing voice input:", error);
      toast.error("Error processing your request. Please try again.");
    } finally {
      setProcessing(false);
    }
  };
  
  const handleAddItem = (item: string) => {
    onAddItem(item);
    
    // Remove from recognized items
    setRecognizedItems(prev => prev.filter(i => i !== item));
    
    toast.success(`Added ${item} to your shopping list`);
  };
  
  const handleAddAllItems = () => {
    recognizedItems.forEach(item => onAddItem(item));
    toast.success(`Added ${recognizedItems.length} items to your shopping list`);
    setRecognizedItems([]);
  };
  
  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        {errorMessage ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-3 mb-3 bg-destructive/10 text-destructive rounded-md text-sm"
          >
            {errorMessage}
          </motion.div>
        ) : (
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant={listening ? "destructive" : "default"}
                size="sm"
                className="gap-2"
                onClick={handleToggleListening}
                disabled={!!errorMessage || processing}
              >
                {listening ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    <span>Add by Voice</span>
                  </>
                )}
              </Button>
              
              {recognizedItems.length > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAddAllItems}
                >
                  Add All Items
                </Button>
              )}
            </div>
            
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-3"
              >
                <p className="text-sm text-muted-foreground mb-1">I heard:</p>
                <div className="p-2 bg-primary/5 rounded-md text-sm">
                  {transcript}
                </div>
              </motion.div>
            )}
            
            {processing && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            
            {recognizedItems.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2 mt-3"
              >
                <p className="text-sm font-medium">Recognized items:</p>
                <div className="flex flex-wrap gap-2">
                  {recognizedItems.map((item, index) => (
                    <motion.div
                      key={`${item}-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center bg-accent/50 hover:bg-accent py-1 px-2 rounded-full text-sm"
                    >
                      <span>{item}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1"
                        onClick={() => handleAddItem(item)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceShoppingAssistant;
