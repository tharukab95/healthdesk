const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} HealthDesk. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0">
            <nav className="flex space-x-4 text-sm text-gray-500">
              <a href="#" className="hover:text-teal-600">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-teal-600">
                Terms of Service
              </a>
              <a href="#" className="hover:text-teal-600">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
