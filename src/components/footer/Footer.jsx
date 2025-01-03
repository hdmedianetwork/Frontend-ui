const Footer = () => (
  <footer className="bg-bg-color text-p-color py-8 mt-auto">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-head text-lg mb-4 font-bold">AI Interview Bot</h3>
          <p className="font-text">Practice interviews anytime, anywhere.</p>
        </div>
        <div>
          <h3 className="font-head text-lg mb-4 font-bold">Quick Links</h3>
          <ul className="space-y-2 font-text">
            <li>
              <a href="#" className="hover:text-s-color">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-s-color">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-s-color">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-head text-lg mb-4 font-bold">Connect</h3>
          <div className="flex space-x-4 font-text">
            <a href="#" className="hover:text-s-color">
              Twitter
            </a>
            <a href="#" className="hover:text-s-color">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="text-center mt-8 pt-8 border-t border-p-color font-text">
        <p>&copy; 2024 AI Interview Bot. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
