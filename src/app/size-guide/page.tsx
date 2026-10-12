import { ContentPageView, contentMetadata } from "@/components/content-page";
import { PAGES, SIZE_CHART } from "@/content/pages";

const page = PAGES["size-guide"];

export const metadata = contentMetadata(page);

export default function Page() {
  return (
    <ContentPageView page={page}>
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
    </ContentPageView>
  );
}
