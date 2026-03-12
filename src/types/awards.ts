export type Award = {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  artworkUrl: string;
  artworkWidth: number;
  artworkHeight: number;
  linkSlug: string;
  quantity: number;
  unit: string;
  prizeValue: string;
  note?: string;
};

export type AwardNavigationItem = {
  id: string;
  label: string;
  targetSectionId: string;
  order: number;
};

export type KudosPromo = {
  subtitle: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaRoute?: string | null;
};
