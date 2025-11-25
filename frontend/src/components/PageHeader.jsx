const PageHeader = ({ title, subtitle }) => {
  return (
    <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: '#ffffff' }}>
          {title}
        </h1>
        <p className="text-blue-100" style={{ color: '#dbeafe' }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default PageHeader;