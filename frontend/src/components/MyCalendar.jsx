import React, { useState, useEffect } from "react";
import {
  saveCalendarEvent,
  getCalendarEvents,
  deleteCalendarEvent,
  updateCalendarEvent,
} from "../services/calendarService.js";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useDrop } from "react-dnd";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarModal from "./CalendarModal";
import { Typography } from "@mui/material";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const MyCalendar = ({ onEventUpdate }) => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [currentView, setCurrentView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getCalendarEvents();
        const formattedEvents = data.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleDrop = async (todo, monitor) => {
    const dropPosition = monitor.getClientOffset();
    const element = document.elementFromPoint(dropPosition.x, dropPosition.y);

    const timeCell = element.closest(".rbc-time-slot");
    const dateCell = element.closest(".rbc-date-cell");

    let dropDateTime = new Date();

    if (timeCell) {
      const parentSlot = timeCell.closest(".rbc-day-slot, .rbc-time-column");
      const date = parentSlot.getAttribute("data-date");
      if (date) {
        dropDateTime = new Date(date);
      }
    } else if (dateCell) {
      const date = dateCell.getAttribute("data-date");
      if (date) {
        dropDateTime = new Date(date);
      }
    }

    setSelectedTodo(todo);
    setSelectedDate(format(dropDateTime, "yyyy-MM-dd'T'HH:mm"));
    setIsModalOpen(true);
  };


  const handleModalSave = (updatedEvents) => {
    // Format all events consistently
    const formattedEvents = updatedEvents.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        occurrenceDate: event.occurrenceDate ? new Date(event.occurrenceDate) : null
    }));

    // Replace entire events state with new array
    setEvents(formattedEvents);
    setIsModalOpen(false);
    setEditingEvent(null);
};



  const handleEventClick = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleEventDelete = async (eventId) => {
    try {
      await deleteCalendarEvent(eventId);
      // Fetch fresh events after deletion to ensure sync
      const updatedEvents = await getCalendarEvents();
      const formattedEvents = updatedEvents.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        occurrenceDate: event.occurrenceDate ? new Date(event.occurrenceDate) : null
      }));
      setEvents(formattedEvents);
      setIsModalOpen(false);
      setEditingEvent(null);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
};


  // const handleEventDelete = async (eventId) => {
  //     try {
  //         await deleteCalendarEvent(eventId);
  //         setEvents(currentEvents => currentEvents.filter(event => event._id !== eventId));
  //     } catch (error) {
  //         console.error('Error deleting event:', error);
  //     }
  // };

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "TODO",
    drop: (item, monitor) => handleDrop(item, monitor),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={dropRef}
      style={{
        height: 800,
        border: isOver ? "2px solid blue" : "none",
        boxShadow: "0 8px 14px rgba(0, 0, 0, 0.15)",
        padding: "20px",
        backgroundColor: "white",
        borderRadius: "8px",
        position: "relative",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: "#1976d2",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          borderBottom: "3px solid #1976d2",
          paddingBottom: "8px",
          marginBottom: "20px",
        }}
      >
        My Calendar
      </Typography>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleEventClick}
        view={currentView}
        onView={setCurrentView}
        date={currentDate}
        onNavigate={setCurrentDate}
        defaultView="week"
        scrollToTime={new Date().setHours(6, 0, 0, 0)}  // This sets default scroll to 6:00 AM
        components={{
          dateCellWrapper: (props) => {
            const { value } = props;
            return (
              <div
                className="rbc-date-cell"
                data-date={format(value, "yyyy-MM-dd")}
              >
                {props.children}
              </div>
            );
          },
          timeSlotWrapper: (props) => {
            const { value } = props;
            return (
              <div
                className="rbc-time-slot"
                data-time={format(value, "HH:mm")}
                data-date={format(value, "yyyy-MM-dd")}
              >
                {props.children}
              </div>
            );
          },
        }}
        style={{
          height: "calc(100% - 80px)", // Subtracting space for the title
          position: "relative",
          zIndex: 1,
        }}
      />
      <CalendarModal
    open={isModalOpen}
    onClose={() => {
        setIsModalOpen(false);
        setEditingEvent(null);
    }}
    onEventSaved={handleModalSave}  // Add this prop
    todo={selectedTodo}
    initialDate={selectedDate}
    editingEvent={editingEvent}
    onEventDeleted={handleEventDelete}
/>

    </div>
  );
};

export default MyCalendar;

// import React, { useState, useEffect } from "react";
// import { saveCalendarEvent, getCalendarEvents } from '../services/calendarService.js';
// import { Calendar, dateFnsLocalizer } from "react-big-calendar";
// import { useDrop } from "react-dnd";
// import { format, parse, startOfWeek, getDay } from "date-fns";
// import enUS from "date-fns/locale/en-US";
// import "react-big-calendar/lib/css/react-big-calendar.css";

// const locales = { "en-US": enUS };
// const localizer = dateFnsLocalizer({
//     format,
//     parse,
//     startOfWeek,
//     getDay,
//     locales,
// });

// const MyCalendar = ({ onEventUpdate }) => {
//     const [events, setEvents] = useState([]);

//     useEffect(() => {
//         const fetchEvents = async () => {
//             try {
//                 const data = await getCalendarEvents();
//                 const formattedEvents = data.map(event => ({
//                     ...event,
//                     start: new Date(event.start),
//                     end: new Date(event.end)
//                 }));
//                 setEvents(formattedEvents);
//             } catch (error) {
//                 console.error('Error fetching events:', error);
//             }
//         };
//         fetchEvents();
//     }, []);

//     const handleDrop = async (todo, monitor) => {
//         const dropPosition = monitor.getClientOffset();
//         const dateCell = document.elementFromPoint(dropPosition.x, dropPosition.y);
//         const targetCell = dateCell.closest('.rbc-date-cell');

//         if (targetCell) {
//             const dateAttribute = targetCell.getAttribute('data-date');
//             if (dateAttribute) {
//                 const targetDate = new Date(dateAttribute);
//                 const newEvent = {
//                     title: todo.title,
//                     start: targetDate,
//                     end: new Date(targetDate.getTime() + 60 * 60 * 1000),
//                     todoId: todo._id,
//                     description: todo.description
//                 };

//                 try {
//                     const savedEvent = await saveCalendarEvent(newEvent);

//                     const formattedEvent = {
//                         ...savedEvent,
//                         start: new Date(savedEvent.start),
//                         end: new Date(savedEvent.end)
//                     };

//                     setEvents(currentEvents => [...currentEvents, formattedEvent]);

//                 } catch (error) {
//                     console.error('Error saving event:', error);
//                 }
//             }
//         }
//     };

//     const [{ isOver }, dropRef] = useDrop(() => ({
//         accept: "TODO",
//         drop: (item, monitor) => handleDrop(item, monitor),
//         collect: (monitor) => ({
//             isOver: !!monitor.isOver(),
//         }),
//     }));

//     return (
//         <div
//             ref={dropRef}
//             style={{
//                 height: 500,
//                 border: isOver ? "2px dashed blue" : "none",
//             }}
//         >
//             <Calendar
//                 key={events.length}
//                 localizer={localizer}
//                 events={events}
//                 startAccessor="start"
//                 endAccessor="end"
//                 components={{
//                     dateCellWrapper: (props) => {
//                         const { value } = props;
//                         return (
//                             <div
//                                 className="rbc-date-cell"
//                                 data-date={value.toISOString()}
//                             >
//                                 {props.children}
//                             </div>
//                         );
//                     }
//                 }}
//                 style={{ height: "100%" }}
//             />
//         </div>
//     );
// };

// export default MyCalendar;
