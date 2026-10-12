import { ContentPageView, contentMetadata } from "@/components/content-page";
import { PAGES } from "@/content/pages";

const page = PAGES["privacy"];

export const metadata = contentMetadata(page);

export default function Page() {
  return <ContentPageView page={page} pageType="WebPage" />;
}
