export enum TicketState {
    active = 'active',
    pending = 'pending',
    inactive = 'inactive',
    closed = 'closed',
}

// tickets are automatically inactive from creation, that is no one is attending to it.
// when being attended to, the state changes to pending, ticket is there but can be resolved immediaately.
// when being escalated, the state changes to active
// when ticket has been fixed, it is closed