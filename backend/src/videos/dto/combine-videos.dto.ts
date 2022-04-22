export class CombineVideosDto {
  readonly first: string;
  readonly second: string;
  readonly offset: string;
  readonly filterType: 'fade' | 'radial' | 'hlslice' | 'vuslice' | 'hblur';
}
