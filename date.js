exports.getDate = () => {
        const today = new Date();
        const dateOptions = { 
            weekday: 'long', 
            month: 'long',
            day: '2-digit',
        };
        return today.toLocaleDateString("de-DE", dateOptions);
};

exports.getDay = () => {
    const today = new Date();
    const dateOptions = { 
        weekday: 'long', 
    };
    return today.toLocaleDateString("de-DE", dateOptions);
};
