import type { Narrative } from '../../types';

interface NarrativeExtractorProps {
  narratives: Narrative[];
}

export default function NarrativeExtractor({ narratives }: NarrativeExtractorProps) {
  const positiveNarratives = narratives.filter(n => n.sentiment === 'positive');
  const negativeNarratives = narratives.filter(n => n.sentiment === 'negative');

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">시장 내러티브</h3>
      
      <div className="space-y-6">
        {/* 긍정 내러티브 */}
        {positiveNarratives.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h4 className="font-medium text-green-400">긍정 내러티브</h4>
            </div>
            <div className="space-y-3">
              {positiveNarratives.map((narrative) => (
                <div
                  key={narrative.id}
                  className="bg-green-900 bg-opacity-20 border border-green-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-green-300">{narrative.theme}</h5>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${narrative.strength * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">
                        {(narrative.strength * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {narrative.examples.map((example, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-800 bg-opacity-50 rounded text-xs text-green-200">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 부정 내러티브 */}
        {negativeNarratives.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h4 className="font-medium text-red-400">부정 내러티브</h4>
            </div>
            <div className="space-y-3">
              {negativeNarratives.map((narrative) => (
                <div
                  key={narrative.id}
                  className="bg-red-900 bg-opacity-20 border border-red-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-red-300">{narrative.theme}</h5>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${narrative.strength * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">
                        {(narrative.strength * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {narrative.examples.map((example, idx) => (
                      <span key={idx} className="px-2 py-1 bg-red-800 bg-opacity-50 rounded text-xs text-red-200">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
