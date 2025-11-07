export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-4 shadow-sm bg-white/80 dark:bg-zinc-900">
      <h2 className="font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );
}
export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={"px-3 py-2 rounded-md border hover:opacity-90 " + (props.className??"")} />;
}
