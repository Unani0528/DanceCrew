import React from 'react';
import type { KeyKeyword } from '../../types';

interface KeyKeywordsProps {
  keywords: KeyKeyword[];
}

const KeywordTag: React.FC<{ keyword: KeyKeyword }> = ({ keyword }) => {
  const baseClasses = "px-3 py-1 text-sm font-medium rounded-full";
  const positiveClasses = "bg-green-100 text-green-800";
  const negativeClasses = "bg-red-100 text-red-800";

  return (
    <span className={`${baseClasses} ${keyword.sentiment === 'positive' ? positiveClasses : negativeClasses}`}>
      {keyword.keyword}
    </span>
  );
};

const KeyKeywords: React.FC<KeyKeywordsProps> = ({ keywords }) => {
  const positiveKeywords = keywords.filter(k => k.sentiment === 'positive');
  const negativeKeywords = keywords.filter(k => k.sentiment === 'negative');

  return (
    <div>
       <h4 className="text-lg font-bold mb-4 text-gray-900 text-center lg:text-left">핵심 키워드</h4>
       <div className="grid grid-cols-2 gap-4">
          <div>
            <h5 className="font-semibold text-green-600 mb-3 text-center">긍정 키워드</h5>
            <div className="flex flex-wrap gap-2 justify-center">
              {positiveKeywords.map(kw => <KeywordTag key={kw.keyword} keyword={kw} />)}
            </div>
          </div>
           <div>
            <h5 className="font-semibold text-red-600 mb-3 text-center">부정 키워드</h5>
            <div className="flex flex-wrap gap-2 justify-center">
              {negativeKeywords.map(kw => <KeywordTag key={kw.keyword} keyword={kw} />)}
            </div>
          </div>
       </div>
    </div>
  );
};

export default KeyKeywords;