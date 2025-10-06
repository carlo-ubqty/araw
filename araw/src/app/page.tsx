"use client";

export default function MockupPreview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">🌏</span>
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold">ARAW Climate Finance Dashboard</h1>
                <p className="text-purple-100 text-sm">Department of Finance - Republic of the Philippines</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-white text-sm font-semibold">Version 3.1 - Design Preview</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* PDF Viewer */}
          <div className="relative">
            <iframe
              src="/mockup.pdf"
              className="w-full h-[calc(100vh-200px)] border-0"
              title="ARAW Dashboard Mockup"
            />
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <p className="text-white text-lg font-semibold">System Under Development</p>
          </div>
          <p className="text-purple-100 text-sm mb-4">
            This is a preview of the ARAW Climate Finance Dashboard Version 3.1 design.
            The full interactive application is currently in active development.
          </p>
          <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-purple-200 text-xs uppercase tracking-wide mb-1">Data Sources</p>
              <p className="text-white text-2xl font-bold">165+</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-purple-200 text-xs uppercase tracking-wide mb-1">Agencies</p>
              <p className="text-white text-2xl font-bold">20+</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-purple-200 text-xs uppercase tracking-wide mb-1">Technology</p>
              <p className="text-white text-lg font-bold">Next.js 15</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-purple-200 text-xs uppercase tracking-wide mb-1">Timeline</p>
              <p className="text-white text-lg font-bold">Oct 2025</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-purple-200 text-sm">
        <p>Project Manager: Jhonnel | For: Asst. Secretary Angie</p>
        <p className="mt-1">October 2025 Deployment</p>
      </footer>
    </div>
  );
}
