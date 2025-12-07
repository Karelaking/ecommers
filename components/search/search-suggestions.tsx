import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

interface SearchSuggestionsProps {
  query: string
  onQueryChange: (query: string) => void
  onSearch: (query: string) => void
  suggestions?: string[]
  recentSearches?: string[]
  placeholder?: string
}

export function SearchSuggestions({
  query,
  onQueryChange,
  onSearch,
  suggestions = [],
  recentSearches = [],
  placeholder = "Search for products, brands, or categories..."
}: SearchSuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const [showRecent, setShowRecent] = useState(false)

  useEffect(() => {
    if (query.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
      setFilteredSuggestions(filtered)
      setShowRecent(false)
      setIsOpen(filtered.length > 0)
    } else {
      setFilteredSuggestions([])
      setShowRecent(recentSearches.length > 0)
      setIsOpen(recentSearches.length > 0)
    }
  }, [query, suggestions, recentSearches])

  const handleSuggestionClick = (suggestion: string) => {
    onQueryChange(suggestion)
    onSearch(suggestion)
    setIsOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
      setIsOpen(false)
    }
  }

  const clearSearch = () => {
    onQueryChange('')
    setIsOpen(false)
  }

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => setIsOpen(query.length > 0 || recentSearches.length > 0)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {showRecent && recentSearches.length > 0 && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Recent Searches</h3>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <Search className="w-4 h-4 text-gray-400" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredSuggestions.length > 0 && (
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Suggestions</h3>
              <div className="space-y-1">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && filteredSuggestions.length === 0 && !showRecent && (
            <div className="p-4 text-center text-gray-500 text-sm">
              No suggestions found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}