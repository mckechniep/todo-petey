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
  const [currentView, setCurrentView] = useState("week");
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
    let element = document.elementFromPoint(dropPosition.x, dropPosition.y);
    
    console.log("Initial drop element:", element);

    // Handle drop on events container
    if (element.classList.contains('rbc-events-container')) {
        const dayColumn = element.closest('.rbc-day-slot');
        if (dayColumn) {
            // Get the header for this column to extract the date
            const allColumns = Array.from(dayColumn.parentElement.children);
            const columnIndex = allColumns.indexOf(dayColumn);
            const headers = document.querySelectorAll('.rbc-header');
            const header = headers[columnIndex];
            
            // Get current view's start date from Calendar
            const viewStart = currentDate;
            const dropDate = new Date(viewStart);
            dropDate.setDate(dropDate.getDate() + columnIndex);
            
            // Calculate time from vertical position
            const containerRect = element.getBoundingClientRect();
            const relativeY = dropPosition.y - containerRect.top;
            const containerHeight = containerRect.height;
            
            const totalMinutesInDay = 24 * 60;
            const minutesFromMidnight = (relativeY / containerHeight) * totalMinutesInDay;
            const hours = Math.floor(minutesFromMidnight / 60);
            const minutes = Math.floor(minutesFromMidnight % 60);
            
            // Set the calculated time on our date object
            dropDate.setHours(hours, minutes, 0, 0);
            
            console.log("Calculated drop details:", {
                columnIndex,
                hours,
                minutes,
                dropDate
            });

            setSelectedTodo(todo);
            setSelectedDate(format(dropDate, "yyyy-MM-dd'T'HH:mm"));
            setIsModalOpen(true);
            return;
        }
    }

    // Existing fallback logic for month view...
    const dateCell = element.closest('.rbc-date-cell');
    if (dateCell) {
        const dateAttr = dateCell.getAttribute('data-date');
        if (dateAttr) {
            const dropDateTime = new Date(`${dateAttr}T09:00`);
            setSelectedTodo(todo);
            setSelectedDate(format(dropDateTime, "yyyy-MM-dd'T'HH:mm"));
            setIsModalOpen(true);
        }
    }
};




// ****DOM Strucute Analysis and DOM Header Analysis****
//   const handleDrop = async (todo, monitor) => {
//     const dropPosition = monitor.getClientOffset();
//     let element = document.elementFromPoint(dropPosition.x, dropPosition.y);

//     // Debug DOM structure
//     console.log("DOM Structure Analysis:");
//     let currentElement = element;
//     let depth = 0;
//     while (currentElement && depth < 10) {
//         console.log(`Level ${depth}:`, {
//             element: currentElement,
//             className: currentElement.className,
//             dataDate: currentElement.getAttribute('data-date'),
//             dataTime: currentElement.getAttribute('data-time'),
//             innerHTML: currentElement.innerHTML.substring(0, 100) + '...' // First 100 chars for readability
//         });
//         currentElement = currentElement.parentElement;
//         depth++;
//     }

//     // Additional debugging for header structure
//     console.log("Header Structure:");
//     const headerElements = document.querySelectorAll('.rbc-header');
//     headerElements.forEach((header, index) => {
//         console.log(`Header ${index}:`, {
//             element: header,
//             className: header.className,
//             dataDate: header.getAttribute('data-date'),
//             innerHTML: header.innerHTML
//         });
//     });
// }

  const handleModalSave = async (updatedEvents) => {
    const formattedEvents = updatedEvents.map((event) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
      occurrenceDate: event.occurrenceDate
        ? new Date(event.occurrenceDate)
        : null,
    }));
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
      const updatedEvents = await getCalendarEvents();
      const formattedEvents = updatedEvents.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        occurrenceDate: event.occurrenceDate
          ? new Date(event.occurrenceDate)
          : null,
      }));
      setEvents(formattedEvents);
      setIsModalOpen(false);
      setEditingEvent(null);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

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
        scrollToTime={new Date().setHours(6, 0, 0, 0)}
        step={30}
        components={{
            // Handles tiem slots in week/day views
            timeSlotWrapper: (props) => (
                <div
                    className="rbc-time-slot"
                    data-time={format(props.value, "HH:mm")}
                >
                    {props.children}
                </div>
            ),
            // Handles day columns in week/day views
            dayWrapper: (props) => (
                <div
                    className="rbc-time-column rbc-day-slot"
                    data-date={format(props.value, "yyyy-MM-dd")}
                >
                    {props.children}
                </div>
            ),
            // Handles date cells in month view
            dateCellWrapper: (props) => (
                <div
                    className="rbc-date-cell"
                    data-date={format(props.value, "yyyy-MM-dd")}
                >
                    {props.children}
                </div>
            )
        }}
      />
      <CalendarModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onEventSaved={handleModalSave}
        todo={selectedTodo}
        initialDate={selectedDate}
        editingEvent={editingEvent}
        onEventDeleted={handleEventDelete}
      />
    </div>
  );
};

export default MyCalendar;
