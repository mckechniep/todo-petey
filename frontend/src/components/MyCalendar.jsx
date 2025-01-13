import React, { useState, useEffect, useRef } from "react";
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
  const [viewStart, setViewStart] = useState(startOfWeek(new Date()));
  const viewStartRef = useRef(viewStart);

  // Update the ref whenever `viewStart` changes
  useEffect(() => {
    viewStartRef.current = viewStart;
  }, [viewStart]);

  const handleNavigate = (date) => {
    console.log("Navigated to date:", date);
    setViewStart(startOfWeek(date));
    setCurrentDate(date);
  };

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

    // Detect the active view button
    const activeButton = document.querySelector("button.rbc-active");
    const activeView = activeButton
      ? activeButton.textContent.trim().toLowerCase()
      : null;

    // WEEKLY VIEW LOGIC
    if (activeView === "week") {
      console.log("Weekly view detected. Element at drop position:", element);

      // Locate the column (`.rbc-time-column`)
      const dayColumn = element.closest(".rbc-day-slot.rbc-time-column");

      if (dayColumn) {
        // Find all columns
        const allColumns = Array.from(dayColumn.parentElement.children);

        // Get the column index
        const columnIndex = allColumns.indexOf(dayColumn) - 1;

        console.log("Matched column index:", columnIndex);

        if (columnIndex >= 0) {
          // Calculate the drop date based on the week's start (viewStart)
          const dropDate = new Date(viewStartRef.current);
          dropDate.setDate(viewStartRef.current.getDate() + columnIndex);

          console.log("Date before time adjustment:", dropDate);

          // Calculate the time from the vertical position
          const containerRect = element.getBoundingClientRect(); // Retrieves size and position of element relative to viewport. The returned containerRect object will have properties like top, bottom, left, right, width and height
          const relativeY = dropPosition.y - containerRect.top; // Determines where inside the container that the vertical drop location is. Subtracts the containers top boundy containerRect.top from the drop's Y-coordinate. 
          const containerHeight = containerRect.height; // Stores container height in pixels.

          const totalMinutesInDay = 24 * 60; // Total minutes in a day = 1440
          const minutesFromMidnight = // Translates Y-coordinate of the drop into a time value
            (relativeY / containerHeight) * totalMinutesInDay; // Dividing relativeY by containerHeight gets the drop position as a percentage of the container height. Multiply this % by totalMinutesInDay to get a time relative to midnight.
          const hours = Math.floor(minutesFromMidnight / 60); // Gives us the hour of the day that corresponds to the drop location by converting minutes since midnight into hours (by dividing 60 and then rounding down)
          const minutes = Math.floor((minutesFromMidnight % 60) / 30) * 30; // minutesFromMidnight % 60 finds leftover minutes after full hours. Divide this by 30 to determin how many half-hour intervals exist within this current hour (which is represented in minutes). Multiply by 30 and round to get nearest 30 min interval.

          dropDate.setHours(hours, minutes, 0, 0);

          console.log("Final drop date for weekly view:", dropDate);

          // Update state and open modal
          setSelectedTodo(todo);
          setSelectedDate(format(dropDate, "yyyy-MM-dd'T'HH:mm"));
          setIsModalOpen(true);
          return;
        }
      }
    } else if (activeView === "day") {
      // DAY VIEW LOGIC
      const headerSpan = document.querySelector('span[role="columnheader"]');
      const headerDate = headerSpan ? headerSpan.textContent.trim() : null;

      if (headerDate) {
        const day = headerDate.split(" ")[0];
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        const dropDate = new Date(year, month, parseInt(day));
        const containerRect = element.getBoundingClientRect();
        const relativeY = dropPosition.y - containerRect.top;
        const containerHeight = containerRect.height;

        const totalMinutesInDay = 24 * 60;
        const minutesFromMidnight =
          (relativeY / containerHeight) * totalMinutesInDay;
        const hours = Math.floor(minutesFromMidnight / 60);
        const minutes = Math.floor(minutesFromMidnight % 60);

        dropDate.setHours(hours, minutes, 0, 0);

        setSelectedTodo(todo);
        setSelectedDate(format(dropDate, "yyyy-MM-dd'T'HH:mm"));
        setIsModalOpen(true);
        return;
      }
    } else if (activeView === "month") {
      // MONTH VIEW LOGIC
      const dateCell = element.closest(".rbc-date-cell");
      if (dateCell) {
        const dateAttr = dateCell.getAttribute("data-date");
        if (dateAttr) {
          const dropDateTime = new Date(`${dateAttr}T09:00`);
          setSelectedTodo(todo);
          setSelectedDate(format(dropDateTime, "yyyy-MM-dd'T'HH:mm"));
          setIsModalOpen(true);
        }
      }
    }
  };

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
        height: '100%',
        border: isOver ? "2px solid blue" : "none",
        boxShadow: "0 8px 14px rgba(0, 0, 0, 0.15)",
        padding: "20px",
        backgroundColor: "white",
        borderRadius: "8px",
        overflow: "scroll",
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
        onNavigate={handleNavigate}
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
          ),
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
