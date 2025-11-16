import React from 'react';

const ErrorIcon = () => (
  <svg className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-slate-800/50 border border-red-500/30 rounded-lg p-8 text-center max-w-md">
      <ErrorIcon />
      <h3 className="text-xl font-bold text-slate-100 mb-2">오류 발생</h3>
      <p className="text-slate-400 mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-cyan-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-cyan-600 transition-colors"
        >
          다시 시도
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
