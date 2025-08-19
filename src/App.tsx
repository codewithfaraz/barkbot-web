import { useState, useRef, useEffect } from "react";
import { useCount } from "../services/useCount";
// Mock usePrediction hook for demo
const usePrediction = () => {
  const [isLoading, setIsLoading] = useState(false);

  const makePrediction = async (image: any, prompt: any) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);

    // Mock response
    return {
      title: "🐕 Squirrel Alert!",
      description:
        "OMG there's a squirrel up there! Must protect the yard from this fluffy-tailed intruder. Should I bark? Yes, definitely bark!",
    };
  };

  return { makePrediction, isLoading };
};

// Modal Component
const PredictionModal = ({
  isOpen,
  onClose,
  prediction,
}: {
  isOpen: any;
  onClose: any;
  prediction: any;
}) => {
  if (!isOpen || !prediction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="bg-purple-100 p-2 rounded-xl mr-3">🧠</span>
            Dog's Thoughts
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Image with Title Overlay */}
          <div className="relative mb-6 flex justify-center">
            <div className="relative inline-block">
              <img
                src={prediction.image}
                alt="Dog thinking"
                className="max-w-full max-h-80 object-contain rounded-xl shadow-lg"
              />
              {/* Title Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-xl">
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">
                    {prediction.prediction?.title || "🐕 Thinking..."}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
            <div className="flex items-start space-x-3 mb-4">
              <div className="bg-blue-500 text-white rounded-full p-2 flex-shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                  What I'm thinking:
                </h4>
                <p className="text-gray-700 leading-relaxed text-base">
                  {prediction.prediction?.description ||
                    "Hmm, let me think about this..."}
                </p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Situation:</span>{" "}
                {prediction.prompt}
              </p>
              <p className="text-xs text-gray-400">
                Predicted at {new Date(prediction.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Got it! 🐾
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [image, setImage] = useState<any>(null);
  const [prompt, setPrompt] = useState<any>("");
  const [currentPrediction, setCurrentPrediction] = useState<any>(null);
  const [isPredicting, setIsPredicting] = useState<any>(false);
  const [predictions, setPredictions] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const fileInputRef = useRef<any>(null);
  const { makePrediction, isLoading } = usePrediction();
  const { addUser } = useCount();
  useEffect(() => {
    const callFunc = async () => {
      await addUser();
    };
    callFunc();
  }, []);
  const handleImageUpload = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
    // Reset the input value to allow selecting the same file again
    event.target.value = "";
  };

  const handlePredict = async () => {
    if (!image || !prompt.trim()) {
      alert("Please upload an image and enter a description");
      return;
    }

    setIsPredicting(true);

    try {
      const predictionResult = await makePrediction(image, prompt);

      const predictionData = {
        image,
        prompt,
        timestamp: new Date().toISOString(),
        prediction: predictionResult,
      };

      setCurrentPrediction(predictionData);
      setPredictions((prev: any) => [predictionData, ...prev]);
      setPrompt("");

      // Open modal when prediction is complete
      setIsModalOpen(true);
    } catch (error) {
      console.error("Prediction failed:", error);
      alert("Failed to get prediction. Please try again.");
    } finally {
      setIsPredicting(false);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const openPredictionModal = (prediction: any) => {
    setCurrentPrediction(prediction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🐕 BarkBot
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Discover what your furry friend is really thinking
          </p>
        </header>

        {/* Main Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl border border-gray-100 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="bg-blue-100 p-3 rounded-xl mr-4">📸</span>
            Upload & Describe
          </h2>

          {/* Image Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-blue-400 hover:bg-blue-50 mb-6 group"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />

            {image ? (
              <div className="relative inline-block">
                <img
                  src={image}
                  alt="Uploaded dog"
                  className="max-w-full max-h-48 object-cover rounded-lg mx-auto shadow-lg"
                />
                <button
                  type="button"
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage(null);
                  }}
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="h-10 w-10 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Text Input */}
          <div className="mb-6">
            <label
              htmlFor="prompt"
              className="block text-sm font-semibold text-gray-700 mb-3"
            >
              Describe the situation:
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., My dog is looking at a squirrel in the tree..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300 text-gray-700 h-24"
            />
          </div>

          {/* Predict Button */}
          <button
            onClick={handlePredict}
            disabled={isPredicting || !image || !prompt.trim()}
            className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 text-lg ${
              isPredicting || !image || !prompt.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
            }`}
          >
            {isPredicting ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Reading Dog's Mind...
              </div>
            ) : (
              "🧠 What's My Dog Thinking?"
            )}
          </button>
        </div>

        {/* Previous Predictions */}
        {predictions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-green-100 p-3 rounded-xl mr-4">📚</span>
              Previous Thoughts
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {predictions.map((prediction: any, index: any) => (
                <div
                  key={index}
                  className="border-2 border-gray-100 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:border-blue-200 cursor-pointer"
                  onClick={() => openPredictionModal(prediction)}
                >
                  <div className="relative mb-3">
                    <img
                      src={prediction.image}
                      alt="Dog"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg">
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white font-semibold text-sm truncate">
                          {prediction.prediction?.title}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate mb-2">
                    {prediction.prompt}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(prediction.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Prediction Modal */}
      <PredictionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        prediction={currentPrediction}
      />
    </div>
  );
}

export default App;
