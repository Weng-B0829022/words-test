'use client';

import { useState, useEffect } from 'react';
import wordsList from '../../words';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState("3/14");
  const [shuffledWords, setShuffledWords] = useState([...wordsList[selectedDate]]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // 打亂單詞順序的函數
  const shuffleWords = () => {
    const newWords = [...wordsList[selectedDate]];
    for (let i = newWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newWords[i], newWords[j]] = [newWords[j], newWords[i]];
    }
    setShuffledWords(newWords);
    setCurrentIndex(0);
    setShowTranslation(false);
  };

  // 當選擇的日期改變時重新打亂單詞
  useEffect(() => {
    shuffleWords();
  }, [selectedDate]);

  const handleNext = () => {
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar toggle button for mobile */}
      <button 
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-20 p-2 bg-gray-200 rounded-lg"
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:static
        w-64 bg-gray-100 p-4 border-r
        min-h-screen overflow-y-auto
        transition-transform duration-300 z-10
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <h2 className="text-xl font-bold mb-4">單字列表</h2>
        <div className="space-y-2">
          {Object.keys(wordsList).map((date) => (
            <button
              key={date}
              onClick={() => {
                setSelectedDate(date);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded ${
                selectedDate === date
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-200'
              }`}
            >
              {date} ({wordsList[date].length}個單字)
            </button>
          ))}
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <main className="flex-1 p-8 lg:ml-0">
        <div className="max-w-md mx-auto">
          {/* Progress indicator */}
          <div className="text-right mb-4">
            <p className="text-gray-600">
              {currentIndex + 1} / {shuffledWords.length} 卡片
            </p>
          </div>

          {/* Flashcard */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-4 h-48 transition-transform duration-300 hover:-rotate-1 hover:scale-[1.02]">
            <h2 className="text-3xl font-bold text-center mb-4">
              {shuffledWords[currentIndex].english}
            </h2>
            
            <p className="text-gray-500 text-center mb-4 italic">
              {shuffledWords[currentIndex].partOfSpeech}
            </p>
            
            {showTranslation && (
              <div className="text-center">
                <p className="text-xl text-gray-700 mb-2">
                  {shuffledWords[currentIndex].chinese}
                </p>
                {shuffledWords[currentIndex].synonyms && (
                  <p className="text-sm text-gray-500">
                    同義字: {shuffledWords[currentIndex].synonyms.join(", ")}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Control buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handlePrevious}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              disabled={currentIndex === 0}
            >
              上一個
            </button>

            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {showTranslation ? '隱藏翻譯' : '顯示翻譯'}
            </button>
            
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              disabled={currentIndex === shuffledWords.length - 1}
            >
              下一個
            </button>
          </div>

          {/* Shuffle button */}
          <div className="mt-4 text-center">
            <button
              onClick={shuffleWords}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              重新打亂
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}