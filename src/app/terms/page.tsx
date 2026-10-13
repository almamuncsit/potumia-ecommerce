import { ContentPageView, contentMetadata } from "@/components/content-page";
import { getPage } from "@/lib/site";

export async function generateMetadata() {
  return contentMetadata((await getPage("terms"))!);
}

export default async function Page() {
  return <ContentPageView page={(await getPage("terms"))!} pageType="WebPage" />;
}
