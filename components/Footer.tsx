import BackToTop from "./BackToTop";

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-gray-400 text-center text-xs py-6 relative">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div>COPYRIGHT © 2026 PTG SOLUTION. ALL RIGHTS RESERVED.</div>
        <BackToTop />
      </div>
    </footer>
  );
}
