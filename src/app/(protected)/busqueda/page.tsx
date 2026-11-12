import type { ReactElement } from "react";
import SearchResultsClient from "@/core/features/workspace/search-results-client";

type SearchPageProps = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: SearchPageProps): Promise<ReactElement> {
  const { q } = await searchParams;
  return <SearchResultsClient query={q?.trim() ?? ""} />;
}
