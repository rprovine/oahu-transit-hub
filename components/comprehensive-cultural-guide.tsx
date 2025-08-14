"use client";

import { useState } from 'react';
import { 
  Volume2, BookOpen, Heart, Leaf, Users, Mountain, 
  Waves, Sun, Compass, Gift, Coffee, Star, ChevronRight,
  Play, Pause, ArrowRight, Globe, Shield
} from 'lucide-react';

interface CulturalGuideProps {
  locationContext?: any;
}

export default function ComprehensiveCulturalGuide({ locationContext }: CulturalGuideProps) {
  const [selectedSection, setSelectedSection] = useState('overview');
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  const playPronunciation = (text: string, id: string) => {
    if (isPlaying === id) {
      speechSynthesis.cancel();
      setIsPlaying(null);
      return;
    }

    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.6;
      utterance.pitch = 1;
      utterance.onend = () => setIsPlaying(null);
      speechSynthesis.speak(utterance);
      setIsPlaying(id);
    }
  };

  const sections = [
    { id: 'overview', title: 'Cultural Overview', icon: '🌺' },
    { id: 'language', title: 'Hawaiian Language', icon: '🗣️' },
    { id: 'etiquette', title: 'Cultural Etiquette', icon: '🤝' },
    { id: 'history', title: 'History & Context', icon: '📚' },
    { id: 'sustainability', title: 'Responsible Tourism', icon: '🌱' },
    { id: 'food', title: 'Food & Traditions', icon: '🍽️' },
    { id: 'nature', title: 'Natural Environment', icon: '🏝️' },
    { id: 'arts', title: 'Arts & Crafts', icon: '🎨' }
  ];

  const renderSection = () => {
    switch (selectedSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-tropical-50 to-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-tropical-800 mb-4">Welcome to Hawaiian Culture</h3>
              <p className="text-gray-700 mb-4">
                Hawaii is not just a vacation destination - it's the ancestral homeland of the Native Hawaiian people 
                (Kanaka Maoli), with a rich culture dating back over 1,500 years. As visitors, we have the privilege 
                and responsibility to learn about, respect, and support Hawaiian culture and values.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-tropical-200">
                  <h4 className="font-semibold text-tropical-800 mb-2">Core Hawaiian Values (Nā Kānāwai)</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><strong>Aloha:</strong> Love, compassion, hello/goodbye</li>
                    <li><strong>Ohana:</strong> Family, including chosen family</li>
                    <li><strong>Mālama:</strong> To care for, protect, nurture</li>
                    <li><strong>Kuleana:</strong> Responsibility, authority, privilege</li>
                    <li><strong>Pono:</strong> Righteousness, proper, correct</li>
                    <li><strong>Ho'oponopono:</strong> To make right, restore harmony</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border border-tropical-200">
                  <h4 className="font-semibold text-tropical-800 mb-2">Important Understanding</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Hawaii was an independent kingdom until 1893</li>
                    <li>• Native Hawaiians are indigenous to these islands</li>
                    <li>• Hawaiian culture is living and evolving, not historical</li>
                    <li>• Land and ocean are sacred, not commodities</li>
                    <li>• Tourism impacts affect local communities</li>
                    <li>• Cultural appreciation vs. appropriation matters</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {locationContext?.culturalContext && (
              <div className="border-l-4 border-blue-500 pl-6">
                <h4 className="font-semibold text-lg text-blue-800 mb-2">🏝️ Your Current Area: Cultural Context</h4>
                <p className="text-gray-700 mb-3">{locationContext.culturalContext.historicalSignificance}</p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">Respectful Behavior in This Area:</h5>
                  <ul className="space-y-1 text-sm text-blue-700">
                    {locationContext.culturalContext.respectfulBehavior.map((behavior: string, idx: number) => (
                      <li key={idx}>• {behavior}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6">
            <div className="bg-tropical-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-tropical-800 mb-4">ʻŌlelo Hawaiʻi (Hawaiian Language)</h3>
              <p className="text-gray-700 mb-4">
                Hawaiian is one of only two official languages of Hawaii (along with English). Learning basic Hawaiian 
                words shows respect for the culture and enriches your experience. Hawaiian has only 13 letters: 
                5 vowels (a, e, i, o, u) and 8 consonants (h, k, l, m, n, p, w, ʻ).
              </p>
            </div>

            <div className="grid gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-lg mb-4">Essential Greetings & Courtesy</h4>
                <div className="space-y-3">
                  {[
                    { hawaiian: 'Aloha', pronunciation: 'ah-LOW-hah', english: 'Hello, goodbye, love, compassion' },
                    { hawaiian: 'Mahalo', pronunciation: 'mah-HAH-low', english: 'Thank you' },
                    { hawaiian: 'Mahalo nui loa', pronunciation: 'mah-HAH-low noo-ee LOW-ah', english: 'Thank you very much' },
                    { hawaiian: 'ʻAe', pronunciation: 'EYE-eh', english: 'Yes' },
                    { hawaiian: 'ʻAʻole', pronunciation: 'ah-OH-leh', english: 'No' },
                    { hawaiian: 'E komo mai', pronunciation: 'eh KOH-moh my', english: 'Welcome, come in' },
                    { hawaiian: 'A hui hou', pronunciation: 'ah HOO-ee ho', english: 'Until we meet again' }
                  ].map((phrase, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-tropical-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-tropical-800">{phrase.hawaiian}</p>
                        <p className="text-sm text-gray-600">{phrase.english}</p>
                        <p className="text-xs text-tropical-600">Pronunciation: {phrase.pronunciation}</p>
                      </div>
                      <button
                        onClick={() => playPronunciation(phrase.hawaiian, `phrase-${idx}`)}
                        className="ml-3 p-2 text-tropical-600 hover:text-tropical-700 hover:bg-tropical-100 rounded-full"
                        title="Listen to pronunciation"
                      >
                        {isPlaying === `phrase-${idx}` ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-lg mb-4">Places & Directions</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {[
                      { hawaiian: 'Mauka', pronunciation: 'MAU-kah', english: 'Toward the mountains/inland' },
                      { hawaiian: 'Makai', pronunciation: 'mah-KAI', english: 'Toward the ocean' },
                      { hawaiian: 'Aina', pronunciation: 'EYE-nah', english: 'Land, earth' },
                      { hawaiian: 'Kai', pronunciation: 'kah-ee', english: 'Ocean, sea' },
                      { hawaiian: 'Mauna', pronunciation: 'MAU-nah', english: 'Mountain' },
                      { hawaiian: 'Wai', pronunciation: 'why', english: 'Fresh water' }
                    ].map((phrase, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{phrase.hawaiian}</p>
                          <p className="text-sm text-gray-600">{phrase.english}</p>
                          <p className="text-xs text-gray-500">({phrase.pronunciation})</p>
                        </div>
                        <button
                          onClick={() => playPronunciation(phrase.hawaiian, `place-${idx}`)}
                          className="ml-2 p-1 text-gray-600 hover:text-tropical-600 rounded"
                        >
                          <Volume2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {[
                      { hawaiian: 'Ohana', pronunciation: 'oh-HAH-nah', english: 'Family (blood or chosen)' },
                      { hawaiian: 'Keiki', pronunciation: 'KAY-kee', english: 'Child, children' },
                      { hawaiian: 'Kupuna', pronunciation: 'koo-POO-nah', english: 'Elder, ancestor' },
                      { hawaiian: 'Hale', pronunciation: 'HAH-leh', english: 'House, home' },
                      { hawaiian: 'Pua', pronunciation: 'POO-ah', english: 'Flower' },
                      { hawaiian: 'Moku', pronunciation: 'MOH-koo', english: 'Island, district' }
                    ].map((phrase, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{phrase.hawaiian}</p>
                          <p className="text-sm text-gray-600">{phrase.english}</p>
                          <p className="text-xs text-gray-500">({phrase.pronunciation})</p>
                        </div>
                        <button
                          onClick={() => playPronunciation(phrase.hawaiian, `family-${idx}`)}
                          className="ml-2 p-1 text-gray-600 hover:text-tropical-600 rounded"
                        >
                          <Volume2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-medium text-orange-800 mb-2">Pronunciation Guidelines</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Vowels: a (ah), e (eh), i (ee), o (oh), u (oo)</li>
                  <li>• ʻOkina (ʻ): glottal stop, like the pause in "oh-oh"</li>
                  <li>• Kahakō (ā): makes vowel sound longer</li>
                  <li>• Each vowel is pronounced separately</li>
                  <li>• Stress usually falls on the next-to-last syllable</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'etiquette':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Cultural Etiquette & Protocols</h3>
              <p className="text-gray-700">
                Understanding and following Hawaiian cultural protocols shows respect for the host culture 
                and helps preserve traditions for future generations.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Social Interactions
                </h4>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-medium text-green-800">Do:</h5>
                    <ul className="text-sm text-gray-700 space-y-1 mt-1">
                      <li>• Greet people with "Aloha" and a warm smile</li>
                      <li>• Remove shoes before entering homes (even vacation rentals)</li>
                      <li>• Bring a small gift (omiyage) when visiting someone's home</li>
                      <li>• Listen more than you speak, especially about local issues</li>
                      <li>• Ask permission before taking photos of people</li>
                      <li>• Support local businesses and artists</li>
                      <li>• Learn about the places you visit and their significance</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-medium text-red-800">Don't:</h5>
                    <ul className="text-sm text-gray-700 space-y-1 mt-1">
                      <li>• Use Hawaiian words incorrectly or make up "Hawaiian" words</li>
                      <li>• Assume all locals want to talk to tourists</li>
                      <li>• Complain about prices - remember you're in paradise</li>
                      <li>• Litter or leave belongings on beaches</li>
                      <li>• Touch or move cultural artifacts or sacred objects</li>
                      <li>• Appropriate Hawaiian culture for costumes or parties</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Mountain className="h-5 w-5 text-purple-600" />
                  Sacred Sites & Natural Areas
                </h4>
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">Heiau (Temples) & Sacred Sites</h5>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Approach with reverence and respect</li>
                      <li>• Don't climb on or touch stone structures</li>
                      <li>• Speak quietly and behave respectfully</li>
                      <li>• Don't leave offerings unless you understand proper protocols</li>
                      <li>• Some areas may be kapu (off-limits) - respect all boundaries</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-2">Natural Environment</h5>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Never take lava rocks, sand, coral, or shells</li>
                      <li>• Don't carve names or leave marks on rocks or trees</li>
                      <li>• Stay on designated trails to protect native plants</li>
                      <li>• Don't feed wild animals or touch marine life</li>
                      <li>• Pack out all trash, including organic waste</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Waves className="h-5 w-5 text-blue-600" />
                  Ocean & Beach Etiquette
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-blue-800 mb-2">Surfing Etiquette</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Give right of way to locals</li>
                      <li>• Don't drop in on someone's wave</li>
                      <li>• Wait your turn in the lineup</li>
                      <li>• Apologize if you make mistakes</li>
                      <li>• Respect surf spots' local customs</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-800 mb-2">General Beach Behavior</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Use reef-safe sunscreen only</li>
                      <li>• Don't take up excessive space</li>
                      <li>• Respect Hawaiian monk seals and sea turtles</li>
                      <li>• Keep beaches clean</li>
                      <li>• Be mindful of local fishing activities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <div className="bg-amber-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-amber-800 mb-4">Hawaiian History & Context</h3>
              <p className="text-gray-700">
                Understanding Hawaii's complex history helps visitors appreciate the contemporary issues 
                and cultural renaissance happening today.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-lg mb-4">Key Historical Periods</h4>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-medium text-blue-800">Ancient Hawaii (300-1778 CE)</h5>
                    <p className="text-sm text-gray-700 mt-1">
                      Polynesian navigators arrived around 300-400 CE, developing sophisticated agricultural, 
                      social, and spiritual systems. Complex chiefdoms emerged with advanced aquaculture, 
                      astronomy, and sustainable resource management.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-medium text-green-800">Kingdom of Hawaii (1795-1893)</h5>
                    <p className="text-sm text-gray-700 mt-1">
                      King Kamehameha I united the Hawaiian Islands in 1810. The kingdom developed a 
                      constitutional monarchy, written constitution, and was internationally recognized. 
                      This was a time of cultural flourishing and political sophistication.
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-medium text-red-800">Overthrow & Annexation (1893-1900)</h5>
                    <p className="text-sm text-gray-700 mt-1">
                      American businessmen illegally overthrew Queen Liliʻuokalani in 1893. Despite Native 
                      Hawaiian opposition and international law violations, the US annexed Hawaii in 1898 
                      without consent of Native Hawaiians.
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h5 className="font-medium text-purple-800">Territorial Period (1900-1959)</h5>
                    <p className="text-sm text-gray-700 mt-1">
                      Hawaii became a US territory. Plantation agriculture dominated the economy with 
                      immigrant labor from Asia and Portugal. Hawaiian language was banned in schools, 
                      and land ownership was concentrated among non-Hawaiians.
                    </p>
                  </div>
                  <div className="border-l-4 border-teal-500 pl-4">
                    <h5 className="font-medium text-teal-800">Statehood & Renaissance (1959-present)</h5>
                    <p className="text-sm text-gray-700 mt-1">
                      Hawaii became the 50th state in 1959. The Hawaiian Renaissance beginning in the 1960s-70s 
                      revitalized Hawaiian culture, language, and sovereignty movements. Today, there's ongoing 
                      work toward justice and cultural preservation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-lg mb-4">Contemporary Issues to Understand</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <h5 className="font-medium text-yellow-800">Housing & Cost of Living</h5>
                      <p className="text-sm text-yellow-700 mt-1">
                        Many Native Hawaiians and locals are priced out of their ancestral lands due to 
                        tourism and outside investment. Housing costs are among the highest in the US.
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h5 className="font-medium text-blue-800">Environmental Protection</h5>
                      <p className="text-sm text-blue-700 mt-1">
                        Climate change, overtourism, and development threaten fragile island ecosystems. 
                        Coral reefs, native species, and water resources face significant challenges.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h5 className="font-medium text-green-800">Cultural Preservation</h5>
                      <p className="text-sm text-green-700 mt-1">
                        Efforts to revitalize Hawaiian language, traditional practices, and cultural 
                        knowledge continue. Immersion schools and cultural programs work to pass on traditions.
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h5 className="font-medium text-purple-800">Sovereignty Movement</h5>
                      <p className="text-sm text-purple-700 mt-1">
                        Many Native Hawaiians advocate for recognition of inherent sovereignty and 
                        self-determination, working toward justice for historical and ongoing impacts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'sustainability':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-green-800 mb-4">Responsible & Sustainable Tourism</h3>
              <p className="text-gray-700">
                As visitors, we have the opportunity to travel in ways that support local communities, 
                protect the environment, and contribute positively to Hawaii's future.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Environmental Responsibility
                </h4>
                <div className="space-y-4">
                  {locationContext?.sustainabilityTips ? (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-2">For Your Current Area:</h5>
                      <ul className="space-y-1 text-sm text-green-700">
                        {locationContext.sustainabilityTips.map((tip: string, idx: number) => (
                          <li key={idx}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-green-800 mb-2">Ocean & Marine Life</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Use only reef-safe, mineral-based sunscreen (zinc oxide/titanium dioxide)</li>
                        <li>• Don't touch coral, fish, or marine animals</li>
                        <li>• Never feed marine life</li>
                        <li>• Maintain 10+ feet distance from sea turtles and monk seals</li>
                        <li>• Choose reef-friendly tour operators</li>
                        <li>• Don't use chemical sunscreens or sprays near water</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-green-800 mb-2">Land & Wildlife</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Stay on designated trails to protect native plants</li>
                        <li>• Don't feed birds or wild animals</li>
                        <li>• Pack out all trash, including organic waste</li>
                        <li>• Don't pick plants, flowers, or take natural souvenirs</li>
                        <li>• Respect nesting areas and wildlife refuges</li>
                        <li>• Choose eco-certified accommodations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Supporting Local Communities
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-blue-800 mb-2">Economic Support</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Shop at local farmers markets and small businesses</li>
                      <li>• Choose locally-owned restaurants over chains</li>
                      <li>• Buy authentic Hawaiian-made crafts and products</li>
                      <li>• Tip service workers generously (cost of living is high)</li>
                      <li>• Support Native Hawaiian-owned businesses</li>
                      <li>• Use local tour guides and cultural educators</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-800 mb-2">Cultural Respect</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Learn about places before visiting</li>
                      <li>• Follow cultural protocols and guidelines</li>
                      <li>• Support cultural preservation organizations</li>
                      <li>• Choose authentic cultural experiences over commercialized versions</li>
                      <li>• Listen to and amplify Native Hawaiian voices</li>
                      <li>• Educate others about responsible travel</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Compass className="h-5 w-5 text-purple-600" />
                  Sustainable Travel Practices
                </h4>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">Transportation</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Use public transportation (TheBus, HART Skyline) when possible</li>
                      <li>• Walk or bike for short distances</li>
                      <li>• Share rides or use electric/hybrid vehicles</li>
                      <li>• Consider staying longer to reduce flight frequency</li>
                      <li>• Book direct flights when available</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">Accommodations</h5>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Choose eco-certified hotels or vacation rentals</li>
                      <li>• Conserve water and energy</li>
                      <li>• Reuse towels and linens when possible</li>
                      <li>• Avoid single-use plastics</li>
                      <li>• Support properties with renewable energy</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-medium text-orange-800 mb-2">🚫 What NOT to Take Home</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Lava rocks or volcanic sand (also considered bad luck)</li>
                  <li>• Coral, shells, or sea glass from beaches</li>
                  <li>• Plants, flowers, or seeds (many are protected or invasive)</li>
                  <li>• Cultural artifacts or sacred objects</li>
                  <li>• Sand from any beach (it's needed for coastal protection)</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'food':
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-orange-800 mb-4">Hawaiian Food Culture & Traditions</h3>
              <p className="text-gray-700">
                Food in Hawaii reflects the islands' multicultural heritage while maintaining strong roots 
                in Native Hawaiian traditions and sustainable practices.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-lg mb-4">Traditional Hawaiian Foods</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {[
                      { name: 'Poi', description: 'Taro root paste, sacred staple food', cultural: 'Central to Hawaiian culture and family meals' },
                      { name: 'Poke', description: 'Cubed raw fish with seasonings', cultural: 'Traditional fishing community food' },
                      { name: 'Kalua pig', description: 'Whole pig cooked in underground oven', cultural: 'Traditional imu (earth oven) cooking' },
                      { name: 'Lau lau', description: 'Pork wrapped in taro leaves', cultural: 'Labor-intensive dish showing care and love' }
                    ].map((food, idx) => (
                      <div key={idx} className="bg-orange-50 p-3 rounded-lg">
                        <h5 className="font-medium text-orange-800">{food.name}</h5>
                        <p className="text-sm text-gray-700">{food.description}</p>
                        <p className="text-xs text-orange-600 mt-1">{food.cultural}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Pipi kaula', description: 'Hawaiian beef jerky', cultural: 'Traditional preservation method' },
                      { name: 'Haupia', description: 'Coconut pudding dessert', cultural: 'Traditional celebration food' },
                      { name: 'Malasadas', description: 'Portuguese donuts (adopted local food)', cultural: 'Portuguese immigrant contribution' },
                      { name: 'Shave ice', description: 'Japanese-style flavored ice', cultural: 'Japanese plantation worker tradition' }
                    ].map((food, idx) => (
                      <div key={idx} className="bg-orange-50 p-3 rounded-lg">
                        <h5 className="font-medium text-orange-800">{food.name}</h5>
                        <p className="text-sm text-gray-700">{food.description}</p>
                        <p className="text-xs text-orange-600 mt-1">{food.cultural}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-lg mb-4">Local Food Etiquette & Customs</h4>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-medium text-green-800">Respectful Food Practices</h5>
                    <ul className="text-sm text-gray-700 space-y-1 mt-1">
                      <li>• Try poi the traditional way - with your fingers, not utensils</li>
                      <li>• Don't add salt or seasonings without tasting first</li>
                      <li>• Share food when offered - it's part of aloha spirit</li>
                      <li>• Ask questions about ingredients and preparation respectfully</li>
                      <li>• Support family-owned local establishments</li>
                      <li>• Be patient - good food takes time</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-medium text-blue-800">Plate Lunch Culture</h5>
                    <ul className="text-sm text-gray-700 space-y-1 mt-1">
                      <li>• Plate lunch reflects Hawaii's multicultural workforce</li>
                      <li>• Usually includes rice, macaroni salad, and protein</li>
                      <li>• Portions are generous - consider sharing</li>
                      <li>• Each culture contributed to this local tradition</li>
                      <li>• Best found at local drive-ins and mom-and-pop shops</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-lg mb-4">Sustainable & Local Eating</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-green-800 mb-2">Choose Local When Possible</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Hawaii-grown coffee (Kona, Ka'u, other regions)</li>
                      <li>• Local fruits: liliko'i, rambutan, dragon fruit</li>
                      <li>• Hawaiian-raised beef and pork</li>
                      <li>• Local fish: mahi-mahi, ono, opakapaka</li>
                      <li>• Farmers market produce</li>
                      <li>• Hawaiian sea salt and honey</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-green-800 mb-2">Environmental Considerations</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Choose restaurants using local ingredients</li>
                      <li>• Avoid imported tropical fruits available locally</li>
                      <li>• Support sustainable fishing practices</li>
                      <li>• Bring reusable containers for takeout</li>
                      <li>• Compost food waste when possible</li>
                      <li>• Choose tap water over bottled when safe</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'nature':
        return (
          <div className="space-y-6">
            <div className="bg-emerald-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-800 mb-4">Hawaii's Natural Environment</h3>
              <p className="text-gray-700">
                Hawaii's isolated location created unique ecosystems found nowhere else on Earth. 
                Understanding and protecting these environments is crucial for their survival.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Waves className="h-5 w-5 text-blue-600" />
                  Marine Environment
                </h4>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-2">Coral Reefs</h5>
                      <p className="text-sm text-blue-700 mb-2">
                        Hawaii's coral reefs support 25% of Pacific marine species despite covering less than 1% of ocean area.
                      </p>
                      <ul className="text-xs text-blue-600 space-y-1">
                        <li>• Home to over 7,000 marine species</li>
                        <li>• Provide coastal protection from storms</li>
                        <li>• Extremely sensitive to temperature and chemicals</li>
                        <li>• Take centuries to grow, minutes to destroy</li>
                      </ul>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <h5 className="font-medium text-teal-800 mb-2">Protected Species</h5>
                      <ul className="text-sm text-teal-700 space-y-1">
                        <li>• Hawaiian monk seals (critically endangered)</li>
                        <li>• Green sea turtles (honu)</li>
                        <li>• Hawaiian spinner dolphins</li>
                        <li>• Humpback whales (winter visitors)</li>
                        <li>• Various endemic fish species</li>
                      </ul>
                      <p className="text-xs text-teal-600 mt-2">
                        Federal law requires maintaining distance from all marine mammals
                      </p>
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h5 className="font-medium text-red-800 mb-2">⚠️ Major Threats</h5>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Chemical sunscreens (oxybenzone, octinoxate cause coral bleaching)</li>
                      <li>• Physical damage from touching, stepping, or anchoring</li>
                      <li>• Pollution and runoff from land activities</li>
                      <li>• Climate change and ocean warming</li>
                      <li>• Overfishing and invasive species</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Mountain className="h-5 w-5 text-green-600" />
                  Terrestrial Ecosystems
                </h4>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h5 className="font-medium text-green-800">Native Plants</h5>
                      <ul className="text-sm text-green-700 space-y-1 mt-1">
                        <li>• Koa trees (sacred, used for canoes)</li>
                        <li>• Ohia lehua (native forest trees)</li>
                        <li>• Native ferns and grasses</li>
                        <li>• Coastal naupaka</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <h5 className="font-medium text-yellow-800">Native Birds</h5>
                      <ul className="text-sm text-yellow-700 space-y-1 mt-1">
                        <li>• Hawaiian goose (nēnē)</li>
                        <li>• Hawaiian hawk (io)</li>
                        <li>• Hawaiian coot (alae keokeo)</li>
                        <li>• Hawaiian honeycreepers</li>
                      </ul>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <h5 className="font-medium text-orange-800">Invasive Threats</h5>
                      <ul className="text-sm text-orange-700 space-y-1 mt-1">
                        <li>• Feral pigs damage native forests</li>
                        <li>• Introduced plants outcompete natives</li>
                        <li>• Cats threaten ground-nesting birds</li>
                        <li>• Microorganisms spread by humans</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">Volcanic Landscapes</h5>
                    <p className="text-sm text-purple-700 mb-2">
                      Hawaii's volcanoes continue creating new land, supporting unique ecosystems at different elevations.
                    </p>
                    <ul className="text-sm text-purple-600 space-y-1">
                      <li>• Coastal lowlands with salt-tolerant plants</li>
                      <li>• Tropical rainforests in valleys and windward slopes</li>
                      <li>• Dry forests on leeward sides</li>
                      <li>• Alpine shrublands on mountain peaks</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-lg mb-4">How You Can Help Protect Nature</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h5 className="font-medium text-green-800">On Land</h5>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Stay on designated trails always</li>
                        <li>• Don't pick or disturb any plants</li>
                        <li>• Clean shoes between different areas</li>
                        <li>• Don't feed any wild animals</li>
                        <li>• Pack out all trash and organic waste</li>
                        <li>• Report invasive species sightings</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h5 className="font-medium text-blue-800">In Water</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Use only reef-safe mineral sunscreens</li>
                        <li>• Look but don't touch marine life</li>
                        <li>• Don't stand on or touch coral</li>
                        <li>• Maintain legal distances from animals</li>
                        <li>• Choose eco-certified tour operators</li>
                        <li>• Never chase or corner marine animals</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'arts':
        return (
          <div className="space-y-6">
            <div className="bg-pink-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-pink-800 mb-4">Hawaiian Arts, Crafts & Cultural Expressions</h3>
              <p className="text-gray-700">
                Hawaiian arts reflect deep connections to nature, spirituality, and community. 
                Understanding their significance helps visitors appreciate authentic cultural expressions.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-lg mb-4">Traditional Arts & Crafts</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-red-500 pl-4">
                      <h5 className="font-medium text-red-800">Kapa (Bark Cloth)</h5>
                      <p className="text-sm text-gray-700 mt-1">
                        Made from beaten bark of paper mulberry tree. Traditionally used for clothing, 
                        blankets, and ceremonial purposes. Designs carry genealogical and spiritual significance.
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h5 className="font-medium text-blue-800">Lauhala Weaving</h5>
                      <p className="text-sm text-gray-700 mt-1">
                        Weaving pandanus leaves into baskets, mats, and hats. Each region has distinct patterns. 
                        Requires harvesting, preparing, and dyeing leaves - a time-intensive art form.
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h5 className="font-medium text-green-800">Woodcarving</h5>
                      <p className="text-sm text-gray-700 mt-1">
                        Carving sacred koa wood into bowls, weapons, and ceremonial objects. Traditional tools 
                        and techniques passed down through generations. Each piece connects to spiritual beliefs.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h5 className="font-medium text-purple-800">Lei Making</h5>
                      <p className="text-sm text-gray-700 mt-1">
                        Art of stringing flowers, leaves, shells, or feathers. Different styles for different 
                        occasions. Feather lei were reserved for royalty. Giving lei expresses aloha.
                      </p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h5 className="font-medium text-yellow-800">Petroglyphs (Ki'i pohaku)</h5>
                      <p className="text-sm text-gray-700 mt-1">
                        Rock carvings telling stories, marking boundaries, or recording events. Found throughout 
                        Hawaii. Sacred sites that should never be touched or traced.
                      </p>
                    </div>
                    <div className="border-l-4 border-teal-500 pl-4">
                      <h5 className="font-medium text-teal-800">Stone Tools & Weapons</h5>
                      <p className="text-sm text-gray-700 mt-1">
                        Sophisticated tools made from basalt and other volcanic rocks. Included fishhooks, 
                        poi pounders, and ceremonial weapons. Each tool required specialized knowledge.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-lg mb-4">Performing Arts</h4>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h5 className="font-medium text-orange-800 mb-2">Hula</h5>
                      <p className="text-sm text-orange-700 mb-2">
                        Sacred dance telling stories through movement. Two main types:
                      </p>
                      <ul className="text-sm text-orange-600 space-y-1">
                        <li>• Hula kahiko - Ancient, sacred hula with traditional instruments</li>
                        <li>• Hula auana - Modern hula with contemporary music</li>
                        <li>• Each movement has meaning and tells part of the story</li>
                        <li>• Traditionally performed to honor gods and chiefs</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-2">Mele (Chanting & Music)</h5>
                      <p className="text-sm text-green-700 mb-2">
                        Oral tradition preserving history, genealogy, and spiritual knowledge.
                      </p>
                      <ul className="text-sm text-green-600 space-y-1">
                        <li>• Oli - Traditional chanting without instruments</li>
                        <li>• Mele hula - Chants that accompany hula</li>
                        <li>• Contains historical and genealogical information</li>
                        <li>• Requires years of training to master</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">Traditional Instruments</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="font-medium text-blue-700">Ipu</p>
                        <p className="text-xs text-blue-600">Gourd drums</p>
                      </div>
                      <div>
                        <p className="font-medium text-blue-700">Pahu</p>
                        <p className="text-xs text-blue-600">Shark skin drums</p>
                      </div>
                      <div>
                        <p className="font-medium text-blue-700">Ili ili</p>
                        <p className="text-xs text-blue-600">Stone castanets</p>
                      </div>
                      <div>
                        <p className="font-medium text-blue-700">Pu</p>
                        <p className="text-xs text-blue-600">Conch shell horn</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-lg mb-4">Experiencing Arts Respectfully</h4>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-2">✅ Respectful Ways to Experience</h5>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Attend authentic cultural performances at museums or cultural centers</li>
                        <li>• Learn from Native Hawaiian practitioners and artists</li>
                        <li>• Purchase authentic items directly from Hawaiian artisans</li>
                        <li>• Take classes to understand the cultural context</li>
                        <li>• Ask questions respectfully and listen actively</li>
                        <li>• Support cultural preservation organizations</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h5 className="font-medium text-red-800 mb-2">❌ What to Avoid</h5>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• Buying mass-produced "Hawaiian" items made elsewhere</li>
                        <li>• Treating hula as entertainment without understanding its significance</li>
                        <li>• Touching or photographing sacred objects without permission</li>
                        <li>• Copying traditional designs without understanding their meaning</li>
                        <li>• Using Hawaiian symbols inappropriately (costumes, decorations)</li>
                        <li>• Supporting cultural appropriation over authentic appreciation</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h5 className="font-medium text-yellow-800 mb-2">Understanding vs. Appropriation</h5>
                    <p className="text-sm text-yellow-700">
                      Cultural appreciation involves learning, respecting, and supporting the culture and its people. 
                      Appropriation involves taking elements without permission, understanding, or credit. 
                      Always ask: "Am I learning from or taking from this culture?"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-tropical-600 to-blue-600 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Comprehensive Hawaii Cultural Guide</h2>
        <p className="text-tropical-100">
          Deepen your understanding of Hawaiian culture, history, and responsible travel practices
        </p>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Navigation Sidebar */}
        <div className="lg:w-1/4 bg-gray-50 p-4 border-r">
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                  selectedSection === section.id
                    ? 'bg-tropical-100 text-tropical-800 border border-tropical-200'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <div>
                  <p className="font-medium">{section.title}</p>
                </div>
                {selectedSection === section.id && (
                  <ChevronRight className="h-4 w-4 ml-auto text-tropical-600" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:w-3/4 p-6">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}