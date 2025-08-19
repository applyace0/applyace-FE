import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Plus, Loader2 } from 'lucide-react';
import { AutoSuggestionsService } from '@/lib/jobApplications';
import { toast } from 'sonner';

interface AutoSuggestInputProps {
  category: 'job_title' | 'skill' | 'duty' | 'education' | 'company' | 'location';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  allowCustom?: boolean;
  maxSuggestions?: number;
}

export const AutoSuggestInput: React.FC<AutoSuggestInputProps> = ({
  category,
  value,
  onChange,
  placeholder,
  className = '',
  allowCustom = true,
  maxSuggestions = 8
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load suggestions when input changes
  useEffect(() => {
    const loadSuggestions = async () => {
      if (value.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const results = await AutoSuggestionsService.getSuggestions(category, value);
        setSuggestions(results.slice(0, maxSuggestions));
      } catch (error) {
        console.error('Error loading suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(loadSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [value, category, maxSuggestions]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    
    // Add to user's suggestions if it's a custom value
    if (customValue && suggestion === customValue) {
      await AutoSuggestionsService.addSuggestion(category, suggestion, false);
    }
  };

  const handleAddCustom = async () => {
    if (!customValue.trim()) return;

    try {
      const success = await AutoSuggestionsService.addSuggestion(category, customValue.trim(), false);
      if (success) {
        onChange(customValue.trim());
        setCustomValue('');
        setShowSuggestions(false);
        toast.success('Custom value added to your suggestions');
      }
    } catch (error) {
      toast.error('Failed to add custom value');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customValue.trim()) {
      e.preventDefault();
      handleAddCustom();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder}
        className="w-full"
      />
      
      {showSuggestions && (suggestions.length > 0 || loading || (allowCustom && customValue)) && (
        <Card 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 shadow-lg border border-gray-200"
        >
          <CardContent className="p-2 max-h-60 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-gray-500">Loading suggestions...</span>
              </div>
            )}
            
            {!loading && suggestions.length > 0 && (
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center justify-between"
                  >
                    <span>{suggestion}</span>
                    <Check className="h-3 w-3 text-green-500" />
                  </button>
                ))}
              </div>
            )}
            
            {allowCustom && !loading && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Input
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Add custom ${category.replace('_', ' ')}...`}
                    className="flex-1 text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddCustom}
                    disabled={!customValue.trim()}
                    className="h-8 px-2"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
            
            {!loading && suggestions.length === 0 && !customValue && value.length >= 2 && (
              <div className="text-center py-2 text-sm text-gray-500">
                No suggestions found
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 