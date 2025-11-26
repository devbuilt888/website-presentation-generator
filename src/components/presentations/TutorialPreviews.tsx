'use client';

export const TutorialFormPreview = () => (
  <div className="w-full max-w-sm mx-auto">
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/60 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
      <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
        Recipient name
      </label>
      <input
        type="text"
        value="John Doe"
        disabled
        className="w-full px-4 py-3 bg-slate-900/70 border border-slate-700 rounded-xl text-white/70 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
      />
      <div className="flex items-center justify-between text-xs text-slate-500 mt-3">
        <span>Press Enter to continue</span>
        <span className="text-indigo-400 font-medium">Required</span>
      </div>
    </div>
  </div>
);

export const TutorialPresentationCardPreview = () => (
  <div className="w-full max-w-xl mx-auto">
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1 space-y-3 text-left">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-white text-lg">John Doe</h3>
            <span className="px-3 py-1 text-xs font-semibold rounded-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow shadow-blue-500/30">
              sent
            </span>
          </div>
          <p className="text-sm text-slate-400">
            john.doe@example.com
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>{new Date().toLocaleDateString()}</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live link ready
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors border border-indigo-500/50 shadow shadow-indigo-500/20">
            Copy Link
          </button>
          <button className="flex-1 md:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-600/50">
            View
          </button>
        </div>
      </div>
    </div>
  </div>
);

