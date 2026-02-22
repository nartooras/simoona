import type { RuntimeData } from "../../app/runtime-data";

export function FallbackView({ runtimeData }: { runtimeData: RuntimeData }) {
  return (
    <section className="route-placeholder">
      <h2>{runtimeData.routeMatch?.routeKey || "Route"}</h2>
      <p>This route is recognized and mapped, but detailed UI parity is still in progress.</p>
      <p>
        Current route: <code>{runtimeData.route}</code>
      </p>
    </section>
  );
}
