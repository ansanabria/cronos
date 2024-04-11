export default function GlobalWrapper({ children }) {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
      {children}
    </div>
  );
}
