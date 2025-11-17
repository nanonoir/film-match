import { MovieDTO } from './movie.types';

/**
 * Mensaje en el chat
 */
export interface ChatMessageDTO {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

/**
 * Payload para enviar un mensaje al chat
 */
export interface ChatRequestDTO {
  userId: number;
  message: string;
  conversationId?: string;
  includeRecommendations?: boolean;
  topK?: number;
}

/**
 * Respuesta del chat con recomendaciones opcionales
 */
export interface ChatResponseDTO {
  response: string;
  conversationId: string;
  recommendations?: MovieDTO[];
  metadata?: {
    tokensUsed?: number;
    processingTime?: number;
  };
}

/**
 * Payload para búsqueda semántica
 */
export interface SemanticSearchDTO {
  query: string;
  topK?: number;
  filters?: {
    genres?: string[];
    minRating?: number;
    yearRange?: [number, number];
  };
}

/**
 * Resultado de búsqueda semántica
 */
export interface SemanticSearchResultDTO {
  movies: MovieDTO[];
  query: string;
  resultsCount: number;
}

/**
 * Recomendación con score
 */
export interface RecommendationDTO extends MovieDTO {
  recommendationScore?: number;
  matchReason?: string;
}
