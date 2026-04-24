interface PageHeaderProps {
  subtitle: string;
  title: string;
  children?: React.ReactNode;
}

export default function PageHeader({ subtitle, title, children }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-end">
      <div>
        <p className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-1">
          {subtitle}
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">{title}</h2>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
