import { choosingTheRightSofa } from "./articles/choosing-the-right-sofa";
import { bedroomSetGuide } from "./articles/bedroom-set-guide";
import { diningFurnitureGuide } from "./articles/dining-furniture-guide";
import { woodFinishCare } from "./articles/wood-finish-care";
import { furnitureSeasonalCare } from "./articles/furniture-seasonal-care";
import { solidWoodMaterials } from "./articles/solid-wood-materials";
import { fabricMaterialsGuide } from "./articles/fabric-materials-guide";
import { joineryFundamentals } from "./articles/joinery-fundamentals";
import { spaceMeasurementGuide } from "./articles/space-measurement-guide";
import { minimalistInteriorStyle } from "./articles/minimalist-interior-style";
import { smallLivingRoomIdeas } from "./articles/small-living-room-ideas";
import { colorPaletteHome } from "./articles/color-palette-home";
import { behindTheCraft } from "./articles/behind-the-craft";
import { woodHumidityScience } from "./articles/wood-humidity-science";
import { getPostCategories, getPost as findPost, getRelatedPosts as findRelatedPosts } from "./helpers";

export type {
  Post,
  PostBlock,
  FaqItem,
  PodcastEpisode,
  MagazineCategory,
} from "./types";
export { MAGAZINE_CATEGORIES } from "./types";
export { CATEGORY_DESCRIPTIONS } from "./helpers";

export const posts = [
  choosingTheRightSofa,
  bedroomSetGuide,
  diningFurnitureGuide,
  woodFinishCare,
  furnitureSeasonalCare,
  solidWoodMaterials,
  fabricMaterialsGuide,
  joineryFundamentals,
  spaceMeasurementGuide,
  minimalistInteriorStyle,
  smallLivingRoomIdeas,
  colorPaletteHome,
  behindTheCraft,
  woodHumidityScience,
];

export const postCategories = getPostCategories(posts);

export function getPost(slug: string) {
  return findPost(slug, posts);
}

export function getRelatedPosts(slug: string, count = 3) {
  return findRelatedPosts(slug, posts, count);
}
