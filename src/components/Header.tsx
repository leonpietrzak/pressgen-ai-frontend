import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-neo-black bg-neo-white px-4 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="font-bold text-xl text-neo-black">
          PressGen AI
        </div>
        
        <nav className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-neo-black hover:text-neo-purple transition-colors">
              Transcription
            </a>
            <a href="#" className="text-neo-black hover:text-neo-purple transition-colors">
              How's it work?
            </a>
            <a href="#" className="text-neo-black hover:text-neo-purple transition-colors">
              Price
            </a>
          </div>
          
          <Button variant="brutalist" size="lg">
            Join now
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;