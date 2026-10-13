import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPageView, contentMetadata } from "@/components/content-page";
import { SIZE_CHART } from "@/content/pages";
import { getPage } from "@/lib/site";

/** Only themes that sell clothing have a size guide */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("size-guide");
  return page ? contentMetadata(page) : { title: "Not found", robots: { index: false } };
}

export default async function Page() {
  const page = await getPage("size-guide");
  if (!page) notFound();

  return (
    <ContentPageView page={page}>
      {SIZE_CHART && (
        <section>
          <h2>Size chart (inches)</h2>
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="!my-0">
              <thead>
                <tr>
                  {SIZE_CHART.headers.map((h) => (
                    <th key={h} scope="col">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZE_CHART.rows.map(([size, ...cells]) => (
                  <tr key={size}>
                    <th scope="row">{size}</th>
                    {cells.map((c, i) => (
                      <td key={i}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted">These are body measurements. Garment measurements can vary slightly by style.</p>
        </section>
      )}
    </ContentPageView>
  );
}
