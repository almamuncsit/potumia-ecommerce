import { ContentPageView, contentMetadata } from "@/components/content-page";
import { getPage } from "@/lib/site";

export async function generateMetadata() {
  return contentMetadata((await getPage("about"))!);
}

export default async function Page() {
  return <ContentPageView page={(await getPage("about"))!} pageType="AboutPage" />;
}
