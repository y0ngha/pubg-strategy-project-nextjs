export function toYyyyMmDdString(_date: Date, seperator: string = '-') {
    const year = _date.getFullYear().toString();
    const month = (_date.getMonth() + 1).toString().padStart(2, '0');
    const date = _date.getDate().toString().padStart(2, '0');

    return `${year}${seperator}${month}${seperator}${date}`;
}

export function toYyyyMmDdHhMmString(
    _date: Date,
    dateSeperator: string = '-',
    timeSeperator: string = ':'
) {
    const hour = _date.getHours().toString().padStart(2, '0');
    const minute = _date.getMinutes().toString().padStart(2, '0');

    return `${toYyyyMmDdString(_date, dateSeperator)} ${hour}${timeSeperator}${minute}`;
}
