import Link from "next/link";
import Container from "./Container";
import { LeafIcon } from "./icons";

export default function Footer() {
  return (
    <footer className="bg-primary-950 text-primary-200 mt-auto">
      <Container>
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <LeafIcon className="w-6 h-6 text-primary-400" />
              DeepLeaf
            </div>
            <p className="text-sm text-primary-300 leading-relaxed">
              AI-powered plant disease detection helping farmers protect their crops with smart technology.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Product</h4>
            <div className="space-y-2">
              <Link href="#features" className="block text-sm text-primary-300 hover:text-white transition-colors">Features</Link>
              <Link href="#upload" className="block text-sm text-primary-300 hover:text-white transition-colors">Upload</Link>
              <Link href="/plants" className="block text-sm text-primary-300 hover:text-white transition-colors">Dashboard</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Resources</h4>
            <div className="space-y-2">
              <Link href="#" className="block text-sm text-primary-300 hover:text-white transition-colors">Documentation</Link>
              <Link href="#" className="block text-sm text-primary-300 hover:text-white transition-colors">API Reference</Link>
              <Link href="#" className="block text-sm text-primary-300 hover:text-white transition-colors">Raspberry Pi Guide</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Contact</h4>
            <div className="space-y-2">
              <p className="text-sm text-primary-300">support@deepleaf.dev</p>
              <p className="text-sm text-primary-300">Open Source Project</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-800 py-6 text-center text-xs text-primary-400">
          &copy; {new Date().getFullYear()} DeepLeaf. Built for smarter farming.
        </div>
      </Container>
    </footer>
  );
}
