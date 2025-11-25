import EventCard from './EventCard';

const EventsGrid = ({ events, isDarkMode }) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No events found matching your search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} isDarkMode={isDarkMode} />
      ))}
    </div>
  );
};

export default EventsGrid;