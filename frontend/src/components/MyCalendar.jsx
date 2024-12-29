import React, { useState, useEffect } from "react";
import { saveCalendarEvent, getCalendarEvents } from '../services/calendarService.js';
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useDrop } from "react-dnd";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

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

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getCalendarEvents();
                const formattedEvents = data.map(event => ({
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end)
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    const handleDrop = async (todo, monitor) => {
        const dropPosition = monitor.getClientOffset();
        const dateCell = document.elementFromPoint(dropPosition.x, dropPosition.y);
        const targetCell = dateCell.closest('.rbc-date-cell');
        
        if (targetCell) {
            const dateAttribute = targetCell.getAttribute('data-date');
            if (dateAttribute) {
                const targetDate = new Date(dateAttribute);
                const newEvent = {
                    title: todo.title,
                    start: targetDate,
                    end: new Date(targetDate.getTime() + 60 * 60 * 1000),
                    todoId: todo._id,
                    description: todo.description
                };

                try {
                    const savedEvent = await saveCalendarEvent(newEvent);
                    
                    const formattedEvent = {
                        ...savedEvent,
                        start: new Date(savedEvent.start),
                        end: new Date(savedEvent.end)
                    };

                    setEvents(currentEvents => [...currentEvents, formattedEvent]);
                    
                } catch (error) {
                    console.error('Error saving event:', error);
                }
            }
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
                height: 500,
                border: isOver ? "2px dashed blue" : "none",
            }}
        >
            <Calendar
                key={events.length}
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                components={{
                    dateCellWrapper: (props) => {
                        const { value } = props;
                        return (
                            <div
                                className="rbc-date-cell"
                                data-date={value.toISOString()}
                            >
                                {props.children}
                            </div>
                        );
                    }
                }}
                style={{ height: "100%" }}
            />
        </div>
    );
};

export default MyCalendar;
