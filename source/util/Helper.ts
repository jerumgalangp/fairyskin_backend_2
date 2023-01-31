var moment = require('moment');

export const addDays = (date: any, days: any) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export const processDueDate = (processDate: any, terms: any, holidays: any) => {
    // console.log("processDate---", processDate);
    // console.log("terms", terms);

    let sD = new Date(processDate);
    let t = parseInt(terms);
    let eD = addDays(sD, t);
    //console.log("ed1", eD);

    sD.setDate(sD.getDate() + 1);

    let h = holidays;

    // console.log('holidays', h);
    // console.log('terms', terms);

    // loop for every day
    for (var day = sD; day <= eD; day.setDate(day.getDate() + 1)) {
        let fD = moment(day).format('MM/DD/yyyy');
        let hasHoliday = h.includes(fD);
        let weekend = new Date(fD).getDay() % 6 === 0 ? true : false;

        //console.log("fD=", fD);
        // console.log("hasHoliday", hasHoliday);
        // console.log("weekend", weekend);

        if (hasHoliday && weekend) eD.setDate(eD.getDate() + 1);
        else if (hasHoliday) eD.setDate(eD.getDate() + 1);
        else if (weekend) eD.setDate(eD.getDate() + 1);
    }

    //console.log("ED", moment(eD).format("MM/DD/yyyy"));

    return moment(eD).format('MM/DD/yyyy');
};

export const generateReferenceNumber = () => {
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();
    let year = new Date().getFullYear();
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();
    let mili = new Date().getMilliseconds();
    //let rand = window.crypto.getRandomValues(new Uint8Array(1))[0];

    return year + '' + minutes + '' + mili + '' + month + '' + seconds + '' + hours + '' + day;
};

export const removeformatMoney = (number: any) => {
    number = number.replace(/,/g, '');
    number = number.replace(/₱/g, '');

    number = number !== undefined && number ? parseFloat(number) : 0;
    return number;
};
