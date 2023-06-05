export default [
    {
        title: 'Dashboard',
        icon: { icon: 'mdi-home-outline' },
        to: 'dashboard',
        action: 'read',
        subject: 'Auth',
    },
    { heading: 'Admin' },
    {
        title: 'Users',
        icon: { icon: 'mdi-users' },
        to: 'admin-users'
    },
    {
        title: 'Applications',
        icon: { icon: 'mdi-view-grid-outline' },
        to: 'admin-applications'
    },
    {
        title: 'Announcements',
        icon: { icon: 'mdi-party-popper' },
        to: 'admin-announcements'
    },
]
