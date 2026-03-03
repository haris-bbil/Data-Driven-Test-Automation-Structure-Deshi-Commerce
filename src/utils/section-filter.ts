import { HomePageData } from "./types/home.types";
import { SECTION_FILTER } from "../config/section.filter.config";

export function filterSections(sections: HomePageData[]): HomePageData[] {
  const filtered = sections.filter(
    (s) => s.categorySectionTitle === SECTION_FILTER.section
  );

  if (!filtered.length) {
    throw new Error(
      `Section Filter Error: Section "${SECTION_FILTER.section}" not found in JSON`
    );
  }

  return filtered;
}
