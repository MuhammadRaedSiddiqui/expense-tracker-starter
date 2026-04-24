export default function AppFooter() {
  return (
    <footer className="mt-8 pt-8 border-t border-outline-variant/20 flex justify-between items-center text-[10px] text-on-surface-variant/50 font-medium">
      <p>© 2024 FINANCE ARCHITECT • CORE ENGINE V4.2</p>
      <div className="flex items-center gap-6">
        <a className="hover:text-secondary transition-colors" href="#">
          PRIVACY POLICY
        </a>
        <a className="hover:text-secondary transition-colors" href="#">
          COMPLIANCE HUB
        </a>
        <a className="hover:text-secondary transition-colors" href="#">
          AUDIT LOGS
        </a>
        <a className="hover:text-secondary transition-colors" href="#">
          SUPPORT TERMINAL
        </a>
        <div className="flex items-center gap-2 pl-6 border-l border-outline-variant/20">
          <span className="w-2 h-2 bg-secondary rounded-full"></span>
          <span>Version 4.0.2-Stable</span>
        </div>
      </div>
    </footer>
  );
}
