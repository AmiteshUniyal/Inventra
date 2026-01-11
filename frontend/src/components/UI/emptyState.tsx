export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-white py-16 text-center">
      <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>

      {description && (
        <p className="mt-2 max-w-sm text-sm text-zinc-500">{description}</p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
