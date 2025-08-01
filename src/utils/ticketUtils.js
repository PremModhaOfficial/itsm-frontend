// src/utils/ticketUtils.js
import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Formats a date string into a consistent, readable format.
 * Example: "April 5, 2024 at 4:30 PM"
 * @param {string | Date} dateInput - The date to format (ISO string or Date object).
 * @returns {string} The formatted date string.
 */
export const formatTicketDate = (dateInput) => {
    if (!dateInput) return 'N/A';
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    return format(date, "MMMM d, yyyy 'at' h:mm a");
};

/**
 * Formats a date string into a relative time string.
 * Example: "about 3 hours ago"
 * @param {string | Date} dateInput - The date to format.
 * @returns {string} The relative time string.
 */
export const formatRelativeTime = (dateInput) => {
    if (!dateInput) return '';
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    return formatDistanceToNow(date, { addSuffix: true });
};

/**
 * Normalizes and merges work_logs and audit_trail into a single, sorted activity feed.
 * @param {object} ticket - The ticket object from the database.
 * @returns {Array<object>} A sorted array of activity items.
 */
export const getCombinedActivityFeed = (ticket) => {
    const feed =;

    // Add the creation event
    feed.push({
        id: `creation-${ticket.id}`,
        type: 'creation',
        timestamp: ticket.created_at,
        author: {
            name: ticket.requester?.name |

| 'System'
        },
        content: `Ticket created by ${ticket.requester?.name |

| 'requester'}.`,
    });

    // Normalize work logs
    (ticket.work_logs ||).forEach((log, index) => {
        feed.push({
            id: `worklog-${index}`,
            type: 'comment',
            timestamp: log.timestamp,
            author: { name: log.authorName, avatarUrl: log.authorAvatar },
            content: log.note,
        });
    });

    // Normalize audit trail
    (ticket.audit_trail ||).forEach((audit, index) => {
        feed.push({
            id: `audit-${index}`,
            type: audit.type, // e.g., 'status_change', 'assignment', 'field_update'
            timestamp: audit.timestamp,
            author: { name: audit.userName },
            content: audit.details, // e.g., { field: 'priority', from: 'low', to: 'high' }
        });
    });

    // Sort the combined feed by timestamp, descending (most recent first)
    feed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return feed;
};
