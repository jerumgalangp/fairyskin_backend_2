"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeformatMoney = exports.generateReferenceNumber = exports.processDueDate = exports.addDays = void 0;
var moment = require('moment');
exports.addDays = (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};
exports.processDueDate = (processDate, terms, holidays) => {
    let sD = new Date(processDate);
    let t = parseInt(terms);
    let eD = exports.addDays(sD, t);
    sD.setDate(sD.getDate() + 1);
    let h = holidays;
    for (var day = sD; day <= eD; day.setDate(day.getDate() + 1)) {
        let fD = moment(day).format('MM/DD/yyyy');
        let hasHoliday = h.includes(fD);
        let weekend = new Date(fD).getDay() % 6 === 0 ? true : false;
        if (hasHoliday && weekend)
            eD.setDate(eD.getDate() + 1);
        else if (hasHoliday)
            eD.setDate(eD.getDate() + 1);
        else if (weekend)
            eD.setDate(eD.getDate() + 1);
    }
    return moment(eD).format('MM/DD/yyyy');
};
exports.generateReferenceNumber = () => {
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();
    let year = new Date().getFullYear();
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();
    let mili = new Date().getMilliseconds();
    return year + '' + minutes + '' + mili + '' + month + '' + seconds + '' + hours + '' + day;
};
exports.removeformatMoney = (number) => {
    number = number.replace(/,/g, '');
    number = number.replace(/₱/g, '');
    number = number !== undefined && number ? parseFloat(number) : 0;
    return number;
};
//# sourceMappingURL=Helper.js.map