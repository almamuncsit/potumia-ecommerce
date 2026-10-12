import { ContentPageView, contentMetadata } from "@/components/content-page";
import { PAGES } from "@/content/pages";

const page = PAGES["about"];

export const metadata = contentMetadata(page);

export default function Page() {
  return <ContentPageView page={page} pageType="AboutPage" />;
}
