import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

// Interfejs dla wiadomości otrzymywanych z WebSocket
interface Message {
  type: "status" | "metadata" | "transcript" | "error";
  timestamp: number;
  data: any;
}

const MainContent = () => {
  // Stany komponentu
  const [url, setUrl] = useState(""); // URL wideo do transkrypcji
  const [messages, setMessages] = useState<Message[]>([]); // Historia wiadomości z WebSocket
  const [isConnected, setIsConnected] = useState(false); // Stan połączenia
  const wsRef = useRef<WebSocket | null>(null); // Referencja do WebSocket
  const messagesEndRef = useRef<HTMLDivElement>(null); // Referencja do końca listy wiadomości

  // Automatyczne przewijanie do najnowszych wiadomości
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Obsługa połączenia/rozłączenia z WebSocket
  const handleConnect = () => {
    if (isConnected) {
      // Rozłączanie - zamknij WebSocket
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    if (!url) return;

    // Tworzenie nowego połączenia WebSocket
    const ws = new WebSocket(
      "wss://press-gen-ai-backend-production.up.railway.app/transcribe-live"
    );
    wsRef.current = ws;

    // Po otwarciu połączenia - wysyłamy URL i język
    ws.onopen = () => {
      setIsConnected(true);
      const message = {
        url: url,
        language: "pl",
      };
      ws.send(JSON.stringify(message));

      setMessages((prev) => [
        ...prev,
        {
          type: "status",
          timestamp: Date.now(),
          data: { status: "connected" },
        },
      ]);
    };

    // Odbieranie wiadomości z serwera
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [
          ...prev,
          {
            type: data.type,
            timestamp: Date.now(),
            data: data,
          },
        ]);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    // Obsługa błędów połączenia
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "error",
          timestamp: Date.now(),
          data: { error: "Connection error" },
        },
      ]);
    };

    // Po zamknięciu połączenia
    ws.onclose = () => {
      setIsConnected(false);
      setMessages((prev) => [
        ...prev,
        {
          type: "status",
          timestamp: Date.now(),
          data: { status: "disconnected" },
        },
      ]);
    };
  };

  // Renderowanie wiadomości w zależności od typu
  const renderMessage = (message: Message) => {
    switch (message.type) {
      // Wiadomości statusowe (połączenie, transkrypcja rozpoczęta, itp.)
      case "status":
        return (
          <div className="mb-3 p-3 bg-blue-100 border-l-4 border-blue-500 rounded">
            <span className="font-semibold text-blue-900">Status:</span>{" "}
            {message.data.status}
          </div>
        );

      // Metadane wideo (tytuł, kanał, liczba wyświetleń)
      case "metadata":
        return (
          <div className="mb-3 p-3 bg-purple-100 border-l-4 border-purple-500 rounded">
            <div className="font-semibold text-purple-900 mb-2">Metadata:</div>
            <div className="text-sm text-purple-800">
              <div>
                <strong>Title:</strong> {message.data.metadata.title}
              </div>
              <div>
                <strong>Channel:</strong> {message.data.metadata.channel}
              </div>
              <div>
                <strong>Live:</strong>{" "}
                {message.data.metadata.is_live ? "Yes" : "No"}
              </div>
              <div>
                <strong>Views:</strong> {message.data.metadata.view_count}
              </div>
            </div>
          </div>
        );

      // Transkrypcja - tekst z czasem i poziomem pewności
      case "transcript":
        return (
          <div className="mb-3 p-3 bg-green-100 border-l-4 border-green-500 rounded">
            <div className="text-sm text-green-800">
              <div className="flex items-start gap-2">
                <span className="font-semibold min-w-[80px]">
                  Speaker {message.data.speaker}:
                </span>
                <span className="flex-1">{message.data.text}</span>
              </div>
              <div className="text-xs text-green-600 mt-1">
                {message.data.start?.toFixed(2)}s -{" "}
                {message.data.end?.toFixed(2)}s | Confidence:{" "}
                {(message.data.confidence * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        );

      // Komunikaty błędów
      case "error":
        return (
          <div className="mb-3 p-3 bg-red-100 border-l-4 border-red-500 rounded">
            <div className="font-semibold text-red-900">Error:</div>
            <div className="text-sm text-red-800">{message.data.error}</div>
            {message.data.detail && (
              <div className="text-xs text-red-700 mt-1">
                {message.data.detail}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16 bg-neo-white">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-neo-black mb-6 leading-tight">
          <div>PressGen AI - Transcript</div>
          <div>Video Assistant</div>
        </h1>

        <p className="text-lg md:text-xl text-neo-black mb-12 max-w-2xl mx-auto leading-relaxed">
          <div>Stop wasting hours on manual transcription.</div>
          <div>
            PressGen AI delivers live and on-demand transcripts—so you can
            write, not rewatch. Try for free:
          </div>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <Input
            type="url"
            placeholder="Paste video link here..."
            className="flex-1 h-14 text-lg border-2 border-neo-black bg-neo-gray text-neo-black placeholder:text-neo-black/60"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isConnected}
          />
          <Button
            variant="accent"
            size="lg"
            className="h-14 px-8"
            onClick={handleConnect}
            disabled={!isConnected && !url}
          >
            {isConnected ? "Zakończ" : "Transkrybuj"}
          </Button>
        </div>

        <div className="mt-8 max-w-2xl mx-auto h-[500px] border-2 border-neo-black bg-neo-gray p-6 text-left overflow-y-auto rounded-lg">
          {messages.length === 0 ? (
            <p className="text-neo-black">Tutaj będzie transkrypcja live.</p>
          ) : (
            <div>
              {messages.map((message, index) => (
                <div key={index}>{renderMessage(message)}</div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MainContent;
