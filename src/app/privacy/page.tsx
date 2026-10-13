import { ContentPageView, contentMetadata } from "@/components/content-page";
import { getPage } from "@/lib/site";

export async function generateMetadata() {
  return contentMetadata((await getPage("privacy"))!);
}

export default async function Page() {
  return <ContentPageView page={(await getPage("privacy"))!} pageType="WebPage" />;
}
