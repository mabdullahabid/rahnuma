export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-slate-600 text-sm">
              &copy; {currentYear} Rahnuma. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-slate-600 hover:text-indigo-600 text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-slate-600 hover:text-indigo-600 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-600 hover:text-indigo-600 text-sm">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}