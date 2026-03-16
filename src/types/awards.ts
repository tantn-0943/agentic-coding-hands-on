export type PrizeEntry = {
  value: string;
  label?: string;
};

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
  prizeEntries?: PrizeEntry[];
  note?: string;
  imagePosition?: "left" | "right";
};

export type AwardNavigationItem = {
  id: string;
  label: string;
  targetSectionId: string;
  order: number;
};

export type KudosPromo = {
  label: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaRoute?: string | null;
};
