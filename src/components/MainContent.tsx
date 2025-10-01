import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MainContent = () => {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16 bg-neo-white">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-neo-black mb-6 leading-tight">
          <div>PressGen AI - Transcript</div>
          <div>Video Assistant</div>
        </h1>
        
        <p className="text-lg md:text-xl text-neo-black mb-12 max-w-2xl mx-auto leading-relaxed">
          <div>Stop wasting hours on manual transcription.</div>
          <div>PressGen AI delivers live and on-demand transcripts—so you can write, not rewatch. Try for free:</div>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <Input 
            type="url" 
            placeholder="Paste video link here..."
            className="flex-1 h-14 text-lg border-2 border-neo-black bg-neo-gray text-neo-black placeholder:text-neo-black/60"
          />
          <Button variant="accent" size="lg" className="h-14 px-8">
            Transcript
          </Button>
        </div>

        <div className="mt-8 max-w-2xl mx-auto h-[500px] border-2 border-neo-black bg-neo-gray p-6 text-left overflow-y-auto rounded-lg">
          <p className="text-neo-black">Tutaj będzie transkrypcja live.</p>
        </div>
      </div>
    </main>
  );
};

export default MainContent;