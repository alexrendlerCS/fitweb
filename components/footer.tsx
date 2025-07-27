import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="text-2xl font-bold text-white mb-2">
              <span className="text-[#004d40]">Fit</span>Web Studio
            </div>
            <p className="text-gray-400">
              Building the future of fitness platforms
            </p>
          </div>

          <div className="flex space-x-6">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#004d40] transition-colors duration-200"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#004d40] transition-colors duration-200"
            >
              <Github size={24} />
            </a>
            <a
              href="mailto:hello@fitwebstudio.com"
              className="text-gray-400 hover:text-[#004d40] transition-colors duration-200"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 FitWeb Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
