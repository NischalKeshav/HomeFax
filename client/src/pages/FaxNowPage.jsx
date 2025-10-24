function FaxNowPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-black mb-8">
          Public Fax
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Coming Soon - Property Intelligence Platform
        </p>
        <button 
          onClick={() => window.history.back()}
          className="bg-amber-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-900 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default FaxNowPage;
