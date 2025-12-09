export enum AppMode {
  TRANSFORM = 'TRANSFORM',
  GENERATE = 'GENERATE',
  ANALYZE = 'ANALYZE',
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '9:16',
  LANDSCAPE = '16:9',
  ULTRAWIDE = '21:9',
  STANDARD = '4:3',
  TALL = '3:4',
}

export enum ImageSize {
  ONE_K = '1K',
  TWO_K = '2K',
  FOUR_K = '4K',
}

export interface PokemonOption {
  id: string;
  name: string;
  type: string[];
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}
