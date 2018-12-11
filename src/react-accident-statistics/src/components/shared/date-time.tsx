import * as React from 'react';

export interface DateTimeProps {
    date?: string | Date | number;
}

export function DateTime(props: DateTimeProps) {
    const date = props.date ? new Date(props.date) : undefined;
    return (
        <time dateTime={date ? date.toISOString() : undefined}>{date ? `${date.toDateString()} ${date.toLocaleTimeString('en-US')}` : undefined}</time>
    );
}
