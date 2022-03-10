const moment = require("moment");
const findUserWithOutRoleByEmail = (email) => {
    const models = global.app.orm.sequelize.models;
    return models.person.findOne({
        where: {
            email
        },
        include: [{
            association: "role"
        }]
    })
}

const findUser = (username) => {
    const models = global.app.orm.sequelize.models;
    return models.person.findOne({
        where: {
            username
        },
        include: [{
            association: "role"
        }]
    })
}

const DateTimezone = (date) => {
    if(!Date[Symbol.hasInstance](date)){
        date = new Date(date)
        if(date.toString() === 'Invalid Date'){
            date = null
        }
    }
    date = date ? moment(date, global.app.config.get('TZ')).format(moment.defaultFormatUtc) : null
    return date;
}

// const GetTimeTimezone = (date) => {
//     if(!Date[Symbol.hasInstance](date)){
//         date = new Date(date)
//         if(date.toString() === 'Invalid Date'){
//             date = null
//         }
//     }
//     date = date ? date.toLocaleString("en-US", {timeZone: "Cuba"}) : null
//     return date;
// }

const DateTimeZoneWithOutDate = () => {
    return moment(new Date(), global.app.config.get('TZ')).format(moment.defaultFormatUtc)
}

// const GetTimeTimeZoneWithOutDate = () => {
//     return (new Date()).toLocaleString("en-US", {timeZone: "Cuba"});
// }

module.exports = {
    findUserWithOutRoleByEmail,
    findUser,
    DateTimezone,
    DateTimeZoneWithOutDate
    // GetTimeTimezone,
    // GetTimeTimeZoneWithOutDate
}

// Esto es una manera de solucionar el problema de la zona horaria con los Date
// const lastLogin = moment().format(moment.defaultFormatUtc)
// const lastLogin = moment.tz(new Date(), 'Cuba').format(moment.defaultFormatUtc)
// const lastLogin = moment(new Date()).format(moment.defaultFormatUtc)